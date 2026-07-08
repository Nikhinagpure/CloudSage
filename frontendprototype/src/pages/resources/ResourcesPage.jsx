import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Server, Database, HardDrive, AlertCircle, Network, Layers, Activity } from 'lucide-react';
import api from '../../services/api';

export default function ResourcesPage() {
  const location = useLocation();
  const path = location.pathname; // '/ec2', '/rds', or '/s3'

  const [ec2Instances, setEc2Instances] = useState([]);
  const [rdsInstances, setRdsInstances] = useState([]);
  const [s3Buckets, setS3Buckets] = useState([]);
  const [vpcList, setVpcList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [idleInstances, setIdleInstances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        if (path === '/ec2') {
           const [ec2Res, idleRes] = await Promise.all([api.get('/api/ec2'), api.get('/api/ec2/idle')]);
           setEc2Instances(ec2Res.data);
           setIdleInstances(idleRes.data);
        } else if (path === '/rds') {
           const rdsRes = await api.get('/api/rds');
           setRdsInstances(rdsRes.data);
        } else if (path === '/s3') {
           const s3Res = await api.get('/api/s3');
           setS3Buckets(s3Res.data);
        } else if (path === '/vpc') {
           const vpcRes = await api.get('/api/vpc');
           setVpcList(vpcRes.data);
        } else if (path === '/services') {
           const servicesRes = await api.get('/api/services');
           setServicesList(servicesRes.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${path} data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [path]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
           {path === '/ec2' && 'EC2 Instances'}
           {path === '/rds' && 'RDS Databases'}
           {path === '/s3' && 'S3 Storage'}
           {path === '/vpc' && 'VPC Networks'}
           {path === '/services' && 'Other Active Services'}
        </h2>
        <p className="text-muted-foreground mt-1">
           {path === '/ec2' && 'Manage your EC2 Compute resources.'}
           {path === '/rds' && 'Monitor and manage your Relational Databases.'}
           {path === '/s3' && 'View your S3 bucket capacities and objects.'}
           {path === '/vpc' && 'Manage your Virtual Private Clouds, Subnets, and Networking.'}
           {path === '/services' && 'Monitor and manage other active AWS services.'}
        </p>
      </div>

      {path === '/ec2' && idleInstances.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-amber-500">Idle Instances Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {idleInstances.map((idle, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#1e2436] p-3 rounded-md border border-[#2a314b]">
                  <span className="text-white">Instance: <span className="font-mono font-medium text-primary">{idle.instanceId}</span> (CPU: {idle.cpuUtilization}%)</span>
                  <span className="text-green-400 font-medium text-xs border border-green-500/30 bg-green-500/10 px-2 py-1 rounded">Potential Savings: {idle.estimatedSavings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {path === '/ec2' && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
           <Card className="bg-[#1e40af] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Server strokeWidth={2.5} className="w-4 h-4" /> Total Instances
              </div>
              <span className="bg-white text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded shadow-sm">{ec2Instances.length}</span>
           </Card>
           <Card className="bg-[#10b981] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div> Running
              </div>
               <span className="bg-white text-[#10b981] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {ec2Instances.filter(i => i.state === 'running').length}
               </span>
           </Card>
           <Card className="bg-[#f59e0b] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center flex-col gap-0.5">
                    <div className="w-2 h-0.5 bg-white"/>
                    <div className="w-2 h-0.5 bg-white"/>
                 </div> Stopped
              </div>
               <span className="bg-white text-[#f59e0b] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {ec2Instances.filter(i => i.state === 'stopped').length}
               </span>
           </Card>
           <Card className="bg-[#ef4444] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <AlertCircle strokeWidth={2.5} className="w-4 h-4" /> Idle Instance
              </div>
               <span className="bg-white text-[#ef4444] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {idleInstances.length}
               </span>
           </Card>
        </div>
      )}

      {path === '/ec2' && (
      <Card className="shadow-lg border-[#2a314b]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-[#2a314b] bg-[#1a2133] rounded-t-xl">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-muted-foreground font-medium py-4 px-6">Instance ID</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Type</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">CPU Usage</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Region</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Launch Time</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ec2Instances.map((instance, idx) => (
                <TableRow key={idx} className="border-b border-[#2a314b]/50 hover:bg-white/5 last:border-0 border-t-0 bg-card">
                  <TableCell className="font-mono font-medium text-white px-6">
                    {instance.instanceId}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{instance.instanceType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0 ${instance.state === 'running' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                         <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className={`text-sm ${instance.state === 'running' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {instance.state === 'running' ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{instance.cpuUtilization}%</TableCell>
                  <TableCell className="text-muted-foreground">{instance.region}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{instance.launchTime || 'Mar 10, 2024'}</TableCell>
                  <TableCell>
                     <button className={`px-4 py-1.5 rounded text-xs font-bold text-white uppercase tracking-wider transition-colors ${
                       instance.state === 'running' 
                         ? 'bg-[#3b82f6] hover:bg-[#2563eb]' 
                         : 'bg-[#ef4444] hover:bg-[#dc2626]'
                     }`}>
                        {instance.state === 'running' ? 'Stop' : 'Start'}
                     </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t border-[#2a314b] p-4 px-6 flex items-center text-xs text-muted-foreground bg-[#1a2133] rounded-b-xl gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><Server className="w-2 h-2"/></div> Today 2 Threats</div>
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1 bg-white/5 rounded text-white font-medium">Log In</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><AlertCircle className="w-2 h-2"/></div> Primary</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">?</div> Help? <span className="text-white">1 (800) 722 5</span></div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2"><span className="text-white">●</span> idle instances. None</div>
            <div className="flex items-center gap-2"><span className="text-primary font-medium border-b border-primary border-dashed">Select Instances</span></div>
        </div>
      </Card>
      )}

      {path === '/rds' && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
           <Card className="bg-[#1e40af] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Database strokeWidth={2.5} className="w-4 h-4" /> Total Databases
              </div>
              <span className="bg-white text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded shadow-sm">{rdsInstances.length}</span>
           </Card>
           <Card className="bg-[#10b981] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div> Available
              </div>
               <span className="bg-white text-[#10b981] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {rdsInstances.filter(i => i.status === 'available').length}
               </span>
           </Card>
           <Card className="bg-[#f59e0b] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center flex-col gap-0.5">
                    <div className="w-2 h-0.5 bg-white"/>
                    <div className="w-2 h-0.5 bg-white"/>
                 </div> Stopped
              </div>
               <span className="bg-white text-[#f59e0b] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {rdsInstances.filter(i => i.status === 'stopped').length}
               </span>
           </Card>
        </div>
      )}

      {path === '/rds' && (
      <Card className="shadow-lg border-[#2a314b]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-[#2a314b] bg-[#1a2133] rounded-t-xl">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-muted-foreground font-medium py-4 px-6">DB Name</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Engine</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Storage</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Region</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rdsInstances.map((db, idx) => (
                <TableRow key={idx} className="border-b border-[#2a314b]/50 hover:bg-white/5 last:border-0 border-t-0 bg-card">
                  <TableCell className="font-mono font-medium text-white px-6">{db.dbIdentifier}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{db.engine}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      db.status === 'available' 
                        ? 'border border-green-500/30 bg-green-500/10 text-green-500'
                        : 'border border-amber-500/30 bg-amber-500/10 text-amber-500'
                    }`}>
                      {db.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{db.storage}</TableCell>
                  <TableCell className="text-muted-foreground">{db.region}</TableCell>
                  <TableCell>
                     <button className={`px-4 py-1.5 rounded text-xs font-bold text-white uppercase tracking-wider transition-colors ${
                       db.status === 'available' 
                         ? 'bg-[#3b82f6] hover:bg-[#2563eb]' 
                         : 'bg-[#ef4444] hover:bg-[#dc2626]'
                     }`}>
                        {db.status === 'available' ? 'Stop' : 'Start'}
                     </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t border-[#2a314b] p-4 px-6 flex items-center text-xs text-muted-foreground bg-[#1a2133] rounded-b-xl gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><Database className="w-2 h-2"/></div> Running Backups: 1</div>
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1 bg-white/5 rounded text-white font-medium">Connect</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><AlertCircle className="w-2 h-2"/></div> Master</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2"><span className="text-primary font-medium border-b border-primary border-dashed">Manage Clusters</span></div>
        </div>
      </Card>
      )}

      {path === '/s3' && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
           <Card className="bg-[#1e40af] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <HardDrive strokeWidth={2.5} className="w-4 h-4" /> Total Buckets
              </div>
              <span className="bg-white text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded shadow-sm">{s3Buckets.length}</span>
           </Card>
           <Card className="bg-[#8b5cf6] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Database strokeWidth={2.5} className="w-4 h-4" /> Total Storage
              </div>
               <span className="bg-white text-[#8b5cf6] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {s3Buckets.reduce((acc, curr) => acc + parseInt(curr.size), 0)}GB
               </span>
           </Card>
           <Card className="bg-[#10b981] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div> Private
              </div>
               <span className="bg-white text-[#10b981] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {s3Buckets.filter(b => !b.publicAccess).length}
               </span>
           </Card>
           <Card className="bg-[#ef4444] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <AlertCircle strokeWidth={2.5} className="w-4 h-4" /> Public
              </div>
               <span className="bg-white text-[#ef4444] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {s3Buckets.filter(b => b.publicAccess).length}
               </span>
           </Card>
        </div>
      )}

      {path === '/s3' && (
      <Card className="shadow-lg border-[#2a314b]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-[#2a314b] bg-[#1a2133] rounded-t-xl">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-muted-foreground font-medium py-4 px-6">Bucket Name</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Region</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Size</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Objects</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Access</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s3Buckets.map((bucket, idx) => (
                <TableRow key={idx} className="border-b border-[#2a314b]/50 hover:bg-white/5 last:border-0 border-t-0 bg-card">
                  <TableCell className="font-mono font-medium text-white px-6">{bucket.bucketName}</TableCell>
                  <TableCell className="text-muted-foreground">{bucket.region}</TableCell>
                  <TableCell className="text-muted-foreground">{bucket.size}</TableCell>
                  <TableCell className="text-muted-foreground">{bucket.objects.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      !bucket.publicAccess 
                        ? 'border border-green-500/30 bg-green-500/10 text-green-500'
                        : 'border border-red-500/30 bg-red-500/10 text-red-500'
                    }`}>
                      {bucket.publicAccess ? 'Public' : 'Private'}
                    </span>
                  </TableCell>
                  <TableCell>
                     <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] px-4 py-1.5 rounded text-xs font-bold text-white uppercase tracking-wider transition-colors">
                        Manage
                     </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t border-[#2a314b] p-4 px-6 flex items-center text-xs text-muted-foreground bg-[#1a2133] rounded-b-xl gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><HardDrive className="w-2 h-2"/></div> Access Logs: Enabled</div>
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1 bg-white/5 rounded text-white font-medium">Upload File</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2"><span className="text-primary font-medium border-b border-primary border-dashed">View Metrics</span></div>
        </div>
      </Card>
      )}

      {path === '/vpc' && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
           <Card className="bg-[#1e40af] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Network strokeWidth={2.5} className="w-4 h-4" /> Total VPCs
              </div>
              <span className="bg-white text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded shadow-sm">{vpcList.length}</span>
           </Card>
           <Card className="bg-[#8b5cf6] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <HardDrive strokeWidth={2.5} className="w-4 h-4" /> Total Subnets
              </div>
               <span className="bg-white text-[#8b5cf6] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {vpcList.reduce((acc, curr) => acc + curr.privateSubnets + curr.publicSubnets, 0)}
               </span>
           </Card>
           <Card className="bg-[#10b981] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div> Public Subnets
              </div>
               <span className="bg-white text-[#10b981] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {vpcList.reduce((acc, curr) => acc + curr.publicSubnets, 0)}
               </span>
           </Card>
           <Card className="bg-[#f59e0b] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center flex-col gap-0.5"><div className="w-2 h-0.5 bg-white"/><div className="w-2 h-0.5 bg-white"/></div> Private Subnets
              </div>
               <span className="bg-white text-[#f59e0b] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {vpcList.reduce((acc, curr) => acc + curr.privateSubnets, 0)}
               </span>
           </Card>
        </div>
      )}

      {path === '/vpc' && (
      <Card className="shadow-lg border-[#2a314b]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-[#2a314b] bg-[#1a2133] rounded-t-xl">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-muted-foreground font-medium py-4 px-6">VPC ID</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Name</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Region</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">CIDR Block</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Subnets</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Connected EC2s</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vpcList.map((vpc, idx) => (
                <TableRow key={idx} className="border-b border-[#2a314b]/50 hover:bg-white/5 last:border-0 border-t-0 bg-card">
                  <TableCell className="font-mono font-medium text-[#3b82f6] px-6">{vpc.vpcId}</TableCell>
                  <TableCell className="text-white font-medium">{vpc.name}</TableCell>
                  <TableCell className="text-muted-foreground">{vpc.region}</TableCell>
                  <TableCell className="text-muted-foreground font-mono"><span className="bg-white/5 mt-1 inline-block px-1.5 py-0.5 rounded">{vpc.cidr}</span></TableCell>
                  <TableCell className="text-muted-foreground">
                     <div className="flex gap-3">
                       <span className="flex items-center gap-1.5 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> {vpc.publicSubnets} Pub</span>
                       <span className="flex items-center gap-1.5 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> {vpc.privateSubnets} Priv</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-white text-xs max-w-[200px] truncate" title={vpc.connectedEc2s?.join(', ')}>
                     {vpc.connectedEc2s?.join(', ')}
                  </TableCell>
                  <TableCell>
                     <button className="border border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors">
                        Manage
                     </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t border-[#2a314b] p-4 px-6 flex items-center text-xs text-muted-foreground bg-[#1a2133] rounded-b-xl gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><Network className="w-2 h-2"/></div> Peering: Active</div>
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1 bg-white/5 rounded text-white font-medium hover:bg-white/10 cursor-pointer transition-colors">Create VPC</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"><span className="text-primary font-medium border-b border-primary border-dashed">VPC Dashboard</span></div>
        </div>
      </Card>
      )}

      {path === '/services' && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
           <Card className="bg-[#1e40af] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Layers strokeWidth={2.5} className="w-4 h-4" /> Active Services
              </div>
              <span className="bg-white text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded shadow-sm">{servicesList.length}</span>
           </Card>
           <Card className="bg-[#10b981] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div> Healthy Operations
              </div>
               <span className="bg-white text-[#10b981] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {servicesList.filter(s => s.status === 'Healthy').length}
               </span>
           </Card>
           <Card className="bg-[#f59e0b] text-white border-none shadow-md flex items-center justify-between p-4 px-6 rounded-lg pointer-events-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                 <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center flex-col gap-0.5">
                    <div className="w-2 h-0.5 bg-white"/>
                    <div className="w-2 h-0.5 bg-white"/>
                 </div> Warnings / Issues
              </div>
               <span className="bg-white text-[#f59e0b] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                 {servicesList.filter(s => s.status !== 'Healthy').length}
               </span>
           </Card>
        </div>
      )}

      {path === '/services' && (
      <Card className="shadow-lg border-[#2a314b]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-[#2a314b] bg-[#1a2133] rounded-t-xl">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-muted-foreground font-medium py-4 px-6">Service Name</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Active Resources</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4">Usage/Metrics</TableHead>
                <TableHead className="text-muted-foreground font-medium py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesList.map((service, idx) => (
                <TableRow key={idx} className="border-b border-[#2a314b]/50 hover:bg-white/5 last:border-0 border-t-0 bg-card">
                  <TableCell className="font-medium text-white px-6 flex items-center gap-3 py-4">
                     <div className="w-6 h-6 rounded bg-[#1e2336] border border-white/5 flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-[#3b82f6]" />
                     </div>
                     {service.serviceName}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      service.status === 'Healthy' 
                        ? 'border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]'
                        : 'border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]'
                    }`}>
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{service.activeInstances}</TableCell>
                  <TableCell className="text-muted-foreground font-mono bg-white/5 px-2 rounded w-max inline-block mt-2">{service.usage}</TableCell>
                  <TableCell>
                     <button className="text-muted-foreground hover:text-white transition-colors underline decoration-dashed underline-offset-4 text-xs font-medium">
                        Go to Console
                     </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t border-[#2a314b] p-4 px-6 flex items-center text-xs text-muted-foreground bg-[#1a2133] rounded-b-xl gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"><Activity className="w-2 h-2"/></div> Auto-Scaling: ON</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"><span className="text-primary font-medium border-b border-primary border-dashed">Refresh Status</span></div>
        </div>
      </Card>
      )}

    </div>
  );
}
