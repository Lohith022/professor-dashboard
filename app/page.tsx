import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Face Recognition Attendance</h1>
          <p className="text-muted-foreground">Professor Dashboard - Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
