export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>Model Version: v2.1.3</span>
            <span>Last Processing: 2024-01-15 14:35:22 UTC</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Account: AgriTech Solutions</span>
            <span>© 2024 Crop Health Monitor</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
