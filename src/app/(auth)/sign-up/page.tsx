'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { signUpSchema } from '@/src/Schema/signUpSchema'
import { useDebounceValue } from 'usehooks-ts'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { error } from 'console'

/**
 * Sign In Page
 * Mobile-responsive authentication form with accessibility support
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Proper form labels and error associations
 * - Keyboard navigation supported
 * - Toast notifications for feedback
 * - Clear focus indicators
 */




export default function SignInPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [ usernameMessage, setUsernameMessage] = useState('')
 const debouncedUsername = useDebounceValue(username,300)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username:'',
      email: '',
      password: '',
    },
  })
useEffect(()=>{
  const checkUsernameUnique = async () => {
    if(debouncedUsername){
      setIsCheckingUsername(true)
      setUsernameMessage('')
      try {
       const response =  await axios.get(`/api/check-username-uniqueness?username=${debouncedUsername}`)
       setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? 'Error while checking username')
      }
      finally{
        setIsCheckingUsername(false)
      }

    }
  }
  checkUsernameUnique();
},[debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema> ) => {
    setIsSubmitting(true)
    try {
      const result = await axios.post<ApiResponse>('/api/sign-up',data)
      toast.success('Success',{
        description: result.data.message
      })
      router.replace(`/verify-code/${data.username}`)
      reset()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Sign Up Failed', {
      description: axiosError.response?.data.message ?? 'Please try again later.',
  })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-background to-muted/50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Good to see you!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign Up
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg sm:text-xl">Sign Up</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Enter your username or email and password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-foreground"
                >
                  Username or Email
                  <span className="text-destructive ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <Input
                  id="identifier"
                  placeholder="Enter your username or email"
                  type="text"
                  disabled={isSubmitting}
                  autoComplete="username"
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'identifier-error' : undefined}
                  className="h-10 sm:h-11 text-base sm:text-sm rounded-lg"
                  {...register('username')}
                />
                {errors.username && (
                  <p
                    id="identifier-error"
                    className="text-xs sm:text-sm text-destructive font-medium flex items-center gap-1"
                    role="alert"
                  >
                    <span aria-hidden="true">⚠</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                  <span className="text-destructive ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="h-10 sm:h-11 text-base sm:text-sm rounded-lg"
                  {...register('password')}
                />
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-xs sm:text-sm text-destructive font-medium flex items-center gap-1"
                    role="alert"
                  >
                    <span aria-hidden="true">⚠</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 sm:h-11 text-base sm:text-sm font-medium mt-6 sm:mt-8"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/sign-up"
                className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded px-1"
              >
                Sign In
              </Link>
            </p>

            {/* Forgot Password Link
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3">
              <Link
                href="/forgot-password"
                className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded px-1"
              >
                Forgot Password?
              </Link>
            </p> */}
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground">
          This site is protected by reCAPTCHA and the Google{' '}
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>{' '}
          apply.
        </p>
      </div>
    </div>
 )
}