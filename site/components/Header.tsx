
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAdmin(parsedUser.tipo === 'admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="https://static.readdy.ai/image/1d6c19a0a86db609544390caf212d72f/859c96a03b347d5a003e1328fc4bcd4f.jfif" 
              alt="Logo Paróquia São Paulo" 
              className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
            />
            <span className="font-['Pacifico'] text-2xl text-blue-600">SJS</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
                  Dashboard
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/usuarios" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
                      Painel Admin
                    </Link>
                    <Link href="/relatorios" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
                      Relatórios
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
                  Entrar
                </Link>
                <Link href="/registro" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
