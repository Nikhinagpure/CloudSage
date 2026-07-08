import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Database, HardDrive, PieChart, Lightbulb, Bell, Cloud, Network, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'EC2 Instances', href: '/ec2', icon: Server },
  { name: 'RDS Databases', href: '/rds', icon: Database },
  { name: 'S3 Storage', href: '/s3', icon: HardDrive },
  { name: 'VPC Networks', href: '/vpc', icon: Network },
  { name: 'Other Services', href: '/services', icon: Layers },
  { name: 'Cost Analytics', href: '/analytics', icon: PieChart },
  { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

export const Sidebar = () => {
  return (
    <div className="hidden border-r border-[#1e2336] bg-[#0c101a] md:flex md:w-64 md:flex-col z-50 relative">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <Cloud className="h-6 w-6 text-primary" />
        <span className="ml-3 text-lg font-bold text-foreground">ThriftEx</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'} // exact match for dashboard home
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  'group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200'
                )
              }
            >
              <item.icon
                className={cn('mr-3 h-5 w-5 shrink-0')}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
