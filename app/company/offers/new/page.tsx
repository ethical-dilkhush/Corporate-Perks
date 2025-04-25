"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2, Calendar, Percent, Tag, Clock, Users, FileText, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const categories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "food", name: "Food & Dining", icon: "🍽️" },
  { id: "health", name: "Health & Wellness", icon: "💪" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "services", name: "Services", icon: "🛠️" },
]

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.string().min(1, "Please enter discount value"),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
  termsAndConditions: z.string().min(10, "Terms and conditions are required"),
  redemptionLimit: z.string().min(1, "Please enter redemption limit"),
  promoCode: z.string().optional(),
})

export default function CreateOfferPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      discountType: "percentage",
      discountValue: "",
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: "",
      termsAndConditions: "",
      redemptionLimit: "",
      promoCode: "",
    },
  })

  // Watch form fields to determine completion status
  const title = form.watch("title")
  const description = form.watch("description")
  const category = form.watch("category")
  const discountType = form.watch("discountType")
  const discountValue = form.watch("discountValue")
  const validFrom = form.watch("validFrom")
  const validUntil = form.watch("validUntil")
  const termsAndConditions = form.watch("termsAndConditions")

  // Calculate completion status for each section
  const basicDetailsComplete = title.length >= 5 && description.length >= 20
  const discountDetailsComplete = category && discountType && discountValue
  const validityComplete = validFrom && validUntil
  
  // Progress steps
  const steps = [
    {
      title: "Basic Details",
      description: "Title and description",
      icon: Tag,
      complete: basicDetailsComplete,
      color: "blue"
    },
    {
      title: "Discount Details",
      description: "Category and value",
      icon: Percent,
      complete: discountDetailsComplete,
      color: "purple"
    },
    {
      title: "Terms & Validity",
      description: "Dates and conditions",
      icon: Clock,
      complete: validityComplete,
      color: "green"
    }
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      // In a real app, this would be an API call
      console.log(values)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Offer created successfully")
      router.push("/company/offers")
    } catch (error) {
      toast.error("Failed to create offer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Create New Offer
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Create an attractive offer that your employees will love.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <Card 
                key={step.title}
                className={cn(
                  "relative cursor-pointer transition-all duration-200",
                  step.complete ? `bg-gradient-to-br from-${step.color}-50 to-white dark:from-${step.color}-950 dark:to-background border-${step.color}-200 dark:border-${step.color}-800` : "bg-gray-50 dark:bg-gray-900",
                  currentStep === index + 1 && "ring-2 ring-blue-500 dark:ring-blue-400"
                )}
                onClick={() => setCurrentStep(index + 1)}
              >
                <CardHeader className="space-y-1">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                    step.complete ? `bg-${step.color}-100 dark:bg-${step.color}-900` : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    {step.complete ? (
                      <Check className={`w-6 h-6 text-${step.color}-600 dark:text-${step.color}-400`} />
                    ) : (
                      <IconComponent className={`w-6 h-6 ${currentStep === index + 1 ? `text-${step.color}-600 dark:text-${step.color}-400` : "text-gray-400"}`} />
                    )}
                  </div>
                  <CardTitle className={cn(
                    "text-xl",
                    step.complete && `text-${step.color}-600 dark:text-${step.color}-400`
                  )}>
                    {step.title}
                  </CardTitle>
                  <CardDescription>
                    {step.description}
                  </CardDescription>
                </CardHeader>
                {step.complete && (
                  <div className="absolute top-3 right-3">
                    <Check className={`w-5 h-5 text-${step.color}-600 dark:text-${step.color}-400`} />
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Offer Information</CardTitle>
            <CardDescription>
              Fill in the details of your new offer carefully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8">
                  <div className="border rounded-lg p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Tag className="h-5 w-5" />
                      Basic Details
                    </h3>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Offer Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 20% off on Electronics" 
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormDescription>
                              A clear and concise title for your offer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the offer in detail..."
                                className="resize-none min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-6 bg-purple-50 dark:bg-purple-950/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Percent className="h-5 w-5" />
                      Discount Information
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem 
                                    key={category.id} 
                                    value={category.id}
                                    className="flex items-center gap-2"
                                  >
                                    <span>{category.icon}</span>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Discount Value</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder={form.watch("discountType") === "percentage" ? "20" : "1000"}
                                  className="h-11 pr-8"
                                  {...field}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-muted-foreground">
                                    {form.watch("discountType") === "percentage" ? "%" : "₹"}
                                  </span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="redemptionLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Redemption Limit</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="100" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of times this offer can be used
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-6 bg-green-50 dark:bg-green-950/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Clock className="h-5 w-5" />
                      Validity Period
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="validFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Valid From</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="validUntil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Valid Until</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-6 bg-blue-50 dark:bg-blue-950/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                      Terms and Conditions
                    </h3>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="termsAndConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Terms and Conditions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Specify the terms, conditions, and any restrictions that apply to this offer..."
                                className="resize-none min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Clearly outline usage restrictions, eligibility criteria, and any other important conditions
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-6 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Tag className="h-5 w-5" />
                      Additional Information
                    </h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="promoCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Promo Code (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="SUMMER2024" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty to auto-generate a code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                    className="min-w-[120px]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[120px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Offer"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 