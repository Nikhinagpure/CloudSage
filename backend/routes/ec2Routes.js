const { CostExplorerClient, GetCostAndUsageCommand } = require("@aws-sdk/client-cost-explorer");
const express = require("express");
const router = express.Router();
const ec2Client = require("../config/awsConfig");
const { DescribeInstancesCommand ,DescribeVolumesCommand } = require("@aws-sdk/client-ec2");
const { CloudWatchClient, GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");
const db = require("../config/db");

const cloudWatchClient = new CloudWatchClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

router.get("/ec2", async (req, res) => {
  try {
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);

    const instances = [];

    // ✅ Clear table first
    await db.query("DELETE FROM ec2_data");

    for (const reservation of response.Reservations) {
      for (const instance of reservation.Instances) {

        const instanceId = instance.InstanceId;
        const instanceType = instance.InstanceType;
        const state = instance.State.Name;
        const region = process.env.AWS_REGION;
        const availabilityZone = instance.Placement.AvailabilityZone;
        const publicIp = instance.PublicIpAddress || null;
        const launchTime = instance.LaunchTime;

        // ✅ Insert into PostgreSQL
        await db.query(
          `INSERT INTO ec2_data 
          (instance_id, instance_type, state, region, availability_zone, public_ip, launch_time)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            instanceId,
            instanceType,
            state,
            region,
            availabilityZone,
            publicIp,
            launchTime
          ]
        );

        instances.push({
          instanceId,
          instanceType,
          state,
          region,
        });
      }
    }

    res.json(instances);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch EC2 instances" });
  }
});

router.get("/ec2/db", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ec2_data ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch EC2 data from DB" });
  }
});

router.get("/cost", async (req, res) => {
  try {
    const costClient = new CostExplorerClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    // ✅ Generate valid date range (last 7 days)
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - 7);
    const startDate = startDateObj.toISOString().split("T")[0];

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startDate,
        End: endDate,
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
    });

    const response = await costClient.send(command);

    // Clear old cost data
    await db.query("DELETE FROM cost_data");

    const results = response.ResultsByTime;

    for (const day of results) {
      const cost = day.Total.UnblendedCost.Amount;
      const date = day.TimePeriod.Start;

      await db.query(
        `INSERT INTO cost_data (service, cost, date)
         VALUES ($1, $2, $3)`,
        ["AWS Total", cost, date]
      );
    }

    res.json({ message: "Cost data stored successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cost data" });
  }
});

router.get("/cost/db", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM cost_data ORDER BY date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cost data from DB" });
  }
});

router.get("/summary", async (req, res) => {
  try {

    // Total EC2 instances
    const totalInstances = await db.query(
      "SELECT COUNT(*) FROM ec2_data"
    );

    // Running EC2 instances
    const runningInstances = await db.query(
      "SELECT COUNT(*) FROM ec2_data WHERE state = 'running'"
    );

    // Stopped EC2 instances
    const stoppedInstances = await db.query(
      "SELECT COUNT(*) FROM ec2_data WHERE state = 'stopped'"
    );

    // Total AWS Cost
    const totalCost = await db.query(
      "SELECT SUM(cost) FROM cost_data"
    );

    res.json({
      total_instances: totalInstances.rows[0].count,
      running_instances: runningInstances.rows[0].count,
      stopped_instances: stoppedInstances.rows[0].count,
      total_cost: totalCost.rows[0].sum || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch summary data" });
  }
});

router.get("/idle-instances", async (req, res) => {
  try {

    const result = await db.query(
      "SELECT instance_id, instance_type, state FROM ec2_data WHERE state = 'stopped'"
    );

    const idleInstances = result.rows.map(instance => ({
      instance_id: instance.instance_id,
      instance_type: instance.instance_type,
      state: instance.state,
      recommendation:
        "Instance is stopped. Consider terminating it to save cost."
    }));

    res.json(idleInstances);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to detect idle instances" });
  }
});

router.post("/sync", async (req, res) => {
  try {

    // Call existing APIs internally
    await fetch("http://localhost:5000/api/aws/ec2");
    await fetch("http://localhost:5000/api/aws/cost");

    res.json({
      message: "AWS data synchronized successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to sync AWS data"
    });
  }
});

router.get("/recommendations", async (req, res) => {
  try {

    const result = await db.query(
      "SELECT instance_id, instance_type, state FROM ec2_data"
    );

    const recommendations = [];

    result.rows.forEach(instance => {

      if (instance.state === "stopped") {
        recommendations.push({
          type: "idle-instance",
          instance_id: instance.instance_id,
          instance_type: instance.instance_type,
          issue: "Instance is stopped",
          recommendation:
            "Terminate instance if not needed to avoid unnecessary storage cost."
        });
      }

    });

    res.json(recommendations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate recommendations"
    });
  }
});

router.get("/cost-trend", async (req, res) => {
  try {

    const result = await db.query(
      "SELECT date, cost FROM cost_data ORDER BY date ASC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch cost trend"
    });
  }
});

router.get("/ec2/state-distribution", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT state, COUNT(*) as count
      FROM ec2_data
      GROUP BY state
    `);

    const distribution = {
      running: 0,
      stopped: 0
    };

    result.rows.forEach(row => {
      distribution[row.state] = parseInt(row.count);
    });

    res.json(distribution);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch EC2 state distribution"
    });
  }
});

router.get("/ec2/type-distribution", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT instance_type, COUNT(*) as count
      FROM ec2_data
      GROUP BY instance_type
    `);

    const distribution = {};

    result.rows.forEach(row => {
      distribution[row.instance_type] = parseInt(row.count);
    });

    res.json(distribution);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch EC2 type distribution"
    });
  }
});

router.get("/ec2/:instance_id", async (req, res) => {
  try {

    const instanceId = req.params.instance_id;

    const result = await db.query(
      "SELECT * FROM ec2_data WHERE instance_id = $1",
      [instanceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Instance not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch instance details"
    });
  }
});

// GET /api/aws/waste-report
router.get("/waste-report", async (req, res) => {
  try {

    const ec2Command = new DescribeInstancesCommand({});
    const ec2Response = await ec2Client.send(ec2Command);

    let idleInstances = [];

    ec2Response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        if (instance.State.Name === "stopped") {
          idleInstances.push(instance);
        }
      });
    });

    const volumeCommand = new DescribeVolumesCommand({});
    const volumeResponse = await ec2Client.send(volumeCommand);

    const unusedVolumes = volumeResponse.Volumes.filter(
      (volume) => !volume.Attachments || volume.Attachments.length === 0
    );

    res.json({
      success: true,
      idle_instances: idleInstances.length,
      unused_volumes: unusedVolumes.length,
      total_resources_wasting: idleInstances.length + unusedVolumes.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/aws/optimization-score
router.get("/optimization-score", async (req, res) => {
  try {

    const ec2Command = new DescribeInstancesCommand({});
    const ec2Response = await ec2Client.send(ec2Command);

    let idleInstances = [];

    ec2Response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        if (instance.State.Name === "stopped") {
          idleInstances.push(instance);
        }
      });
    });

    const volumeCommand = new DescribeVolumesCommand({});
    const volumeResponse = await ec2Client.send(volumeCommand);

    const unusedVolumes = volumeResponse.Volumes.filter(
      (volume) => !volume.Attachments || volume.Attachments.length === 0
    );

    const issues = idleInstances.length + unusedVolumes.length;

    let score = 100 - issues * 10;

    if (score < 0) score = 0;

    res.json({
      success: true,
      optimization_score: score,
      issues_detected: issues,
      status: score > 80 ? "Good" : score > 50 ? "Average" : "Poor"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/aws/resource-summary
router.get("/resource-summary", async (req, res) => {
  try {

    const ec2Command = new DescribeInstancesCommand({});
    const ec2Response = await ec2Client.send(ec2Command);

    let totalInstances = 0;
    let runningInstances = 0;
    let stoppedInstances = 0;

    ec2Response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        totalInstances++;

        if (instance.State.Name === "running") runningInstances++;
        if (instance.State.Name === "stopped") stoppedInstances++;
      });
    });

    const volumeCommand = new DescribeVolumesCommand({});
    const volumeResponse = await ec2Client.send(volumeCommand);

    const unusedVolumes = volumeResponse.Volumes.filter(
      (volume) => !volume.Attachments || volume.Attachments.length === 0
    );

    const issues = stoppedInstances + unusedVolumes.length;
    let score = 100 - issues * 10;

    if (score < 0) score = 0;

    res.json({
      success: true,
      total_instances: totalInstances,
      running_instances: runningInstances,
      stopped_instances: stoppedInstances,
      total_volumes: volumeResponse.Volumes.length,
      unused_volumes: unusedVolumes.length,
      optimization_score: score
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/aws/cost-estimate
router.get("/cost-estimate", async (req, res) => {
  try {

    const ec2Command = new DescribeInstancesCommand({});
    const ec2Response = await ec2Client.send(ec2Command);

    let idleInstances = [];

    ec2Response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        if (instance.State.Name === "stopped") {
          idleInstances.push(instance);
        }
      });
    });

    const volumeCommand = new DescribeVolumesCommand({});
    const volumeResponse = await ec2Client.send(volumeCommand);

    const unusedVolumes = volumeResponse.Volumes.filter(
      (volume) => !volume.Attachments || volume.Attachments.length === 0
    );

    const idleInstanceCost = idleInstances.length * 8;   // approx $8/month per small EC2
    const unusedStorageCost = unusedVolumes.length * 2;  // approx $2/month per small EBS

    const totalWaste = idleInstanceCost + unusedStorageCost;

    res.json({
      success: true,
      idle_instance_estimated_cost: idleInstanceCost,
      unused_storage_estimated_cost: unusedStorageCost,
      total_estimated_waste: totalWaste
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// GET /api/aws/ec2-metrics
router.get("/ec2-metrics/:instanceId", async (req, res) => {
  try {

    const instanceId = req.params.instanceId;

    const params = {
      Namespace: "AWS/EC2",
      MetricName: "CPUUtilization",
      Dimensions: [
        {
          Name: "InstanceId",
          Value: instanceId
        }
      ],
      StartTime: new Date(Date.now() - 60 * 60 * 1000), // last 1 hour
      EndTime: new Date(),
      Period: 300,
      Statistics: ["Average"]
    };

    const command = new GetMetricStatisticsCommand(params);
    const response = await cloudWatchClient.send(command);

    res.json({
      success: true,
      instance_id: instanceId,
      datapoints: response.Datapoints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// GET /api/aws/smart-idle-instances
router.get("/smart-idle-instances/:instanceId", async (req, res) => {
  try {

    const instanceId = req.params.instanceId;

    const params = {
      Namespace: "AWS/EC2",
      MetricName: "CPUUtilization",
      Dimensions: [
        {
          Name: "InstanceId",
          Value: instanceId
        }
      ],
      StartTime: new Date(Date.now() - 60 * 60 * 1000),
      EndTime: new Date(),
      Period: 300,
      Statistics: ["Average"]
    };

    const command = new GetMetricStatisticsCommand(params);
    const response = await cloudWatchClient.send(command);

    let idle = false;
    let avgCpu = 0;

    if (response.Datapoints.length > 0) {
      avgCpu = response.Datapoints[0].Average;
      if (avgCpu < 5) {
        idle = true;
      }
    }

    res.json({
      success: true,
      instance_id: instanceId,
      average_cpu: avgCpu,
      idle_instance: idle
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
module.exports = router;