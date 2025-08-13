
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default function PainelAdministrativo() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [instalacoes, setInstalacoes] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInstallationModal, setShowInstallationModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupUsersModal, setShowGroupUsersModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    tipo: 'usuario',
    senha: ''
  });

  const [installationForm, setInstallationForm] = useState('');
  const [communityForm, setCommunityForm] = useState('');
  const [groupForm, setGroupForm] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.tipo !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);

    // Carregar dados
    const savedUsuarios = JSON.parse(localStorage.getItem('users') || '[]');
    const savedAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const savedInstalacoes = JSON.parse(localStorage.getItem('instalacoes') || JSON.stringify([
      'Igreja', 'Cozinha', 'Salão Paroquial', 'Sala 1 Santa Dulce dos Pobres',
      'Sala 2 Madre Tereza de Calcutá', 'Sala Rampa Nossa Senhora Sede de Sabedoria'
    ]));
    const savedComunidades = JSON.parse(localStorage.getItem('comunidades') || JSON.stringify([
      'São Paulo', 'São Pedro', 'São Benedito'
    ]));
    const savedGrupos = JSON.parse(localStorage.getItem('grupos') || '[]');

    setUsuarios(savedUsuarios);
    setAgendamentos(savedAgendamentos);
    setInstalacoes(savedInstalacoes);
    setComunidades(savedComunidades);
    setGrupos(savedGrupos);
  }, [router]);

  const filteredUsuarios = usuarios.filter((usuario: any) =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsuarios = usuarios.filter((u: any) => u.id !== userId);
      setUsuarios(updatedUsuarios);
      localStorage.setItem('users', JSON.stringify(updatedUsuarios));

      const updatedAgendamentos = agendamentos.filter((a: any) => a.usuarioId !== userId);
      setAgendamentos(updatedAgendamentos);
      localStorage.setItem('agendamentos', JSON.stringify(updatedAgendamentos));
    }
  };

  const handleEditUser = (usuario: any) => {
    setEditingUser(usuario);
    setUserForm({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      senha: ''
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (e: any) => {
    e.preventDefault();

    if (editingUser) {
      const updatedUsuarios = usuarios.map((u: any) =>
        u.id === editingUser.id
          ? { ...u, ...userForm, senha: userForm.senha || u.senha }
          : u
      );
      setUsuarios(updatedUsuarios);
      localStorage.setItem('users', JSON.stringify(updatedUsuarios));
    } else {
      const newUser = {
        id: Date.now(),
        ...userForm,
        criadoEm: new Date().toISOString()
      };
      const updatedUsuarios = [...usuarios, newUser];
      setUsuarios(updatedUsuarios);
      localStorage.setItem('users', JSON.stringify(updatedUsuarios));
    }

    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ nome: '', email: '', tipo: 'usuario', senha: '' });
  };

  const handleAddInstallation = (e: any) => {
    e.preventDefault();
    if (installationForm.trim()) {
      let updatedInstalacoes;

      if (editingInstallation !== null) {
        updatedInstalacoes = instalacoes.map((inst: string, index: number) =>
          index === editingInstallation ? installationForm : inst
        );
      } else {
        updatedInstalacoes = [...instalacoes, installationForm];
      }

      setInstalacoes(updatedInstalacoes);
      localStorage.setItem('instalacoes', JSON.stringify(updatedInstalacoes));
      setInstallationForm('');
      setEditingInstallation(null);
      setShowInstallationModal(false);
    }
  };

  const handleAddCommunity = (e: any) => {
    e.preventDefault();
    if (communityForm.trim()) {
      let updatedComunidades;

      if (editingCommunity !== null) {
        updatedComunidades = comunidades.map((com: string, index: number) =>
          index === editingCommunity ? communityForm : com
        );
      } else {
        updatedComunidades = [...comunidades, communityForm];
      }

      setComunidades(updatedComunidades);
      localStorage.setItem('comunidades', JSON.stringify(updatedComunidades));
      setCommunityForm('');
      setEditingCommunity(null);
      setShowCommunityModal(false);
    }
  };

  const handleSaveGroup = (e: any) => {
    e.preventDefault();

    if (editingGroup) {
      const updatedGrupos = grupos.map((g: any) =>
        g.id === editingGroup.id ? { ...g, ...groupForm } : g
      );
      setGrupos(updatedGrupos);
      localStorage.setItem('grupos', JSON.stringify(updatedGrupos));
    } else {
      const newGroup = {
        id: Date.now(),
        ...groupForm,
        usuarios: [],
        criadoEm: new Date().toISOString()
      };
      const updatedGrupos = [...grupos, newGroup];
      setGrupos(updatedGrupos);
      localStorage.setItem('grupos', JSON.stringify(updatedGrupos));
    }

    setShowGroupModal(false);
    setEditingGroup(null);
    setGroupForm({ nome: '', descricao: '', cor: '#3B82F6' });
  };

  const handleAddUsersToGroup = () => {
    if (selectedGroup && selectedUsers.length > 0) {
      const updatedGrupos = grupos.map((g: any) =>
        g.id === selectedGroup.id
          ? { ...g, usuarios: [...new Set([...g.usuarios, ...selectedUsers])] }
          : g
      );
      setGrupos(updatedGrupos);
      localStorage.setItem('grupos', JSON.stringify(updatedGrupos));
      setShowGroupUsersModal(false);
      setSelectedUsers([]);
    }
  };

  const handleRemoveUserFromGroup = (groupId: number, userId: number) => {
    const updatedGrupos = grupos.map((g: any) =>
      g.id === groupId
        ? { ...g, usuarios: g.usuarios.filter((uid: number) => uid !== userId) }
        : g
    );
    setGrupos(updatedGrupos);
    localStorage.setItem('grupos', JSON.stringify(updatedGrupos));
  };

  const handleDeleteAgendamento = (agendamentoId: number) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const updatedAgendamentos = agendamentos.filter((a: any) => a.id !== agendamentoId);
      setAgendamentos(updatedAgendamentos);
      localStorage.setItem('agendamentos', JSON.stringify(updatedAgendamentos));
    }
  };

  const stats = {
    totalUsuarios: usuarios.length,
    totalAgendamentos: agendamentos.length,
    agendamentosHoje: agendamentos.filter((a: any) => {
      const hoje = new Date().toISOString().split('T')[0];
      return a.data === hoje;
    }).length,
    usuariosAdmin: usuarios.filter((u: any) => u.tipo === 'admin').length,
    totalInstalacoes: instalacoes.length,
    totalComunidades: comunidades.length,
    totalGrupos: grupos.length
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="mb-8 flex items-center gap-4">
          <img
            src="https://static.readdy.ai/image/1d6c19a0a86db609544390caf212d72f/859c96a03b347d5a003e1328fc4bcd4f.jfif"
            alt="Logo"
            className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie usuários, instalações, comunidades e grupos</p>
          </div>
        </div>

        {/* Navegação por abas */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Visão Geral', icon: 'ri-dashboard-line' },
                { id: 'usuarios', label: `Usuários (${usuarios.length})`, icon: 'ri-user-line' },
                { id: 'agendamentos', label: `Agendamentos (${agendamentos.length})`, icon: 'ri-calendar-line' },
                { id: 'instalacoes', label: `Instalações (${instalacoes.length})`, icon: 'ri-building-line' },
                { id: 'comunidades', label: `Comunidades (${comunidades.length})`, icon: 'ri-community-line' },
                { id: 'grupos', label: `Grupos (${grupos.length})`, icon: 'ri-group-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Visão Geral */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Usuários', value: stats.totalUsuarios, icon: 'ri-user-line', color: 'blue' },
                { label: 'Total Agendamentos', value: stats.totalAgendamentos, icon: 'ri-calendar-line', color: 'green' },
                { label: 'Instalações', value: stats.totalInstalacoes, icon: 'ri-building-line', color: 'purple' },
                { label: 'Grupos Ativos', value: stats.totalGrupos, icon: 'ri-group-line', color: 'orange' }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <i className={`${stat.icon} text-xl text-${stat.color}-600`}></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Agendamentos Recentes</h3>
              <div className="space-y-3">
                {agendamentos.slice(0, 5).map((agendamento: any) => (
                  <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-calendar-line text-blue-600"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{agendamento.instalacao}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(agendamento.data).toLocaleDateString('pt-BR')} - {agendamento.usuario}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {agendamento.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Usuários */}
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Gerenciar Usuários</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-user-add-line mr-2"></i>
                    Adicionar Usuário
                  </button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario: any) => {
                    const userGroups = grupos.filter((g: any) => g.usuarios.includes(usuario.id));
                    return (
                      <tr key={usuario.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <i className="ri-user-line text-gray-500"></i>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.tipo === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.criadoEm ? new Date(usuario.criadoEm).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {userGroups.slice(0, 2).map((grupo: any) => (
                              <span
                                key={grupo.id}
                                className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                                style={{ backgroundColor: grupo.cor + '20', color: grupo.cor }}
                              >
                                {grupo.nome}
                              </span>
                            ))}
                            {userGroups.length > 2 && (
                              <span className="text-xs text-gray-500">+{userGroups.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditUser(usuario)}
                            className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usuario.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aba Instalações */}
        {activeTab === 'instalacoes' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Gerenciar Instalações</h2>
                <button
                  onClick={() => setShowInstallationModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-add-line mr-2"></i>
                  Adicionar Instalação
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instalacoes.map((instalacao: string, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-building-line text-blue-600"></i>
                        </div>
                        <span className="ml-3 font-medium text-gray-900">{instalacao}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingInstallation(index);
                            setInstallationForm(instalacao);
                            setShowInstallationModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta instalação?')) {
                              const updated = instalacoes.filter((_, i) => i !== index);
                              setInstalacoes(updated);
                              localStorage.setItem('instalacoes', JSON.stringify(updated));
                            }
                          }}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Comunidades */}
        {activeTab === 'comunidades' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Gerenciar Comunidades</h2>
                <button
                  onClick={() => setShowCommunityModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-add-line mr-2"></i>
                  Adicionar Comunidade
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comunidades.map((comunidade: string, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className="ri-community-line text-green-600"></i>
                        </div>
                        <span className="ml-3 font-medium text-gray-900">{comunidade}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommunity(index);
                            setCommunityForm(comunidade);
                            setShowCommunityModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta comunidade?')) {
                              const updated = comunidades.filter((_, i) => i !== index);
                              setComunidades(updated);
                              localStorage.setItem('comunidades', JSON.stringify(updated));
                            }
                          }}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Grupos */}
        {activeTab === 'grupos' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Gerenciar Grupos</h2>
                <button
                  onClick={() => setShowGroupModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-group-add-line mr-2"></i>
                  Criar Grupo
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grupos.map((grupo: any) => (
                  <div key={grupo.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: grupo.cor + '20' }}
                        >
                          <i className="ri-group-line text-xl" style={{ color: grupo.cor }}></i>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{grupo.nome}</h3>
                          <p className="text-sm text-gray-500">{grupo.usuarios.length} membros</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedGroup(grupo);
                            setShowGroupUsersModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                          title="Adicionar usuários"
                        >
                          <i className="ri-user-add-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            setEditingGroup(grupo);
                            setGroupForm({
                              nome: grupo.nome,
                              descricao: grupo.descricao,
                              cor: grupo.cor
                            });
                            setShowGroupModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este grupo?')) {
                              const updated = grupos.filter((g: any) => g.id !== grupo.id);
                              setGrupos(updated);
                              localStorage.setItem('grupos', JSON.stringify(updated));
                            }
                          }}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{grupo.descricao}</p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Membros:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {grupo.usuarios.map((userId: number) => {
                          const usuario = usuarios.find((u: any) => u.id === userId);
                          return usuario ? (
                            <div key={userId} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{usuario.nome}</span>
                              <button
                                onClick={() => handleRemoveUserFromGroup(grupo.id, userId)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <i className="ri-close-line"></i>
                              </button>
                            </div>
                          ) : null;
                        })}
                        {grupo.usuarios.length === 0 && (
                          <p className="text-xs text-gray-400">Nenhum membro adicionado</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Agendamentos */}
        {activeTab === 'agendamentos' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gerenciar Agendamentos</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instalação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agendamentos.map((agendamento: any) => (
                    <tr key={agendamento.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agendamento.horaInicio} - {agendamento.horaFim}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{agendamento.instalacao}</div>
                        <div className="text-sm text-gray-500">{agendamento.comunidade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agendamento.usuario}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {agendamento.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteAgendamento(agendamento.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {agendamentos.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Nenhum agendamento encontrado</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Usuário */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                      setUserForm({ nome: '', email: '', tipo: 'usuario', senha: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSaveUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={userForm.nome}
                      onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      value={userForm.tipo}
                      onChange={(e) => setUserForm({ ...userForm, tipo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                    >
                      <option value="usuario">Usuário</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha {editingUser && '(deixe em branco para manter a atual)'}
                    </label>
                    <input
                      type="password"
                      value={userForm.senha}
                      onChange={(e) => setUserForm({ ...userForm, senha: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!editingUser}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {editingUser ? 'Salvar' : 'Adicionar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserModal(false);
                        setEditingUser(null);
                        setUserForm({ nome: '', email: '', tipo: 'usuario', senha: '' });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Instalação */}
        {showInstallationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingInstallation !== null ? 'Editar Instalação' : 'Adicionar Instalação'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowInstallationModal(false);
                      setEditingInstallation(null);
                      setInstallationForm('');
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleAddInstallation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Instalação</label>
                    <input
                      type="text"
                      value={installationForm}
                      onChange={(e) => setInstallationForm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Sala de Reuniões"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {editingInstallation !== null ? 'Salvar' : 'Adicionar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInstallationModal(false);
                        setEditingInstallation(null);
                        setInstallationForm('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Comunidade */}
        {showCommunityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingCommunity !== null ? 'Editar Comunidade' : 'Adicionar Comunidade'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCommunityModal(false);
                      setEditingCommunity(null);
                      setCommunityForm('');
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleAddCommunity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Comunidade</label>
                    <input
                      type="text"
                      value={communityForm}
                      onChange={(e) => setCommunityForm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: São Miguel"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {editingCommunity !== null ? 'Salvar' : 'Adicionar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommunityModal(false);
                        setEditingCommunity(null);
                        setCommunityForm('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Grupo */}
        {showGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingGroup ? 'Editar Grupo' : 'Criar Grupo'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowGroupModal(false);
                      setEditingGroup(null);
                      setGroupForm({ nome: '', descricao: '', cor: '#3B82F6' });
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSaveGroup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Grupo</label>
                    <input
                      type="text"
                      value={groupForm.nome}
                      onChange={(e) => setGroupForm({ ...groupForm, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Catequistas"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <textarea
                      value={groupForm.descricao}
                      onChange={(e) => setGroupForm({ ...groupForm, descricao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                      placeholder="Descreva o propósito do grupo..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Grupo</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={groupForm.cor}
                        onChange={(e) => setGroupForm({ ...groupForm, cor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={groupForm.cor}
                        onChange={(e) => setGroupForm({ ...groupForm, cor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {editingGroup ? 'Salvar' : 'Criar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGroupModal(false);
                        setEditingGroup(null);
                        setGroupForm({ nome: '', descricao: '', cor: '#3B82F6' });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Adicionar Usuários ao Grupo */}
        {showGroupUsersModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Adicionar Usuários - {selectedGroup.nome}
                  </h3>
                  <button
                    onClick={() => {
                      setShowGroupUsersModal(false);
                      setSelectedGroup(null);
                      setSelectedUsers([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                <div className="space-y-3">
                  {usuarios
                    .filter((u: any) => !selectedGroup.usuarios.includes(u.id))
                    .map((usuario: any) => (
                      <label key={usuario.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(usuario.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, usuario.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== usuario.id));
                            }
                          }}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-gray-500 text-sm"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
                            <p className="text-xs text-gray-500">{usuario.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}

                  {usuarios.filter((u: any) => !selectedGroup.usuarios.includes(u.id)).length === 0 && (
                    <p className="text-center text-gray-500 py-8">Todos os usuários já estão neste grupo</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddUsersToGroup}
                    disabled={selectedUsers.length === 0}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => {
                      setShowGroupUsersModal(false);
                      setSelectedGroup(null);
                      setSelectedUsers([]);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
