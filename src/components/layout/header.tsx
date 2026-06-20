import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function Header() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center gap-4 p-4">
        <Link to="/" className="font-semibold [&.active]:underline">
          Home
        </Link>
        <Link to="/dashboard" className="[&.active]:underline">
          Dashboard
        </Link>
        <Link to="/signin" className="[&.active]:underline">
          Sign in
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
