import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Swim AI</h1>
          <p className="mt-2 text-gray-600">Sign in to your coaching account</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
