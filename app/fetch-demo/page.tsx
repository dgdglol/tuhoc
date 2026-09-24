import React from 'react';

// Define the type for the data we're fetching
interface User {
  id: number;
  name: string;
  email: string;
  website: string;
  company: {
    name: string;
  };
}

// Next.js App Router Server Component
export default async function FetchDemoPage() {
  // Fetch data from a public API
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    // Next.js caching options (optional)
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const users: User[] = await res.json();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Demo Lấy Dữ Liệu (Fetch Data)</h1>
      <p className="mb-8 text-slate-600">
        Trang này minh họa cách fetch data trên Server Component trong Next.js App Router.
        Dữ liệu được lấy từ <code>jsonplaceholder.typicode.com</code>.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => (
          <div key={user.id} className="border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{user.name}</h2>
            <div className="text-sm text-slate-600 space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Công ty:</strong> {user.company.name}</p>
              <p>
                <strong>Website:</strong>{' '}
                <a 
                  href={`https://${user.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
