"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Brain } from "lucide-react"

const formSchema = z.object({
  mdvpFo: z.coerce.number().min(0, "Must be a positive number"),
  mdvpFhi: z.coerce.number().min(0, "Must be a positive number"),
  mdvpFlo: z.coerce.number().min(0, "Must be a positive number"),
  mdvpJitterPercent: z.coerce.number().min(0, "Must be a positive number"),
  mdvpJitterAbs: z.coerce.number().min(0, "Must be a positive number"),
  mdvpRAP: z.coerce.number(),
  mdvpPPQ: z.coerce.number(),
  jitterDDP: z.coerce.number(),
  shimmer: z.coerce.number().min(0, "Must be a positive number"),
  shimmerDB: z.coerce.number(),
  shimmerAPQ3: z.coerce.number(),
  shimmerAPQ5: z.coerce.number(),
  shimmerAPQ: z.coerce.number(),
})

export default function ParkinsonsPrediction() {
  const [prediction, setPrediction] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mdvpFo: 0,
      mdvpFhi: 0,
      mdvpFlo: 0,
      mdvpJitterPercent: 0,
      mdvpJitterAbs: 0,
      mdvpRAP: 0,
      mdvpPPQ: 0,
      jitterDDP: 0,
      shimmer: 0,
      shimmerDB: 0,
      shimmerAPQ3: 0,
      shimmerAPQ5: 0,
      shimmerAPQ: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const randomResult = Math.random() > 0.5 ? "Positive" : "Negative"
    setPrediction(randomResult)
  }

  return (
    // 🔽 Added py-8 so the page is scrollable like a full page
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-green-500" />
          Parkinson&apos;s Disease Prediction
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter the required parameters to predict Parkinson&apos;s disease
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parkinson&apos;s Disease Prediction Form</CardTitle>
          <CardDescription>
            Fill in all the fields below with the patient&apos;s biomedical voice measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* All fields unchanged */}
                <FormField
                  control={form.control}
                  name="mdvpFo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:Fo(Hz)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Average vocal fundamental frequency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpFhi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:Fhi(Hz)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Maximum vocal fundamental frequency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpFlo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:Flo(Hz)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Minimum vocal fundamental frequency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpJitterPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:Jitter(%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Percentage variation in fundamental frequency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpJitterAbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:Jitter(Abs)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.000001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Absolute jitter in microseconds</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpRAP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:RAP</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Relative amplitude perturbation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mdvpPPQ"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MDVP:PPQ</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Five-point period perturbation quotient</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jitterDDP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jitter:DDP</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Average absolute difference of differences of consecutive periods
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shimmer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Local shimmer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shimmerDB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer(dB)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Shimmer in decibels</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shimmerAPQ3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer:APQ3</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Three-point amplitude perturbation quotient</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shimmerAPQ5"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer:APQ5</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Five-point amplitude perturbation quotient</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shimmerAPQ"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer:APQ</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Amplitude perturbation quotient</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Predict Parkinson&apos;s Disease
              </Button>
            </form>
          </Form>
        </CardContent>
        {prediction && (
          <CardFooter>
            <Alert className={prediction === "Positive" ? "bg-red-50" : "bg-green-50"}>
              <AlertCircle
                className={`h-4 w-4 ${
                  prediction === "Positive" ? "text-red-500" : "text-green-500"
                }`}
              />
              <AlertTitle>Prediction Result</AlertTitle>
              <AlertDescription>
                The prediction for Parkinson&apos;s disease is: <strong>{prediction}</strong>
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
