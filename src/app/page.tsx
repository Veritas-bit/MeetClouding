import { LoginForm } from '@/components/login-form';
import { LinguaLinkLogo } from '@/components/icons';

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <LinguaLinkLogo className="h-16 w-16 text-primary" />
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            Welcome to LinguaLink
          </h1>
          <p className="text-muted-foreground">
            Connect across languages with real-time translation.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          You will receive an email with a magic link to sign in.
        </p>
      </div>
    </main>
  );
}
