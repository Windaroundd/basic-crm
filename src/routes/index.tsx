import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to thimut</CardTitle>
          <CardDescription>
            Vite + React 19 + TS + Tailwind v4 + shadcn/ui + TanStack + Supabase
            + Recharts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => toast.success('Stack is wired up!')}>
            Test toast
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
