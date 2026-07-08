import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <Card className="w-full max-w-sm">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent you a password reset link. Please check your inbox and verify your email.
            </p>
            <Link to="/login" className="mt-4 w-full">
              <Button className="w-full">Return to login</Button>
            </Link>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
              <CardDescription>Enter your email to receive a reset link</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="email">Email address</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send reset link
                </Button>
                <div className="text-center text-sm">
                  <Link to="/login" className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
