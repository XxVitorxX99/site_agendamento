'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipo: 'usuario'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simular login (aqui você integraria com Supabase)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === formData.email && u.senha === formData.senha && u.tipo === formData.tipo);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas ou tipo de usuário incorreto');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Entrar na sua conta</h2>
            <p className="text-gray-600">Acesse o sistema de agendamento</p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-sm" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de usuário</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="usuario"
                      checked={formData.tipo === 'usuario'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Usuário</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="admin"
                      checked={formData.tipo === 'admin'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Administrador</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center space-y-2">
              <Link href="/recuperar-senha" className="text-blue-600 hover:text-blue-700 text-sm">
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/registro" className="text-blue-600 hover:text-blue-700">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}