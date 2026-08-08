'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Swim AI</h1>
            </div>
            <div className="flex items-center">
              <p className="text-gray-600 mr-4">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</p>
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/sign-in');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-4">Welcome to the Swim AI coaching platform.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900">Coaches</h3>
              <p className="text-gray-600 text-sm mt-2">Manage your coaching profile</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900">Athletes</h3>
              <p className="text-gray-600 text-sm mt-2">Track athlete performance</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900">Workouts</h3>
              <p className="text-gray-600 text-sm mt-2">Create and assign workouts</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Created:</strong> {user?.createdAt?.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
