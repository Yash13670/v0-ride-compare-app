export const metadata = {
  title: "About Us - Ridewise",
  description: "Learn about Ridewise — mission, values and what we do.",
}

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-card">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
          <div className="absolute inset-0 border border-primary/10 rounded-full animate-rotate-slow" />
          <div className="absolute inset-8 border border-primary/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h1 className="text-3xl font-bold mb-4">About Ridewise</h1>
        <p className="text-muted-foreground mb-4">
          Ridewise helps travellers compare ride options across providers to find the best price and ETA for their trip. We aggregate prices from popular services and present clear comparisons so you can save time and money.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Our Mission</h2>
        <p className="text-muted-foreground">
          To make urban mobility transparent and affordable by giving riders the information they need to choose the best option.
        </p>
      </div>
    </main>
  )
}
