import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  AlertTriangle,
  User,
  Mail,
  Phone
} from 'lucide-react';

const Leitores = ({ apiBaseUrl }) => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [currentReaderId, setCurrentReaderId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchReaders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/leitores`);
      if (!res.ok) throw new Error('Não foi possível carregar os leitores.');
      const data = await res.json();
      setReaders(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar leitores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, [apiBaseUrl]);

  const handleOpenAddModal = () => {
    setFormData({ nome: '', email: '', telefone: '' });
    setFormError(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reader) => {
    setFormData({
      nome: reader.nome,
      email: reader.email,
      telefone: reader.telefone || ''
    });
    setFormError(null);
    setCurrentReaderId(reader.id);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nome: '', email: '', telefone: '' });
    setFormError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      setFormError('Nome e E-mail são obrigatórios.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      let url = `${apiBaseUrl}/leitores`;
      let method = 'POST';

      if (modalMode === 'edit') {
        url = `${apiBaseUrl}/leitores/${currentReaderId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Erro ao salvar leitor.');
      }

      handleCloseModal();
      fetchReaders();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteReader = async (readerId) => {
    if (!window.confirm('Deseja realmente remover este leitor do arquivo permanente?')) return;

    try {
      const res = await fetch(`${apiBaseUrl}/leitores/${readerId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao remover leitor.');
      }

      fetchReaders();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter readers
  const filteredReaders = readers.filter(reader => 
    reader.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reader.telefone && reader.telefone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 page-enter page-enter-active">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-victorian dark:text-gold-light">Fichário de Leitores</h1>
          <p className="font-serif italic text-coffee-muted dark:text-stone-400">
            Gerenciamento de membros, leitores matriculados e pesquisadores.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-semibold rounded-md shadow-md transition-colors duration-200 border border-gold-old hover:border-gold-hover self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Matricular Leitor</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-4 shadow-book">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar leitor por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-700 bg-white dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
          />
        </div>
      </div>

      {/* Table Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-gold-old border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredReaders.length === 0 ? (
        <div className="bg-parchment-light dark:bg-tobacco-light border border-dashed border-stone-300 dark:border-stone-850 rounded-lg p-12 text-center shadow-book">
          <User className="w-12 h-12 text-stone-400 mx-auto opacity-50 mb-3" />
          <p className="font-serif italic text-coffee-muted dark:text-stone-400">
            Nenhum leitor cadastrado corresponde aos critérios de pesquisa.
          </p>
        </div>
      ) : (
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg shadow-book overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-emerald-victorian text-gold-old text-xs uppercase tracking-wider font-sans border-b border-vintage-gold">
                  <th className="py-4 px-6">Nome do Leitor</th>
                  <th className="py-4 px-6">E-mail</th>
                  <th className="py-4 px-6">Telefone</th>
                  <th className="py-4 px-6">Data de Matrícula</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-850 text-sm">
                {filteredReaders.map((reader) => (
                  <tr key={reader.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                    <td className="py-4 px-6 font-serif font-bold text-coffee dark:text-parchment-dark flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gold-old/10 text-gold-old flex items-center justify-center border border-gold-old/20">
                        <User className="w-4 h-4" />
                      </div>
                      <span>{reader.nome}</span>
                    </td>
                    <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-gold-old/60" />
                        <span>{reader.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                      {reader.telefone ? (
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-gold-old/60" />
                          <span>{reader.telefone}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic font-serif">Não fornecido</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-stone-550">
                      {new Date(reader.data_cadastro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleOpenEditModal(reader)}
                          className="p-1.5 text-emerald-victorian dark:text-gold-old hover:bg-stone-100 dark:hover:bg-stone-850 rounded"
                          title="Editar Ficha"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReader(reader.id)}
                          className="p-1.5 text-red-650 hover:bg-stone-100 dark:hover:bg-stone-850 rounded"
                          title="Remover Registro"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-parchment dark:bg-tobacco border-2 border-[#C5A059] double-border-gold rounded-lg shadow-book-lg w-full max-w-md overflow-hidden relative page-enter page-enter-active">
            {/* Header */}
            <div className="bg-emerald-victorian text-gold-old p-4 border-b-2 border-vintage-gold flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif uppercase tracking-wide">
                {modalMode === 'add' ? 'Matricular Leitor' : 'Editar Ficha Cadastral'}
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

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Nome Completo *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Arthur Pendragon"
                  required
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Endereço de E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ex: arthur@camelot.com"
                  required
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Contato Telefônico</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Ex: (11) 99999-8888"
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                />
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
                  disabled={formSubmitting}
                  className="flex items-center justify-center space-x-1.5 px-5 py-2 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-semibold text-sm rounded shadow transition-colors"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-emerald-victorian border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Check className="w-4.5 h-4.5" />
                  )}
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leitores;
