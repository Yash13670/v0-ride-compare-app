export const metadata = {
  title: "Careers - Ridewise",
  description: "Join the Ridewise team — open roles and hiring information.",
}

export default function CareersPage() {
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
        <h1 className="text-3xl font-bold mb-4">Careers at Ridewise</h1>
        <p className="text-muted-foreground mb-4">
          We're building tools to make urban travel more transparent. If you're passionate about product, maps or data, we'd love to hear from you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Open Roles</h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>Frontend Engineer (React / Next.js)</li>
          <li>Backend Engineer (Node / APIs)</li>
          <li>Product Manager</li>
          <li>Data Engineer / Analyst</li>
        </ul>

        <p className="text-muted-foreground mt-6">Send your CV to <a href="mailto:jobs@ridewise.example" className="underline">jobs@ridewise.example</a></p>
      </div>
    </main>
  )
}
