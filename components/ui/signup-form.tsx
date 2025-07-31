'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import axios from 'axios';
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';

type LoginValues = {
  name: string
  email: string
  password: string
  profile: FileList | null
  roles: string;
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>()

  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const onSubmit = async (data: LoginValues) => {
    setFormError('')
    setFormSuccess('')

    try {
      // Simulate login process
      await new Promise((res) => setTimeout(res, 1000))
      const res = await axios.post(`${api}/vendor/user`, data);
      Swal.fire({
        title: res.data.message || "User Login Successfully",
        icon: "success",
        draggable: true,
      });

      if (typeof window !== 'undefined') {
        // console.log(res.data,"res.data")
        localStorage.setItem("user", JSON.stringify(res.data, null, 2));
        // console.log(res.data,"user data")
      }
      window.location.href = '/store';
      setFormSuccess(`${res.data.message} ` || "Logged in successfully!")
    } catch {
      setFormError('Something went wrong')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Register to our Acme Inc account
                </p>
              </div>

              {formError && (
                <p className="text-sm text-red-500 text-center">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-sm text-green-600 text-center">
                  {formSuccess}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password*</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="profile">Profile Pic*</Label>
                </div>
                <Input
                  id="profile"
                  type="file"
                  {...register('profile', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Register'}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  GitHub
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Meta
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/store/auth/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/auth.webp"
              alt="Authentication Image"
              fill
              className="absolute inset-0 h- p-8 w-full object-cover "
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

