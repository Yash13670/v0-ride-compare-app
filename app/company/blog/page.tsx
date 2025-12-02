export const metadata = {
  title: "Blog - Ridewise",
  description: "Updates, stories and product news from Ridewise.",
}

export default function BlogPage() {
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
        <h1 className="text-3xl font-bold mb-4">Ridewise Blog</h1>
        <p className="text-muted-foreground mb-4">Welcome to our blog. Here we share product updates, mobility insights and stories from the team.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Latest</h2>
        <ul className="space-y-4 text-muted-foreground">
          <li>
            <a href="#" className="underline">How we improved fare accuracy across cities</a>
            <div className="text-sm">Oct 10, 2025 — by Team Ridewise</div>
          </li>
        </ul>
      </div>
    </main>
  )
}
