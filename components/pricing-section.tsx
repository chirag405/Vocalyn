"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const pricingPlans = [
  {
    name: "Free",
    description: "Try out the platform with basic features",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 AI agent",
      "5-minute conversation sessions",
      "3 sessions per day",
      "25 MB storage",
      "7-day memory retention",
      "Basic voice interactions",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    description: "Perfect for personal use",
    price: { monthly: 499, yearly: 4999 },
    features: [
      "3 AI agents",
      "15-minute conversation sessions",
      "5 sessions per day",
      "100 MB storage",
      "30-day memory retention",
      "Basic conversation memory",
      "Basic transcript analysis",
      "Email support",
    ],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    name: "Professional",
    description: "For power users and small teams",
    price: { monthly: 1499, yearly: 14999 },
    features: [
      "10 AI agents",
      "45-minute conversation sessions",
      "15 sessions per day",
      "1 GB storage",
      "90-day memory retention",
      "Advanced voice customization",
      "Enhanced conversation memory",
      "Sentiment analysis",
      "Custom voice models",
      "Priority support",
    ],
    cta: "Subscribe Now",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: { monthly: 3999, yearly: 39999 },
    features: [
      "25 AI agents",
      "120-minute conversation sessions",
      "50 sessions per day",
      "5 GB storage",
      "365-day memory retention",
      "Premium voice quality",
      "Advanced conversation memory",
      "Comprehensive analytics dashboard",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that's right for you based on your agent needs and conversation requirements.
          </p>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Label
              htmlFor="billing-cycle"
              className={billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}
            >
              Monthly
            </Label>
            <Switch
              id="billing-cycle"
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
            />
            <Label
              htmlFor="billing-cycle"
              className={billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}
            >
              Yearly <span className="text-sm text-primary">(Save 16%)</span>
            </Label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price[billingCycle].toLocaleString("en-IN")}</span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-muted-foreground ml-1">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
