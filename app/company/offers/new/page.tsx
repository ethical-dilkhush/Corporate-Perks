"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building2, ArrowLeft, Upload, Calendar, Tag, Percent, Info, Clock, FileText, Users, Image as ImageIcon, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"

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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  partner_id: z.string().uuid("Please select a valid partner"),
  category: z.string().min(1, "Please select a category"),
  discountType: z.string().min(1, "Please select a discount type"),
  discountValue: z.string().min(1, "Please enter a discount value")
    .refine((val) => {
      if (val.includes('%')) {
        const num = parseFloat(val.replace('%', ''));
        return !isNaN(num) && num >= 0 && num <= 100;
      }
      return !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
    }, "Please enter a valid discount value"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  terms: z.string().min(10, "Terms must be at least 10 characters"),
  image: z.any().optional(),
})

const categories = [
  "Electronics",
  "Fashion & Apparel",
  "Food & Dining",
  "Health & Wellness",
  "Home & Living",
  "Travel & Hospitality",
  "Entertainment",
  "Education",
  "Other",
]

const discountTypes = [
  "Percentage",
  "Fixed Amount",
  "Buy One Get One",
  "Free Shipping",
]

interface Partner {
  id: string
  company_name: string
  partner_company_id: string | null
}

export default function NewOfferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoadingPartners, setIsLoadingPartners] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const partnerOptions = useMemo(() => partners, [partners])

  const fetchPartners = useCallback(async () => {
    setIsLoadingPartners(true)
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        router.push("/auth/login")
        toast({
          title: "Session expired",
          description: "Please log in again to create offers.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("partners")
        .select("id, company_name, partner_company_id")
        .eq("owner_company_id", session.user.id)
        .order("company_name", { ascending: true })

      if (error) {
        throw error
      }

      setPartners(data || [])
    } catch (error) {
      console.error("Error fetching partners:", error)
      toast({
        title: "Unable to load partners",
        description:
          error instanceof Error ? error.message : "Please refresh the page and try again.",
        variant: "destructive",
      })
      setPartners([])
    } finally {
      setIsLoadingPartners(false)
    }
  }, [router, supabase, toast])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      partner_id: "",
      category: "",
      discountType: "",
      discountValue: "",
      terms: "",
      image: null,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    form.setValue("image", null)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSuccess(false)
    setErrorMsg("")
    
    try {
      // Validate dates
      if (values.endDate <= values.startDate) {
        throw new Error("End date must be after start date")
      }

      let imageUrl = null;

      // Handle image upload first if an image is selected
      if (selectedImage) {
        try {
          // Validate file type
          if (!selectedImage.type.startsWith('image/')) {
            throw new Error("Please upload a valid image file")
          }

          // Validate file size (2MB limit)
          if (selectedImage.size > 2 * 1024 * 1024) {
            throw new Error("Image must be less than 2MB")
          }

          const fileExt = selectedImage.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `offers/${fileName}`

          console.log('Attempting to upload image to path:', filePath)

          // Create form data
          const formData = new FormData()
          formData.append('file', selectedImage)

          // Upload image using the API route
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to upload image')
          }

          const { url } = await response.json()
          console.log('Image uploaded successfully, URL:', url)
          imageUrl = url

        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          // Continue with offer creation even if image upload fails
          toast({
            title: "Image upload failed",
            description: "The offer will be created without an image.",
            variant: "destructive",
          })
        }
      }

      // Prepare offer data
      const offerData = {
        title: values.title,
        description: values.description,
        partner_id: values.partner_id,
        category: values.category,
        discount_type: values.discountType,
        discount_value: values.discountValue,
        start_date: values.startDate.toISOString(),
        end_date: values.endDate.toISOString(),
        terms: values.terms,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      }

      console.log('Submitting offer data:', offerData)

      // Insert offer into database
      const { data, error } = await supabase
        .from("offers")
        .insert([offerData])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Failed to create offer: ${error.message}`)
      }

      if (data) {
        setSuccess(true)
        toast({
          title: "Offer created successfully",
          description: "The offer has been added to the database.",
        })
        
        // Reset form
        form.reset()
        setSelectedImage(null)
        setImagePreview(null)
        
        // Redirect to offers list after a short delay
        setTimeout(() => {
          router.push("/company/offers")
        }, 2000)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      setErrorMsg(errorMessage)
      toast({
        title: "Error creating offer",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Offer</h1>
          <p className="text-muted-foreground">
            Add a new offer for your partners
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Offer Information</CardTitle>
            <CardDescription>
              Fill in the details to create a new offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8">
                  {/* Partner Selection */}
                  <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Partner Company</h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="partner_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Partner</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={isLoadingPartners || partnerOptions.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue
                                  placeholder={
                                    isLoadingPartners
                                      ? "Loading partners..."
                                      : partnerOptions.length === 0
                                        ? "No approved partners available"
                                        : "Select partner company"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {partnerOptions.map((partner) => (
                                <SelectItem key={partner.id} value={partner.id}>
                                  {partner.company_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!isLoadingPartners && partnerOptions.length === 0 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Add a partner company before creating an offer.
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Main Form Content in 3 Columns */}
                  <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-8">
                      {/* Title and Description */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Offer Details</h3>
                        </div>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter offer title" 
                                    {...field} 
                                    value={field.value || ""}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter offer description"
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Category</h3>
                        </div>
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Middle Column */}
                    <div className="space-y-8">
                      {/* Discount Information */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Percent className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Discount Information</h3>
                        </div>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="discountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Select discount type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {discountTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
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
                            name="discountValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Value</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="text" 
                                    placeholder="Enter discount value" 
                                    {...field} 
                                    value={field.value || ""}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter percentage (e.g., 20%) or fixed amount (e.g., $50)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Validity Period */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Validity Period</h3>
                        </div>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full h-11 pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full h-11 pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      {/* Terms and Conditions */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Terms & Conditions</h3>
                        </div>
                        <FormField
                          control={form.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Terms and Conditions</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter terms and conditions"
                                  className="min-h-[200px] resize-none"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Offer Image</h3>
                        </div>
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Upload Image</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  {imagePreview ? (
                                    <div className="relative">
                                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                          src={imagePreview}
                                          alt="Preview"
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center w-full">
                                      <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50"
                                      >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                          <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            PNG, JPG or GIF (MAX. 2MB)
                                          </p>
                                        </div>
                                        <input
                                          id="image-upload"
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={handleImageChange}
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormDescription>
                                Upload an image for the offer (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="min-w-[120px]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? "Creating..." : "Create Offer"}
                  </Button>
                </div>
                {success && (
                  <div className="text-green-600 text-center mt-2">
                    ✅ Offer created successfully!
                  </div>
                )}
                {errorMsg && (
                  <div className="text-red-600 text-center mt-2">
                    ❌ {errorMsg}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 