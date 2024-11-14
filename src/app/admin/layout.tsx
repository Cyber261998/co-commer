'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import AdminChat from '@/components/AdminChat';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Products
          </Link>
          <button 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
        <AdminChat />
      </main>
    </div>
  );
} 