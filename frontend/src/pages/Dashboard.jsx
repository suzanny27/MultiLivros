import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const Dashboard = ({ apiBaseUrl }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/dashboard`);
      if (!res.ok) throw new Error('Não foi possível obter os dados do dashboard.');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-gold-old border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-serif italic text-coffee-muted dark:text-parchment-dark/70">Abrindo os arquivos da biblioteca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto my-12 bg-red-900/10 border border-red-500/30 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
        <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
        <button 
          onClick={fetchDashboardData} 
          className="mt-4 px-4 py-2 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-medium rounded transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const { metrics, weeklyFlow, recentActivity } = data;

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 page-enter page-enter-active">
      {/* Welcome Title */}
      <div>
        <h1 className="text-3xl md:text-4xl text-emerald-victorian dark:text-gold-light font-bold mb-2">
          Gabinete de Leituras
        </h1>
        <p className="font-serif italic text-coffee-muted dark:text-parchment-dark/70">
          Bem-vindo ao painel administrativo da biblioteca MultiLivros. Aqui residem as estatísticas literárias em tempo real.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-5 shadow-book relative overflow-hidden group hover:border-[#C5A059] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <BookOpen className="w-24 h-24 text-coffee dark:text-parchment" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-victorian text-gold-old rounded">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-coffee-light dark:text-stone-400">Total de Livros</p>
              <h3 className="text-2xl font-bold text-coffee dark:text-parchment mt-1 font-sans">{metrics.totalLivros}</h3>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-5 shadow-book relative overflow-hidden group hover:border-[#C5A059] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24 text-coffee dark:text-parchment" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-victorian text-gold-old rounded">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-coffee-light dark:text-stone-400">Leitores Cadastrados</p>
              <h3 className="text-2xl font-bold text-coffee dark:text-parchment mt-1 font-sans">{metrics.totalLeitores}</h3>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-5 shadow-book relative overflow-hidden group hover:border-[#C5A059] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Clock className="w-24 h-24 text-coffee dark:text-parchment" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-victorian text-gold-old rounded">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-coffee-light dark:text-stone-400">Empréstimos Ativos</p>
              <h3 className="text-2xl font-bold text-coffee dark:text-parchment mt-1 font-sans">{metrics.emprestimosAtivos}</h3>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`bg-parchment-light dark:bg-tobacco-light border rounded-lg p-5 shadow-book relative overflow-hidden group transition-all duration-300 ${metrics.alertasAtraso > 0 ? 'border-red-500/40 hover:border-red-500 animate-pulse-slow shadow-[0_0_15px_rgba(185,28,28,0.05)]' : 'border-stone-200 dark:border-stone-800 hover:border-[#C5A059]'}`}>
          {metrics.alertasAtraso > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 dark:bg-red-500 rounded-full animate-ping"></div>
          )}
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-24 h-24 text-coffee dark:text-parchment" />
          </div>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded ${metrics.alertasAtraso > 0 ? 'bg-red-900/80 text-red-200' : 'bg-emerald-victorian text-gold-old'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-coffee-light dark:text-stone-400">Alertas de Atraso</p>
              <h3 className={`text-2xl font-bold mt-1 font-sans ${metrics.alertasAtraso > 0 ? 'text-red-600 dark:text-red-400' : 'text-coffee dark:text-parchment'}`}>
                {metrics.alertasAtraso}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Flow Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Flow Chart */}
        <div className="lg:col-span-2 bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-6 shadow-book flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-xl font-bold text-emerald-victorian dark:text-gold-light">Fluxo Semanal de Leitores</h2>
            </div>
            <span className="text-xs font-serif italic text-coffee-muted dark:text-stone-400">Últimos 7 dias</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeitores" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F2A1D" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F2A1D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(197, 160, 89, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-stone-500 text-xs font-sans" 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-stone-500 text-xs font-sans" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg, #F9F6F0)', 
                    borderColor: '#C5A059',
                    color: '#2C1B10',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '6px'
                  }}
                  className="dark:!bg-tobacco dark:!text-parchment-dark"
                />
                <Area 
                  type="monotone" 
                  dataKey="leitores" 
                  stroke="#C5A059" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorLeitores)" 
                  name="Leitores"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-dashed border-stone-200 dark:border-stone-800 pt-4 mt-4 text-xs flex justify-between text-coffee-muted dark:text-stone-400 font-serif italic">
            <span>* Métrica unificada de acessos, empréstimos e devoluções.</span>
            <span>Estabilidade de Acessos: Estável</span>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-6 shadow-book flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <Bookmark className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-xl font-bold text-emerald-victorian dark:text-gold-light font-serif">Registros Recentes</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {recentActivity.length === 0 ? (
              <p className="text-center font-serif italic text-coffee-muted dark:text-stone-400 py-12">
                Nenhuma atividade recente registrada nos arquivos.
              </p>
            ) : (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="border-b border-stone-200/50 dark:border-stone-800/50 pb-3 last:border-0 last:pb-0 flex items-start space-x-3"
                >
                  <div className={`mt-1 p-1.5 rounded-full ${
                    activity.status === 'devolvido' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : activity.status === 'atrasado'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'bg-gold-old/10 text-gold-old'
                  }`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-coffee-muted dark:text-stone-400 font-serif italic flex justify-between">
                      <span>{formatDate(activity.data_emprestimo)}</span>
                      <span className={`font-semibold capitalize ${
                        activity.status === 'devolvido' 
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : activity.status === 'atrasado'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gold-old'
                      }`}>{activity.status}</span>
                    </p>
                    <p className="text-sm font-medium text-coffee dark:text-parchment-dark truncate mt-0.5">
                      {activity.leitor_nome}
                    </p>
                    <p className="text-xs text-coffee-light dark:text-stone-400 truncate font-serif">
                      retirou <span className="italic font-semibold">{activity.titulo}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
