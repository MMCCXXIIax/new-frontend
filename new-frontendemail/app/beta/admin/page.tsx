'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaAdmin() {
  const router = useRouter();
  const [signups, setSignups] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const data = JSON.parse(localStorage.getItem('beta_signups') || '[]');
      setSignups(data);
    }
  }, [authenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tx2025') { // Change this password!
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Timestamp'],
      ...signups.map(s => [s.name, s.email, s.timestamp])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tx-beta-signups.csv';
    a.click();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Beta Admin</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Beta Signups ({signups.length})</h1>
          <div className="flex gap-4">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
            >
              Export CSV
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {signups.map((signup, index) => (
                <tr key={index} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">{signup.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{signup.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(signup.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}