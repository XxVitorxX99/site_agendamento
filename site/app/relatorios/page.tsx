
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

export default function Relatorios() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
    const savedAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const savedUsuarios = JSON.parse(localStorage.getItem('users') || '[]');
    setAgendamentos(savedAgendamentos);
    setUsuarios(savedUsuarios);
  }, [router]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const filteredAgendamentos = agendamentos.filter((ag: any) => {
    const agendamentoDate = new Date(ag.data);
    return agendamentoDate.getMonth() === selectedMonth && 
           agendamentoDate.getFullYear() === selectedYear;
  });

  const stats = {
    total: filteredAgendamentos.length,
    porInstalacao: filteredAgendamentos.reduce((acc: any, ag: any) => {
      acc[ag.instalacao] = (acc[ag.instalacao] || 0) + 1;
      return acc;
    }, {}),
    porUsuario: filteredAgendamentos.reduce((acc: any, ag: any) => {
      acc[ag.usuario] = (acc[ag.usuario] || 0) + 1;
      return acc;
    }, {}),
    totalUsuarios: usuarios.length,
    usuariosAtivos: [...new Set(agendamentos.map((a: any) => a.usuarioId))].length
  };

  // Função para exportar CSV
  const exportarCSV = () => {
    const csvContent = [
      ['Data', 'Hora Início', 'Hora Fim', 'Instalação', 'Comunidade', 'Usuário', 'Status', 'Descrição'],
      ...filteredAgendamentos.map((ag: any) => [
        new Date(ag.data).toLocaleDateString('pt-BR'),
        ag.horaInicio,
        ag.horaFim,
        ag.instalacao,
        ag.comunidade,
        ag.usuario,
        ag.status,
        ag.descricao || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-agendamentos-${months[selectedMonth]}-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Função para exportar relatório de usuários em CSV
  const exportarUsuariosCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Tipo', 'Data Cadastro', 'Total Agendamentos'],
      ...usuarios.map((usuario: any) => [
        usuario.nome,
        usuario.email,
        usuario.tipo === 'admin' ? 'Administrador' : 'Usuário',
        new Date(usuario.criadoEm || '').toLocaleDateString('pt-BR'),
        agendamentos.filter((a: any) => a.usuarioId === usuario.id).length
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-usuarios-${new Date().toLocaleDateString('pt-BR')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Função para gerar HTML para PDF (simulando geração de PDF)
  const gerarPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Agendamentos - ${months[selectedMonth]} ${selectedYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .instalacao-stats { margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Agendamentos</h1>
          <h2>${months[selectedMonth]} ${selectedYear}</h2>
          <p>Sistema de Agendamento Paroquial - São Paulo</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>${stats.total}</h3>
            <p>Total de Agendamentos</p>
          </div>
          <div class="stat-card">
            <h3>${Object.keys(stats.porInstalacao).length}</h3>
            <p>Instalações Utilizadas</p>
          </div>
          <div class="stat-card">
            <h3>${Object.keys(stats.porUsuario).length}</h3>
            <p>Usuários Ativos</p>
          </div>
        </div>

        <div class="instalacao-stats">
          <h3>Agendamentos por Instalação:</h3>
          ${Object.entries(stats.porInstalacao).map(([instalacao, count]) => 
            `<p><strong>${instalacao}:</strong> ${count} agendamento(s)</p>`
          ).join('')}
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Instalação</th>
              <th>Usuário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAgendamentos.map((ag: any) => `
              <tr>
                <td>${new Date(ag.data).toLocaleDateString('pt-BR')}</td>
                <td>${ag.horaInicio} - ${ag.horaFim}</td>
                <td>${ag.instalacao}</td>
                <td>${ag.usuario}</td>
                <td>${ag.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // Aguarda o carregamento do conteúdo antes de imprimir
      setTimeout(() => {
        newWindow.print();
      }, 500);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Relatórios</h1>
          <p className="text-gray-600">Gere e exporte relatórios detalhados do sistema</p>
        </div>

        {/* Filtros e botões de exportação */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Configurações do Relatório</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportarCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                <i className="ri-file-excel-2-line"></i>
                Exportar Excel
              </button>
              <button
                onClick={gerarPDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                <i className="ri-file-pdf-line"></i>
                Gerar PDF
              </button>
              <button
                onClick={exportarUsuariosCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                <i className="ri-user-line"></i>
                Relatório Usuários
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                {[2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Agendamentos do Mês</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Instalações Utilizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.porInstalacao).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.porUsuario).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uso por Instalação</h3>
            <div className="space-y-3">
              {Object.entries(stats.porInstalacao)
                .sort(([,a]: any, [,b]: any) => b - a)
                .map(([instalacao, count]: [string, any]) => (
                <div key={instalacao} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-3">{instalacao}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.porInstalacao).length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum dados para exibir</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usuários Mais Ativos</h3>
            <div className="space-y-3">
              {Object.entries(stats.porUsuario)
                .sort(([,a]: any, [,b]: any) => b - a)
                .slice(0, 8)
                .map(([usuario, count]: [string, any]) => (
                <div key={usuario} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-3">{usuario}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.porUsuario).length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum dados para exibir</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabela detalhada */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Detalhamento - {months[selectedMonth]} {selectedYear}
            </h3>
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
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgendamentos.map((agendamento: any, index: number) => (
                  <tr key={agendamento.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {agendamento.descricao || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAgendamentos.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Nenhum agendamento encontrado para este período</p>
              <p className="text-gray-400 text-sm mt-2">Selecione um período diferente para visualizar dados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}