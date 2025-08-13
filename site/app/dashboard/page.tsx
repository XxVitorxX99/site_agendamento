
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [instalacoes, setInstalacoes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    comunidade: 'São Paulo',
    instalacao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    descricao: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Carregar agendamentos
    const savedAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    setAgendamentos(savedAgendamentos);

    // Carregar instalações (com padrões se não existir)
    const savedInstalacoes = JSON.parse(localStorage.getItem('instalacoes') || JSON.stringify([
      'Igreja',
      'Cozinha', 
      'Salão Paroquial',
      'Sala 1 Santa Dulce dos Pobres',
      'Sala 2 Madre Tereza de Calcutá',
      'Sala Rampa Nossa Senhora Sede de Sabedoria'
    ]));
    setInstalacoes(savedInstalacoes);
  }, [router]);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const novoAgendamento = {
      id: Date.now(),
      ...formData,
      usuario: user?.nome,
      usuarioId: user?.id,
      status: 'Confirmado',
      criadoEm: new Date().toISOString()
    };

    const novosAgendamentos = [...agendamentos, novoAgendamento];
    setAgendamentos(novosAgendamentos);
    localStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));

    setShowForm(false);
    setFormData({
      comunidade: 'São Paulo',
      instalacao: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      descricao: ''
    });
  };

  const meusAgendamentos = agendamentos.filter((ag: any) => 
    user?.tipo === 'admin' ? true : ag.usuarioId === user?.id
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header com logo centralizado */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <img 
              src="https://static.readdy.ai/image/1d6c19a0a86db609544390caf212d72f/859c96a03b347d5a003e1328fc4bcd4f.jfif" 
              alt="Logo São João de Brito" 
              className="w-full h-full rounded-full object-cover border-4 border-red-600 shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sistema de Agendamento Paroquial
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gerencie agendamentos das comunidades São Paulo, São Pedro e São Benedito de forma simples e eficiente
          </p>
        </div>

        {/* Cards principais centralizados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
          {/* Card Fazer Agendamento */}
          <div 
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={() => setShowForm(true)}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-calendar-check-line text-3xl text-blue-600"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fazer Agendamento</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Agende salas e espaços das comunidades de forma rápida e intuitiva
            </p>
            <div className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium whitespace-nowrap inline-block">
              Entrar para Agendar
            </div>
          </div>

          {/* Card Área Administrativa */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-settings-3-line text-3xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Área Administrativa</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Acesse o dashboard para gerenciar usuários, agendamentos e relatórios
            </p>
            {user.tipo === 'admin' ? (
              <Link
                href="/usuarios"
                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-medium whitespace-nowrap inline-block"
              >
                Login Administrativo
              </Link>
            ) : (
              <div className="bg-gray-300 text-gray-500 px-8 py-3 rounded-full font-medium whitespace-nowrap inline-block">
                Acesso Restrito
              </div>
            )}
          </div>
        </div>

        {/* Link para cadastro centralizado */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-lg mb-4">Não possui conta?</p>
          <Link
            href="/registro"
            className="text-blue-600 hover:text-blue-700 font-medium text-lg underline transition-colors"
          >
            Criar conta agora
          </Link>
        </div>

        {/* Estatísticas rápidas */}
        {meusAgendamentos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Resumo dos Agendamentos</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{meusAgendamentos.length}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {meusAgendamentos.filter((ag: any) => ag.status === 'Confirmado').length}
                </div>
                <div className="text-gray-600">Confirmados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{instalacoes.length}</div>
                <div className="text-gray-600">Instalações</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal do formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Novo Agendamento</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comunidade</label>
                      <input
                        type="text"
                        name="comunidade"
                        value={formData.comunidade}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instalação</label>
                      <select
                        name="instalacao"
                        value={formData.instalacao}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                        required
                      >
                        <option value="">Selecione uma instalação</option>
                        {instalacoes.map((inst, index) => (
                          <option key={index} value={inst}>{inst}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                      <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Início</label>
                      <input
                        type="time"
                        name="horaInicio"
                        value={formData.horaInicio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Término</label>
                      <input
                        type="time"
                        name="horaFim"
                        value={formData.horaFim}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                        placeholder="Descreva o evento ou atividade..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      Criar Agendamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de agendamentos */}
        {meusAgendamentos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {user.tipo === 'admin' ? 'Todos os Agendamentos' : 'Meus Agendamentos'}
            </h3>

            <div className="space-y-4">
              {meusAgendamentos.slice(0, 5).map((agendamento: any) => (
                <div key={agendamento.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{agendamento.instalacao}</h4>
                      <p className="text-gray-600 text-sm mb-2">{agendamento.comunidade}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                        <span>{agendamento.horaInicio} - {agendamento.horaFim}</span>
                        {user.tipo === 'admin' && <span>Por: {agendamento.usuario}</span>}
                      </div>
                    </div>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {agendamento.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
