export const metadata = {
  title: "Privacy Policy - Ridewise",
  description: "Ridewise Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden bg-card">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">This Privacy Policy explains how Ridewise collects and uses personal information.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Data We Collect</h2>
        <p className="text-muted-foreground">We collect location information when you search routes to calculate fares. We do not share personal data with third parties without consent.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="text-muted-foreground">For privacy inquiries, email <a href="mailto:privacy@ridewise.example" className="underline">privacy@ridewise.example</a>.</p>
      </div>
    </main>
  )
}
