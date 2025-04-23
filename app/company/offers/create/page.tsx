import { CreateOfferForm } from "@/components/company/create-offer-form"

export default function CreateOfferPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Offer</h1>
        <p className="text-muted-foreground">Create a new discount offer for employees of partner companies.</p>
      </div>
      <CreateOfferForm />
    </div>
  )
}
