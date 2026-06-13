import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Check, 
  AlertTriangle,
  BookOpen,
  Calendar,
  RotateCcw,
  CheckCircle,
  FileText
} from 'lucide-react';

const Emprestimos = ({ apiBaseUrl }) => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'ativo' | 'devolvido' | 'atrasado'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    livro_id: '',
    leitor_id: '',
    data_devolucao_prevista: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchLoans = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/emprestimos`);
      if (!res.ok) throw new Error('Não foi possível obter empréstimos.');
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar registros de empréstimos.');
    }
  };

  const fetchBooksAndReaders = async () => {
    try {
      const [resBooks, resReaders] = await Promise.all([
        fetch(`${apiBaseUrl}/livros`),
        fetch(`${apiBaseUrl}/leitores`)
      ]);
      if (!resBooks.ok || !resReaders.ok) throw new Error();
      
      const booksData = await resBooks.json();
      const readersData = await resReaders.json();
      
      // Filter books to only show available books for checkout
      setBooks(booksData.filter(b => b.status === 'disponivel'));
      setReaders(readersData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchLoans(), fetchBooksAndReaders()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [apiBaseUrl]);

  const handleOpenModal = () => {
    // Set default due date: 7 days from today
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateString = nextWeek.toISOString().split('T')[0];

    setFormData({
      livro_id: '',
      leitor_id: '',
      data_devolucao_prevista: dateString
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { livro_id, leitor_id, data_devolucao_prevista } = formData;
    
    if (!livro_id || !leitor_id || !data_devolucao_prevista) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/emprestimos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          livro_id: parseInt(livro_id),
          leitor_id: parseInt(leitor_id),
          data_devolucao_prevista
        })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Erro ao registrar empréstimo.');
      }

      handleCloseModal();
      loadAllData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    if (!window.confirm('Registrar a devolução desta obra física nos arquivos?')) return;

    try {
      const res = await fetch(`${apiBaseUrl}/emprestimos/${loanId}/devolver`, {
        method: 'POST'
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Erro ao devolver livro.');
      }

      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.leitor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.autor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      loan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 page-enter page-enter-active">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-victorian dark:text-gold-light">Registro de Empréstimos</h1>
          <p className="font-serif italic text-coffee-muted dark:text-stone-400">
            Controle de retiradas, prazos e devoluções da biblioteca.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-semibold rounded-md shadow-md transition-colors duration-200 border border-gold-old hover:border-gold-hover self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Registrar Retirada</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-4 shadow-book flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por livro, leitor ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-700 bg-white dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs text-coffee-muted dark:text-stone-400 font-serif">Situação:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-tobacco-dark text-xs text-coffee dark:text-parchment-dark rounded focus:outline-none focus:border-gold-old font-sans"
          >
            <option value="all">Todos os Prazos</option>
            <option value="ativo">Ativos (No Prazo)</option>
            <option value="atrasado">Atrasados (Overdue)</option>
            <option value="devolvido">Devolvidos</option>
          </select>
        </div>
      </div>

      {/* Display List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-gold-old border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="bg-parchment-light dark:bg-tobacco-light border border-dashed border-stone-300 dark:border-stone-850 rounded-lg p-12 text-center shadow-book">
          <Calendar className="w-12 h-12 text-stone-400 mx-auto opacity-50 mb-3" />
          <p className="font-serif italic text-coffee-muted dark:text-stone-400">
            Nenhum empréstimo correspondente encontrado nos arquivos de registro.
          </p>
        </div>
      ) : (
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg shadow-book overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-emerald-victorian text-gold-old text-xs uppercase tracking-wider font-sans border-b border-vintage-gold">
                  <th className="py-4 px-6">Obra Retirada</th>
                  <th className="py-4 px-6">Leitor / Mutuário</th>
                  <th className="py-4 px-6">Data de Retirada</th>
                  <th className="py-4 px-6">Devolução Prevista</th>
                  <th className="py-4 px-6">Data de Devolução</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-850 text-sm">
                {filteredLoans.map((loan) => {
                  const isOverdue = loan.status === 'atrasado';
                  return (
                    <tr key={loan.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-serif font-bold text-coffee dark:text-parchment-dark">
                          {loan.titulo}
                        </div>
                        <div className="text-xs text-coffee-muted dark:text-stone-400 font-serif italic">
                          {loan.autor}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-coffee dark:text-parchment-dark">{loan.leitor_nome}</div>
                        <div className="text-xs text-stone-500">{loan.leitor_email}</div>
                      </td>
                      <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                        {formatDate(loan.data_emprestimo)}
                      </td>
                      <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                        {formatDate(loan.data_devolucao_prevista)}
                      </td>
                      <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                        {loan.data_devolucao_real ? (
                          formatDate(loan.data_devolucao_real)
                        ) : (
                          <span className="text-stone-400 italic font-serif">Pendente</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          loan.status === 'devolvido'
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : isOverdue
                            ? 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-350 font-bold border border-red-500/20'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                        }`}>
                          {loan.status === 'devolvido' ? 'Devolvido' : isOverdue ? 'Em Atraso' : 'Ativo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {loan.status !== 'devolvido' ? (
                          <button
                            onClick={() => handleReturnBook(loan.id)}
                            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-emerald-victorian hover:bg-emerald-hover text-gold-old text-xs font-semibold rounded shadow transition-colors ml-auto"
                            title="Registrar devolução"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Devolver</span>
                          </button>
                        ) : (
                          <div className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end space-x-1">
                            <CheckCircle className="w-4.5 h-4.5" />
                            <span className="text-xs font-serif italic">Arquivado</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-parchment dark:bg-tobacco border-2 border-[#C5A059] double-border-gold rounded-lg shadow-book-lg w-full max-w-md overflow-hidden relative page-enter page-enter-active">
            {/* Header */}
            <div className="bg-emerald-victorian text-gold-old p-4 border-b-2 border-vintage-gold flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif uppercase tracking-wide">
                Registrar Retirada de Livro
              </h3>
              <button onClick={handleCloseModal} className="text-gold-old hover:text-gold-light">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-900/10 border border-red-500/30 rounded text-red-700 dark:text-red-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Select Book */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif flex justify-between">
                  <span>Obra a ser Emprestada *</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-450 italic normal-case font-sans">(Apenas obras disponíveis)</span>
                </label>
                <select
                  name="livro_id"
                  value={formData.livro_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old font-sans"
                >
                  <option value="">-- Selecione uma Obra Disponível --</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.titulo} ({book.autor})
                    </option>
                  ))}
                </select>
                {books.length === 0 && (
                  <p className="text-[10px] text-amber-700 dark:text-amber-500 italic mt-1 font-serif">
                    * Não há livros disponíveis para empréstimo no acervo no momento.
                  </p>
                )}
              </div>

              {/* Select Reader */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Leitor / Mutuário *</label>
                <select
                  name="leitor_id"
                  value={formData.leitor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old font-sans"
                >
                  <option value="">-- Selecione o Leitor --</option>
                  {readers.map(reader => (
                    <option key={reader.id} value={reader.id}>
                      {reader.nome} ({reader.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Data Limite para Devolução *</label>
                <input
                  type="date"
                  name="data_devolucao_prevista"
                  value={formData.data_devolucao_prevista}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old font-sans"
                />
              </div>

              {/* Warning box */}
              <div className="p-3 bg-amber-900/5 dark:bg-amber-950/20 border border-amber-500/20 rounded text-[11px] text-amber-800 dark:text-amber-400 flex items-start space-x-1.5 font-serif italic">
                <BookOpen className="w-4 h-4 text-gold-old flex-shrink-0 mt-0.5" />
                <span>
                  O empréstimo altera a ficha do livro para 'Emprestado' e bloqueia retiradas simultâneas.
                </span>
              </div>

              {/* Buttons */}
              <div className="border-t border-stone-200 dark:border-stone-800 pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-850 border border-stone-300 dark:border-stone-700 text-coffee dark:text-parchment-dark text-sm rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || books.length === 0}
                  className="flex items-center justify-center space-x-1.5 px-5 py-2 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-semibold text-sm rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-emerald-victorian border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Check className="w-4.5 h-4.5" />
                  )}
                  <span>Registrar Empréstimo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emprestimos;
