export const metadata = {
  title: "Terms of Service - Ridewise",
  description: "Ridewise Terms of Service",
}

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden bg-card">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">These Terms govern your use of the Ridewise service. By using our website, you agree to these terms.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Usage</h2>
        <p className="text-muted-foreground">Ridewise provides fare comparison information only. Actual booking is performed on provider platforms.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitations</h2>
        <p className="text-muted-foreground">We strive for accuracy but cannot guarantee exact parity with provider prices due to dynamic pricing.</p>
      </div>
    </main>
  )
}
