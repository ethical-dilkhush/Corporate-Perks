"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { ArrowLeft, ChevronDown, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const faqCategories = [
  {
    title: "General Questions",
    questions: [
      {
        question: "What is Corporate Perks?",
        answer: "Corporate Perks is a platform that helps companies provide exclusive benefits and discounts to their employees through curated partnerships with top vendors and service providers."
      },
      {
        question: "How does Corporate Perks work?",
        answer: "Companies sign up for Corporate Perks and gain access to a curated selection of exclusive deals and benefits. Employees can then access these perks through their company's portal, enjoying discounts and special offers from our partner vendors."
      },
      {
        question: "Is Corporate Perks free to use?",
        answer: "Corporate Perks offers different pricing tiers based on company size and needs. We have a free tier for small businesses and premium plans for larger organizations with more extensive benefits."
      }
    ]
  },
  {
    title: "For Companies",
    questions: [
      {
        question: "How do I sign up my company?",
        answer: "You can sign up your company by visiting our Vendors page and filling out the partnership form. Our team will review your application and get back to you within 2-3 business days."
      },
      {
        question: "What types of benefits can we offer?",
        answer: "We offer a wide range of benefits including discounts on technology, travel, wellness programs, retail shopping, and more. The specific benefits available depend on your company's location and the partnerships we have in your region."
      },
      {
        question: "How do we track employee engagement?",
        answer: "Our platform provides detailed analytics and reporting tools that allow you to track employee engagement, redemption rates, and overall program effectiveness."
      }
    ]
  },
  {
    title: "For Employees",
    questions: [
      {
        question: "How do I access my company's perks?",
        answer: "Once your company has set up Corporate Perks, you'll receive an email invitation to create your account. You can then log in to access all available benefits and discounts."
      },
      {
        question: "Are the discounts really exclusive?",
        answer: "Yes, all discounts and benefits offered through Corporate Perks are exclusive to our partner companies and cannot be found through regular retail channels."
      },
      {
        question: "Can I share my benefits with family?",
        answer: "Some benefits can be extended to immediate family members, while others are strictly for employee use. Check the specific terms of each benefit for details."
      }
    ]
  },
  {
    title: "For Vendors",
    questions: [
      {
        question: "How can my business become a partner?",
        answer: "We welcome businesses of all sizes to join our partner network. Visit our Vendors page to learn more about partnership opportunities and submit your application."
      },
      {
        question: "What are the benefits of partnering with Corporate Perks?",
        answer: "As a partner, you'll gain access to a large network of corporate clients, increase brand visibility, and benefit from our marketing support and dedicated account management."
      },
      {
        question: "How are partnerships structured?",
        answer: "We offer flexible partnership models that can be customized to your business needs. Our team will work with you to create a partnership that benefits both your business and our corporate clients."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about Corporate Perks and how it works.
          </p>

          {/* Search Bar */}
          <div className="relative mb-12">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h2 className="text-2xl font-semibold">{category.title}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const index = categoryIndex * 100 + questionIndex
                    const isExpanded = expandedQuestions.includes(index)
                    return (
                      <div
                        key={index}
                        className="rounded-lg border bg-card p-6 transition-all hover:shadow-md"
                      >
                        <button
                          className="flex w-full items-center justify-between text-left"
                          onClick={() => toggleQuestion(index)}
                        >
                          <h3 className="text-lg font-medium">{item.question}</h3>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <p className="mt-4 text-muted-foreground">{item.answer}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 rounded-lg border bg-card p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-primary hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 