const express = require("express");
const router = express.Router();
const { RDSClient, DescribeDBInstancesCommand } = require("@aws-sdk/client-rds");

const rdsClient = new RDSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// GET /api/aws/rds
router.get("/rds", async (req, res) => {
  try {

    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);

    res.json({
      success: true,
      db_instances: response.DBInstances
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// GET /api/aws/rds-summary
router.get("/rds-summary", async (req, res) => {
  try {

    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);

    const dbInstances = response.DBInstances;

    let mysql = 0;
    let postgres = 0;
    let available = 0;
    let otherStatus = 0;

    dbInstances.forEach((db) => {

      if (db.Engine.includes("mysql")) mysql++;
      if (db.Engine.includes("postgres")) postgres++;

      if (db.DBInstanceStatus === "available") {
        available++;
      } else {
        otherStatus++;
      }

    });

    res.json({
      success: true,
      total_rds_instances: dbInstances.length,
      mysql_instances: mysql,
      postgres_instances: postgres,
      available_instances: available,
      other_status: otherStatus
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/aws/rds-recommendations
router.get("/rds-recommendations", async (req, res) => {
  try {

    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);

    const recommendations = [];

    response.DBInstances.forEach((db) => {

      if (!db.PerformanceInsightsEnabled) {
        recommendations.push("Enable Performance Insights for better monitoring");
      }

      if (db.DBInstanceClass.includes("micro")) {
        recommendations.push("Instance type is micro, suitable for low workloads");
      }

      if (db.BackupRetentionPeriod < 7) {
        recommendations.push("Increase backup retention period for better data safety");
      }

    });

    res.json({
      success: true,
      total_recommendations: recommendations.length,
      recommendations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;