import axios from 'axios';

// Mock Data Storage
const MOCK_DATA = {
  '/api/auth/login': {
    token: "jwt_token_here_dummy",
    user: { id: "123", name: "ThriftEx Admin", email: "admin@thriftex.com" }
  },
  '/api/dashboard/summary': {
    totalCost: 5200,
    runningInstances: 6,
    stoppedInstances: 2,
    totalStorage: "120GB",
    idleResources: 3
  },
  '/api/ec2': [
    { instanceId: "i-12345", instanceType: "t2.micro", state: "running", region: "ap-south-1", launchTime: "2024-03-10", cpuUtilization: 3 },
    { instanceId: "i-67890", instanceType: "m5.large", state: "stopped", region: "us-east-1", launchTime: "2024-02-01", cpuUtilization: 0 },
    { instanceId: "i-98765", instanceType: "t3.medium", state: "running", region: "eu-central-1", launchTime: "2024-04-12", cpuUtilization: 45 }
  ],
  '/api/ec2/idle': [
    { instanceId: "i-12345", cpuUtilization: 2, estimatedSavings: "$20/month" }
  ],
  '/api/rds': [
    { dbIdentifier: "customer-db", engine: "mysql", status: "available", storage: "20GB", region: "ap-south-1" },
    { dbIdentifier: "analytics-db", engine: "postgres", status: "stopped", storage: "100GB", region: "us-east-1" }
  ],
  '/api/s3': [
    { bucketName: "user-uploads", region: "ap-south-1", size: "5GB", objects: 1200, publicAccess: false },
    { bucketName: "public-assets", region: "us-east-1", size: "20GB", objects: 5400, publicAccess: true }
  ],
  '/api/vpc': [
    { vpcId: "vpc-01a2b3c4d5e", name: "Production-VPC", region: "us-east-1", cidr: "10.0.0.0/16", privateSubnets: 4, publicSubnets: 2, connectedEc2s: ["frontend-prod", "backend-api", "worker-node"] },
    { vpcId: "vpc-9876543210a", name: "Staging-VPC", region: "eu-central-1", cidr: "172.31.0.0/16", privateSubnets: 2, publicSubnets: 1, connectedEc2s: ["staging-web", "staging-db"] },
    { vpcId: "vpc-3f4e5d6c7b8", name: "Testing-VPC", region: "ap-south-1", cidr: "192.168.0.0/24", privateSubnets: 1, publicSubnets: 1, connectedEc2s: ["test-runner", "test-db"] },
    { vpcId: "vpc-8a7b6c5d4e3", name: "Data-Lake-VPC", region: "us-west-2", cidr: "10.1.0.0/16", privateSubnets: 6, publicSubnets: 0, connectedEc2s: ["spark-cluster", "hadoop-master"] },
    { vpcId: "vpc-ab12cd34ef5", name: "DevOps-VPC", region: "eu-west-1", cidr: "10.2.0.0/16", privateSubnets: 2, publicSubnets: 2, connectedEc2s: ["jenkins-server", "gitlab-runner"] },
  ],
  '/api/services': [
    { serviceName: "AWS Lambda", status: "Healthy", activeInstances: "24 functions", usage: "1.2M Invocations" },
    { serviceName: "Amazon Route53", status: "Healthy", activeInstances: "5 Hosted Zones", usage: "3000 Queries/day" },
    { serviceName: "Amazon SQS", status: "Healthy", activeInstances: "12 Queues", usage: "450k Messages/day" },
    { serviceName: "Amazon SNS", status: "Warning", activeInstances: "8 Topics", usage: "250k Messages/day" },
    { serviceName: "Amazon CloudFront", status: "Healthy", activeInstances: "2 Distributions", usage: "45GB Data Transfer" },
    { serviceName: "Amazon DynamoDB", status: "Healthy", activeInstances: "4 Tables", usage: "5.5GB Storage" },
    { serviceName: "Elastic Load Balancer", status: "Error", activeInstances: "2 ALBs", usage: "1.5M Requests/day" },
    { serviceName: "Amazon ECS", status: "Healthy", activeInstances: "3 Clusters", usage: "18 Services" },
    { serviceName: "AWS KMS", status: "Healthy", activeInstances: "12 Keys", usage: "15k Requests/hour" },
    { serviceName: "Amazon ElastiCache", status: "Healthy", activeInstances: "2 Clusters", usage: "85% Memory" },
  ],
  '/api/costs': { dailyCost: 120, monthlyCost: 4500, currency: "INR" },
  '/api/costs/services': [
    { service: "EC2", cost: 2000 },
    { service: "RDS", cost: 1200 },
    { service: "S3", cost: 300 },
    { service: "CloudWatch", cost: 200 }
  ],
  '/api/costs/trend': [
    { date: "2024-03-01", EC2: 70, RDS: 30, S3: 10, Other: 10 },
    { date: "2024-03-02", EC2: 60, RDS: 30, S3: 10, Other: 10 },
    { date: "2024-03-03", EC2: 80, RDS: 35, S3: 12, Other: 13 },
    { date: "2024-03-04", EC2: 85, RDS: 32, S3: 10, Other: 8 },
    { date: "2024-03-05", EC2: 95, RDS: 35, S3: 10, Other: 10 },
  ],
  '/api/utilization/trend': [
    { time: "00:00", cpu: 32, memory: 45 },
    { time: "04:00", cpu: 28, memory: 42 },
    { time: "08:00", cpu: 65, memory: 70 },
    { time: "12:00", cpu: 85, memory: 88 },
    { time: "16:00", cpu: 75, memory: 80 },
    { time: "20:00", cpu: 45, memory: 55 },
  ],
  '/api/metrics': { cpu: 35, memory: 60, network: "2GB", disk: "50GB" },
  '/api/ai/summary': {
    totalSavings: "₹12,500/month",
    issuesDetected: 6,
    autoActionsDone: 2,
    confidenceScore: "87%"
  },
  '/api/ai/recommendations': [
    {
      id: "rec-1",
      priority: "High",
      priorityColor: "bg-red-500",
      action: "Stop Idle EC2 Instance",
      resource: "i-0abc123 (t2.micro)",
      region: "ap-south-1",
      reason: "CPU usage below 3% for last 7 days",
      savings: "₹2,400/month",
      numericSavings: 2400,
      riskLevel: "Low",
      riskColor: "text-green-400",
      aiExplanation: "This instance is running continuously but not being used. Stopping it will not affect performance.",
      confidence: 92,
      timeDetected: "2 hours ago"
    },
    {
      id: "rec-2",
      priority: "Medium",
      priorityColor: "bg-amber-500",
      action: "Resize EC2 Instance",
      resource: "Current: t3.large → Suggested: t3.medium",
      region: "us-east-1",
      reason: "Memory usage is underutilized (20%)",
      savings: "₹3,800/month",
      numericSavings: 3800,
      riskLevel: "Medium",
      riskColor: "text-amber-400",
      aiExplanation: "This instance is over-provisioned. Downsizing can reduce cost.",
      confidence: 85,
      timeDetected: "5 hours ago"
    },
    {
      id: "rec-3",
      priority: "Low",
      priorityColor: "bg-green-500",
      action: "Delete Unattached EBS Volume",
      resource: "vol-0fgh456 (100GB)",
      region: "ap-south-1",
      reason: "Volume has been unattached for 14 days",
      savings: "₹800/month",
      numericSavings: 800,
      riskLevel: "Low",
      riskColor: "text-green-400",
      aiExplanation: "Unattached storage volumes continue to accrue charges. Deleting this orphaned volume is completely safe.",
      confidence: 98,
      timeDetected: "1 day ago"
    }
  ],
  '/api/costs/forecast': { nextMonth: 5200, currency: "INR" },
  '/api/alerts': [
    { id: "ALT-2041", type: "Cost Anomaly", message: "Monthly cost exceeded ₹4000 Budget Threshold", resource: "Account Billing", severity: "critical", time: "10 mins ago", status: "Active" },
    { id: "ALT-2042", type: "Infrastructure", message: "3 idle EC2 instances detected burning credits", resource: "us-east-1", severity: "warning", time: "1 hour ago", status: "Acknowledged" },
    { id: "ALT-2043", type: "Database", message: "RDS Cluster 'prod-db' latency spiked to 120ms", resource: "prod-db (PostgreSQL)", severity: "critical", time: "2 hours ago", status: "Active" },
    { id: "ALT-2044", type: "Security", message: "S3 Bucket 'backup-logs' has public read access", resource: "backup-logs", severity: "warning", time: "5 hours ago", status: "Active" },
    { id: "ALT-2045", type: "System", message: "Scheduled automated backup completed", resource: "Backup Vault", severity: "info", time: "1 day ago", status: "Resolved" }
  ]
};

// Create a custom axios instance
const api = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Interceptor: simulates API responses for the frontend
api.interceptors.request.use((config) => {
  // We deliberately throw an error with special mock payload so 
  // the response interceptor can catch it and return it as real data.
  // This avoids actually sending the network request to a non-existent backend.
  const mockData = MOCK_DATA[config.url];
  if (mockData !== undefined) {
    // delay to simulate network
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          isMock: true,
          status: 200,
          data: mockData,
        });
      }, 400); // 400ms delay
    });
  }
  return config;
});

// Response interceptor: unwraps our mock payload
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Intercept our mock object
    if (error && error.isMock) {
      return Promise.resolve({
        data: error.data,
        status: error.status,
      });
    }
    // Handle true errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
