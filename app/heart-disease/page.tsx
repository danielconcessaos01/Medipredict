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
import { AlertCircle, Heart } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  age: z.coerce.number().min(0, "Must be a positive number"),
  sex: z.string(),
  chestPainType: z.string(),
  restingBP: z.coerce.number().min(0, "Must be a positive number"),
  cholesterol: z.coerce.number().min(0, "Must be a positive number"),
  fastingBS: z.string(),
  restingECG: z.string(),
  maxHR: z.coerce.number().min(0, "Must be a positive number"),
  exerciseAngina: z.string(),
  oldpeak: z.coerce.number(),
  slope: z.string(),
  target: z.string(),
})

export default function HeartDiseasePrediction() {
  const [prediction, setPrediction] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      sex: "",
      chestPainType: "",
      restingBP: 0,
      cholesterol: 0,
      fastingBS: "",
      restingECG: "",
      maxHR: 0,
      exerciseAngina: "",
      oldpeak: 0,
      slope: "",
      target: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const randomResult = Math.random() > 0.5 ? "Positive" : "Negative"
    setPrediction(randomResult)
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Heart Disease Prediction
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter the required parameters to predict heart disease
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heart Disease Prediction Form</CardTitle>
          <CardDescription>
            Fill in all the fields below with the patient&apos;s information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Age in years</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sex */}
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Chest Pain Type */}
                <FormField
                  control={form.control}
                  name="chestPainType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chest Pain Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select chest pain type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TA">Typical Angina</SelectItem>
                          <SelectItem value="ATA">Atypical Angina</SelectItem>
                          <SelectItem value="NAP">Non-Anginal Pain</SelectItem>
                          <SelectItem value="ASY">Asymptomatic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resting BP */}
                <FormField
                  control={form.control}
                  name="restingBP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resting Blood Pressure</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Resting blood pressure (mm Hg)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cholesterol */}
                <FormField
                  control={form.control}
                  name="cholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serum Cholesterol</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Serum cholesterol (mg/dl)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fasting Blood Sugar */}
                <FormField
                  control={form.control}
                  name="fastingBS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fasting Blood Sugar</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fasting blood sugar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">≤ 120 mg/dl</SelectItem>
                          <SelectItem value="1">&gt; 120 mg/dl</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resting ECG */}
                <FormField
                  control={form.control}
                  name="restingECG"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resting ECG</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resting ECG" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="ST">ST-T wave abnormality</SelectItem>
                          <SelectItem value="LVH">LVH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Maximum HR */}
                <FormField
                  control={form.control}
                  name="maxHR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Heart Rate</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Maximum heart rate achieved</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exercise Angina */}
                <FormField
                  control={form.control}
                  name="exerciseAngina"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Induced Angina</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exercise angina" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Y">Yes</SelectItem>
                          <SelectItem value="N">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Oldpeak */}
                <FormField
                  control={form.control}
                  name="oldpeak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oldpeak</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        ST depression induced by exercise relative to rest
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slope */}
                <FormField
                  control={form.control}
                  name="slope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ST Slope</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select slope" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Up">Upsloping</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="Down">Downsloping</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target */}
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No Disease</SelectItem>
                          <SelectItem value="1">Disease Present</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Predict Heart Disease
              </Button>
            </form>
          </Form>
        </CardContent>
        {prediction && (
          <CardFooter>
            <Alert
              className={prediction === "Positive" ? "bg-red-50" : "bg-green-50"}
            >
              <AlertCircle
                className={`h-4 w-4 ${
                  prediction === "Positive" ? "text-red-500" : "text-green-500"
                }`}
              />
              <AlertTitle>Prediction Result</AlertTitle>
              <AlertDescription>
                The prediction for heart disease is:{" "}
                <strong>{prediction}</strong>
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
