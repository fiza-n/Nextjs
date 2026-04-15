"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "./button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="form-rhf-demo-title" className="block text-sm font-medium mb-1">
                    Bug Title
                  </label>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <p className="text-sm text-red-600 mt-1">{fieldState.error?.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="form-rhf-demo-description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-invalid={fieldState.invalid}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {field.value.length}/100 characters
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Include steps to reproduce, expected behavior, and what actually happened.
                  </p>
                  {fieldState.invalid && (
                    <p className="text-sm text-red-600 mt-1">{fieldState.error?.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="form-rhf-demo">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
