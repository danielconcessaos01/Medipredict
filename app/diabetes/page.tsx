"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, AlertCircle, Loader2 } from "lucide-react" // <-- Added Loader2
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 1. UPDATED SCHEMA: Removed 'outcome' as it is the target variable, not an input feature.
const formSchema = z.object({
  pregnancies: z.coerce.number().min(0, "Must be a positive number"),
  glucose: z.coerce.number().min(0, "Must be a positive number"),
  bloodPressure: z.coerce.number().min(0, "Must be a positive number"),
  skinThickness: z.coerce.number().min(0, "Must be a positive number"),
  insulin: z.coerce.number().min(0, "Must be a positive number"),
  bmi: z.coerce.number().min(0, "Must be a positive number"),
  diabetesPedigree: z.coerce.number().min(0, "Must be a positive number"),
  age: z.coerce.number().min(0, "Must be a positive number"),
})

export default function DiabetesPrediction() {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // <-- New State
  const [error, setError] = useState<string | null>(null) // <-- New State

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pregnancies: 0,
      glucose: 0,
      bloodPressure: 0,
      skinThickness: 0,
      insulin: 0,
      bmi: 0,
      diabetesPedigree: 0,
      age: 0,
      // Removed: outcome: "",
    },
  })

  // 2. UPDATED SUBMIT FUNCTION: Logic replaced with API call
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    setPrediction(null)
    setError(null)

    // The payload keys must match the DIABETES_KEY_MAP in your multi_disease_api.py
    const payload = {
      pregnancies: data.pregnancies,
      glucose: data.glucose,
      bloodPressure: data.bloodPressure,
      skinThickness: data.skinThickness,
      insulin: data.insulin,
      bmi: data.bmi,
      diabetesPedigree: data.diabetesPedigree,
      age: data.age,
    }

    try {
      // API call to the unified Flask endpoint for Diabetes
      const response = await fetch("http://127.0.0.1:5000/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Throw the error message from the backend if available
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      // The API returns 'prediction': 0 or 1
      const predictedStatus = result.prediction === 1 ? "Positive" : "Negative"
      setPrediction(predictedStatus)
    } catch (e) {
      console.error("Prediction Error:", e)
      setError((e as Error).message || "An unexpected network error occurred.")
      setPrediction(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-500" />
          Diabetes Prediction
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter the required parameters to predict diabetes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diabetes Prediction Form</CardTitle>
          <CardDescription>
            Fill in all the fields below with the patient&apos;s information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pregnancies */}
                <FormField control={form.control} name="pregnancies" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Pregnancies</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Number of times pregnant</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Glucose */}
                <FormField control={form.control} name="glucose" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Glucose Level</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Plasma glucose concentration (mg/dL)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Blood Pressure */}
                <FormField control={form.control} name="bloodPressure" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure Value</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Diastolic blood pressure (mm Hg)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Skin Thickness */}
                <FormField control={form.control} name="skinThickness" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Thickness Value</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Triceps skin fold thickness (mm)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Insulin */}
                <FormField control={form.control} name="insulin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insulin Level</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>2-Hour serum insulin (mu U/ml)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* BMI */}
                <FormField control={form.control} name="bmi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>BMI Value</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Body mass index (kg/m²)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Diabetes Pedigree Function */}
                <FormField control={form.control} name="diabetesPedigree" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diabetes Pedigree Function</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Genetic likelihood of diabetes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Age */}
                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age of the Person</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormDescription>Age in years</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {/* 3. REMOVED Outcome Field (It's a prediction target, not an input feature) */}

              </div>

              {/* 4. UPDATED Button to show loading state */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Predicting..." : "Predict Diabetes"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        {/* New: Error Display */}
        {error && (
            <CardFooter>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardFooter>
        )}

        {/* Existing: Prediction Display */}
        {prediction && (
          <CardFooter>
            <Alert className={prediction === "Positive" ? "bg-red-50" : "bg-green-50"}>
              <AlertCircle className={`h-4 w-4 ${prediction === "Positive" ? "text-red-500" : "text-green-500"}`} />
              <AlertTitle>Prediction Result</AlertTitle>
              <AlertDescription>
                The prediction for diabetes is: <strong>{prediction}</strong>
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}