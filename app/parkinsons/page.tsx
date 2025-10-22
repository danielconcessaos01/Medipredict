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
import { AlertCircle, Brain, Loader2 } from "lucide-react" // Added Loader2

// The schema is updated to include all 22 required features
const formSchema = z.object({
  // Existing 13 fields:
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
  shimmerAPQ: z.coerce.number(), // Maps to MDVP:APQ

  // 9 New fields (total 22)
  shimmerDDA: z.coerce.number(),
  nhr: z.coerce.number().min(0, "Must be a positive number"),
  hnr: z.coerce.number(),
  rpde: z.coerce.number(),
  dfa: z.coerce.number(),
  spread1: z.coerce.number(),
  spread2: z.coerce.number(),
  d2: z.coerce.number(),
  ppe: z.coerce.number(),
})

export default function ParkinsonsPrediction() {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false) // NEW: Loading state
  const [error, setError] = useState<string | null>(null) // NEW: Error state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Existing 13 default values
      mdvpFo: 120.0,
      mdvpFhi: 150.0,
      mdvpFlo: 75.0,
      mdvpJitterPercent: 0.0078,
      mdvpJitterAbs: 0.00007,
      mdvpRAP: 0.0037,
      mdvpPPQ: 0.0055,
      jitterDDP: 0.011,
      shimmer: 0.0437,
      shimmerDB: 0.426,
      shimmerAPQ3: 0.0218,
      shimmerAPQ5: 0.0313,
      shimmerAPQ: 0.0297,

      // 9 New default values
      shimmerDDA: 0.0654,
      nhr: 0.0221,
      hnr: 21.033,
      rpde: 0.4147,
      dfa: 0.8152,
      spread1: -4.813,
      spread2: 0.2664,
      d2: 2.301,
      ppe: 0.2846,
    },
  })

  // 💡 UPDATED FUNCTION: Now calls the local Python API asynchronously
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    setPrediction(null)
    setError(null) // Clear previous errors

    // Payload includes all 22 required features
    const payload = {
      mdvpFo: data.mdvpFo,
      mdvpFhi: data.mdvpFhi,
      mdvpFlo: data.mdvpFlo,
      mdvpJitterPercent: data.mdvpJitterPercent,
      mdvpJitterAbs: data.mdvpJitterAbs,
      mdvpRAP: data.mdvpRAP,
      mdvpPPQ: data.mdvpPPQ,
      jitterDDP: data.jitterDDP,
      shimmer: data.shimmer,
      shimmerDB: data.shimmerDB,
      shimmerAPQ3: data.shimmerAPQ3,
      shimmerAPQ5: data.shimmerAPQ5,
      shimmerAPQ: data.shimmerAPQ,
      shimmerDDA: data.shimmerDDA,
      nhr: data.nhr,
      hnr: data.hnr,
      rpde: data.rpde,
      dfa: data.dfa,
      spread1: data.spread1,
      spread2: data.spread2,
      d2: data.d2,
      ppe: data.ppe,
    }

    try {
      // 🎯 API CALL CHANGE FOR VERCEL DEPLOYMENT: 
      // Changed URL from "http://127.0.0.1:5000/predict/parkinsons" 
      // to the relative path "/api/predict/parkinsons"
      const response = await fetch("/api/predict/parkinsons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Attempt to parse JSON error message from the API
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP Error: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }

      const result = await response.json()

      // The API returns { prediction: 0 } or { prediction: 1 }
      if (typeof result.prediction !== 'number' || (result.prediction !== 0 && result.prediction !== 1)) {
        throw new Error("Invalid prediction format received from API.")
      }
      
      const predictedStatus = result.prediction === 1 ? "Positive" : "Negative"
      setPrediction(predictedStatus)

    } catch (e) {
      console.error("Prediction Error:", e)
      setError((e as Error).message || "An unexpected network error occurred.")
      setPrediction("Error")
    } finally {
      setLoading(false)
    }
  }

  return (
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
                {/* 1. MDVP:Fo(Hz) */}
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

                {/* 2. MDVP:Fhi(Hz) */}
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

                {/* 3. MDVP:Flo(Hz) */}
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

                {/* 4. MDVP:Jitter(%) */}
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

                {/* 5. MDVP:Jitter(Abs) */}
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

                {/* 6. MDVP:RAP */}
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

                {/* 7. MDVP:PPQ */}
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

                {/* 8. Jitter:DDP */}
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

                {/* 9. Shimmer */}
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

                {/* 10. Shimmer(dB) */}
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

                {/* 11. Shimmer:APQ3 */}
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

                {/* 12. Shimmer:APQ5 */}
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

                {/* 13. Shimmer:APQ (MDVP:APQ) */}
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

                {/* --- START OF NEWLY ADDED FIELDS (14-22) --- */}

                {/* 14. Shimmer:DDA */}
                <FormField
                  control={form.control}
                  name="shimmerDDA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shimmer:DDA</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Average absolute difference of consecutive Shimmer periods</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 15. NHR */}
                <FormField
                  control={form.control}
                  name="nhr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NHR</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Noise to harmonic ratio</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 16. HNR */}
                <FormField
                  control={form.control}
                  name="hnr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HNR</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Harmonics to noise ratio</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 17. RPDE */}
                <FormField
                  control={form.control}
                  name="rpde"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RPDE</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Recurrence period density entropy</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 18. DFA */}
                <FormField
                  control={form.control}
                  name="dfa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DFA</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Detrended fluctuation analysis</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 19. spread1 */}
                <FormField
                  control={form.control}
                  name="spread1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>spread1</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Nonlinear fundamental frequency variation measure</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 20. spread2 */}
                <FormField
                  control={form.control}
                  name="spread2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>spread2</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Nonlinear measure of variation in voice period</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 21. D2 */}
                <FormField
                  control={form.control}
                  name="d2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>D2</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Nonlinear correlation dimension measure</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 22. PPE */}
                <FormField
                  control={form.control}
                  name="ppe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PPE</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Pitch period entropy</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* --- END OF NEWLY ADDED FIELDS --- */}

              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Predicting..." : "Predict Parkinson's Disease"}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* NEW: Display Error Alert if an API error occurred */}
        {error && (
            <CardFooter>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Prediction Error</AlertTitle>
                    <AlertDescription>
                        {error}. Please ensure your Python API is running on http://127.0.0.1:5000 (for local testing).
                    </AlertDescription>
                </Alert>
            </CardFooter>
        )}

        {/* Existing Prediction Display */}
        {prediction && prediction !== "Error" && (
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