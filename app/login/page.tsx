import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <LoginForm />
    </div>
  );
}
