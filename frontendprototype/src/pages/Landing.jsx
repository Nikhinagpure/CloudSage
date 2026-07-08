import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Zap, Shield, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      
      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">ThriftEx</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
          <Link to="/register">
            <Button className="rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full point-events-none -z-10" />
          
          <div className="container mx-auto max-w-5xl text-center space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              ThriftEx v1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Manage your cloud infrastructure with <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">absolute clarity.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The premium dashboard for modern teams. Beautiful, fast, and secure. Ship faster without compromising on design.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                  Start for free today
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base">
                View Live Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50 border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop overpaying for cloud resources. ThriftEx brings all your AWS metrics into one beautiful dashboard.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">Built on React & Vite, optimized for speed. No loading screens, no waiting.</p>
              </div>
              
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
                <p className="text-muted-foreground">Bank-level security with JWT token handling and secure protected routes.</p>
              </div>
              
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Onboarding</h3>
                <p className="text-muted-foreground">Get your team up and running in minutes, not days. Beautiful intuitive UX.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ThriftEx Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">GitHub</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
