const express = require("express");
const { EC2Client, DescribeVolumesCommand } = require("@aws-sdk/client-ec2");

const router = express.Router();

const ec2Client = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// GET /api/aws/ebs
router.get("/ebs", async (req, res) => {
  try {
    const command = new DescribeVolumesCommand({});
    const response = await ec2Client.send(command);

    res.json({
      success: true,
      volumes: response.Volumes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/aws/unused-volumes
router.get("/unused-volumes", async (req, res) => {
  try {

    const command = new DescribeVolumesCommand({});
    const response = await ec2Client.send(command);

    const unusedVolumes = response.Volumes.filter(
      (volume) => !volume.Attachments || volume.Attachments.length === 0
    );

    res.json({
      success: true,
      total_volumes: response.Volumes.length,
      unused_volumes_count: unusedVolumes.length,
      unused_volumes: unusedVolumes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;