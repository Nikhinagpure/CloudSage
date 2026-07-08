import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Cloud, ArrowRight, Github } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0c101a] selection:bg-primary/30">
      
      {/* Left Pane - Branding & Graphic */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1e2336] flex-col justify-between overflow-hidden">
         {/* Decorative Gradients */}
         <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px] pointer-events-none mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none mix-blend-screen" />
         
         <div className="p-12 relative z-10 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
               <Cloud className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ThriftEx</span>
         </div>

         <div className="p-12 relative z-10 mb-20">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
               Master your cloud infrastructure.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
               ThriftEx provides the ultimate FinOps control center. Stop wasting resources and start optimizing your cloud spend effortlessly.
            </p>
            
            {/* Testimonial / Trust badge */}
            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md max-w-lg">
               <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                     <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
               </div>
               <p className="text-slate-300 font-medium leading-relaxed italic">"The automated AI recommendations basically paid for themselves on day one. Incredible platform."</p>
               <p className="text-sm text-slate-500 mt-4 font-bold uppercase tracking-wider">VP of Engineering, SaaS Co</p>
            </div>
         </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative">
         <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <span className="text-sm text-muted-foreground">New to ThriftEx? </span>
            <Link to="/register" className="text-sm font-bold text-white hover:text-primary transition-colors">Create an account</Link>
         </div>

         {/* Mobile Logo */}
         <div className="absolute top-0 left-0 p-8 flex items-center gap-2 lg:hidden">
            <Cloud className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-white tracking-tight">ThriftEx</span>
         </div>

         <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10 lg:mb-12">
               <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h2>
               <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
               <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-300" htmlFor="email">Work Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@thriftex.com"
                    className="border-slate-700 bg-slate-900/50 focus:bg-slate-900 focus:border-primary transition-all px-4 py-6 text-base"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                     <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Forgot?
                     </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="border-slate-700 bg-slate-900/50 focus:bg-slate-900 focus:border-primary transition-all px-4 py-6 text-base tracking-widest"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
               </div>

               <Button type="submit" className="w-full py-6 text-base font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-6" isLoading={isLoading}>
                 Sign In <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </form>

            <div className="relative my-10">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800" /></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0c101a] px-4 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 font-medium text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  Google
               </button>
               <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 font-medium text-sm">
                  <Github className="w-5 h-5" />
                  GitHub
               </button>
            </div>
            
            <div className="text-center mt-10 text-sm text-slate-500 lg:hidden">
               New to ThriftEx? <Link to="/register" className="font-bold text-white">Create an account</Link>
            </div>
         </div>
      </div>
      
    </div>
  );
}
