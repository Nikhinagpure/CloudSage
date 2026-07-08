import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Plus, Search, Filter } from 'lucide-react';

const projects = [
  { id: 1, name: 'E-commerce Platform', owner: 'Alice F.', status: 'In Progress', progress: 45, date: '2026-03-01' },
  { id: 2, name: 'Marketing Site', owner: 'Bob S.', status: 'Completed', progress: 100, date: '2026-02-15' },
  { id: 3, name: 'Mobile App V2', owner: 'Charlie D.', status: 'Review', progress: 90, date: '2026-03-05' },
  { id: 4, name: 'Cloud Migration', owner: 'Alice F.', status: 'In Progress', progress: 20, date: '2026-03-06' },
  { id: 5, name: 'API Gateway Redesign', owner: 'Eve W.', status: 'Planning', progress: 5, date: '2026-03-07' },
];

export default function ProjectList() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and track your team's projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>View all active and completed projects.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.owner}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      project.status === 'Review' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[30px]">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{project.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
