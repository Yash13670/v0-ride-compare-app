export const metadata = {
  title: "Cookie Policy - Ridewise",
  description: "Ridewise Cookie Policy",
}

export default function CookiesPage() {
  return (
    <main className="relative overflow-hidden bg-card">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground mb-4">We use cookies to improve site performance and remember settings. You can disable cookies in your browser.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Types of Cookies</h2>
        <p className="text-muted-foreground">Essential cookies, performance cookies and analytics cookies may be used.</p>
      </div>
    </main>
  )
}
