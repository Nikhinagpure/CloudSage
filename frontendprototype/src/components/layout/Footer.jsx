import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/50 py-6 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SaaSify Inc. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};
