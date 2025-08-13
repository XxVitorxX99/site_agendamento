
'use client';

import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="relative">
        <div 
          className="h-screen bg-cover bg-center bg-no-repeat flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20church%20interior%20with%20beautiful%20stained%20glass%20windows%2C%20warm%20lighting%2C%20peaceful%20atmosphere%2C%20wooden%20pews%20arranged%20in%20rows%2C%20altar%20area%20visible%20in%20background%2C%20contemporary%20religious%20architecture%2C%20serene%20and%20welcoming%20environment%20for%20community%20gatherings%20and%20worship&width=1920&height=1080&seq=hero-church&orientation=landscape')`
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://static.readdy.ai/image/1d6c19a0a86db609544390caf212d72f/859c96a03b347d5a003e1328fc4bcd4f.jfif" 
                  alt="Logo São João de Brito" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-5xl font-bold text-white leading-tight">
                    Sistema de Agendamento
                    <span className="block text-blue-300">São João de Brito</span>
                  </h1>
                </div>
              </div>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Gerencie facilmente os agendamentos das instalações da comunidade. 
                Acesso simples, seguro e organizado para todos os usuários.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/registro"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium whitespace-nowrap"
                >
                  Começar Agora
                </Link>
                <Link 
                  href="/login"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-colors text-lg font-medium border border-white/20 whitespace-nowrap"
                >
                  Fazer Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      // ... rest of existing code ...
    </div>
  );
}
