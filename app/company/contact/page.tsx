export const metadata = {
  title: "Contact - Ridewise",
  description: "Contact Ridewise — support, press and partnerships.",
}

export default function ContactPage() {
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
        <h1 className="text-3xl font-bold mb-4">Contact Ridewise</h1>
        <p className="text-muted-foreground mb-4">For support, press or partnerships, reach out to us using the channels below.</p>

        <ul className="text-muted-foreground space-y-2">
          <li><strong>Support:</strong> <a href="mailto:support@ridewise.example" className="underline">support@ridewise.example</a></li>
          <li><strong>Press:</strong> <a href="mailto:press@ridewise.example" className="underline">press@ridewise.example</a></li>
          <li><strong>Partnerships:</strong> <a href="mailto:partners@ridewise.example" className="underline">partners@ridewise.example</a></li>
        </ul>
      </div>
    </main>
  )
}
