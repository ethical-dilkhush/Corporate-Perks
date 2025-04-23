"use client";

import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "The corporate perks platform has been a game-changer for our employees. The exclusive discounts and offers are fantastic!",
    author: "Sarah Johnson",
    role: "HR Manager, TechCorp",
    rating: 5,
  },
  {
    quote: "As an employee, I love having access to these exclusive benefits. It's like having a personal shopper for corporate discounts!",
    author: "Michael Chen",
    role: "Software Engineer, InnovateX",
    rating: 5,
  },
  {
    quote: "The platform is incredibly user-friendly, and the customer support is outstanding. Highly recommend for any company!",
    author: "Emily Rodriguez",
    role: "Marketing Director, GrowthHub",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Hear from companies and employees who are already enjoying the benefits of our platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="group relative flex flex-col rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-lg font-medium">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 