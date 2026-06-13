import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Grid, 
  List, 
  X, 
  Upload, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import BookCover from '../components/BookCover';

const Livros = ({ apiBaseUrl }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'disponivel' | 'emprestado'

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [currentBookId, setCurrentBookId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    editora: '',
    ano: '',
    genero: '',
    capaFile: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/livros`);
      if (!res.ok) throw new Error('Não foi possível carregar os livros.');
      const data = await res.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar o catálogo de livros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [apiBaseUrl]);

  const handleOpenAddModal = () => {
    setFormData({
      titulo: '',
      autor: '',
      isbn: '',
      editora: '',
      ano: '',
      genero: '',
      capaFile: null
    });
    setPreviewUrl(null);
    setFormError(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setFormData({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn || '',
      editora: book.editora || '',
      ano: book.ano || '',
      genero: book.genero || '',
      capaFile: null
    });
    setPreviewUrl(book.capa_url ? `http://localhost:5000${book.capa_url}` : null);
    setFormError(null);
    setCurrentBookId(book.id);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      titulo: '',
      autor: '',
      isbn: '',
      editora: '',
      ano: '',
      genero: '',
      capaFile: null
    });
    setPreviewUrl(null);
    setFormError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, capaFile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.autor) {
      setFormError('Título e Autor são obrigatórios.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    // Prepare multipart form data
    const dataToSend = new FormData();
    dataToSend.append('titulo', formData.titulo);
    dataToSend.append('autor', formData.autor);
    dataToSend.append('isbn', formData.isbn);
    dataToSend.append('editora', formData.editora);
    dataToSend.append('ano', formData.ano);
    dataToSend.append('genero', formData.genero);
    if (formData.capaFile) {
      dataToSend.append('capa', formData.capaFile);
    }

    try {
      let url = `${apiBaseUrl}/livros`;
      let method = 'POST';

      if (modalMode === 'edit') {
        url = `${apiBaseUrl}/livros/${currentBookId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        body: dataToSend // Let fetch set content-type for multipart
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Erro ao salvar livro.');
      }

      handleCloseModal();
      fetchBooks();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta obra de seus arquivos?')) return;
    
    try {
      const res = await fetch(`${apiBaseUrl}/livros/${bookId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir livro.');
      }
      
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      book.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 page-enter page-enter-active">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-victorian dark:text-gold-light">Catálogo de Obras</h1>
          <p className="font-serif italic text-coffee-muted dark:text-stone-400">
            Gerencie o acervo literário: obras clássicas, encadernações e romances.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-semibold rounded-md shadow-md transition-colors duration-200 border border-gold-old hover:border-gold-hover self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Catalogar Obra</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-4 shadow-book flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-700 bg-white dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-coffee-muted dark:text-stone-400 font-serif">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-tobacco-dark text-xs text-coffee dark:text-parchment-dark rounded focus:outline-none focus:border-gold-old font-sans"
            >
              <option value="all">Todos</option>
              <option value="disponivel">Disponível</option>
              <option value="emprestado">Emprestado</option>
            </select>
          </div>

          {/* Toggle view mode */}
          <div className="flex border border-stone-300 dark:border-stone-700 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-emerald-victorian text-gold-old' : 'bg-white dark:bg-tobacco-dark text-stone-400 hover:text-coffee dark:hover:text-parchment-dark'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 ${viewMode === 'table' ? 'bg-emerald-victorian text-gold-old' : 'bg-white dark:bg-tobacco-dark text-stone-400 hover:text-coffee dark:hover:text-parchment-dark'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List / Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-gold-old border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-parchment-light dark:bg-tobacco-light border border-dashed border-stone-300 dark:border-stone-850 rounded-lg p-12 text-center shadow-book">
          <BookCover titulo="VAZIO" autor="Biblioteca" size="sm" className="mx-auto opacity-45" />
          <p className="mt-4 font-serif italic text-coffee-muted dark:text-stone-400">
            Nenhuma obra encontrada para esta busca nos arquivos.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg p-3 shadow-book flex flex-col justify-between group hover:border-[#C5A059] transition-all duration-300 relative"
            >
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <button
                  onClick={() => handleOpenEditModal(book)}
                  className="p-1 bg-emerald-victorian/90 text-gold-old hover:bg-emerald-victorian rounded shadow"
                  title="Editar Obra"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className={`p-1 rounded shadow ${
                    book.status === 'emprestado' 
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                      : 'bg-red-900/90 text-red-200 hover:bg-red-800'
                  }`}
                  disabled={book.status === 'emprestado'}
                  title={book.status === 'emprestado' ? 'Livro emprestado não pode ser excluído' : 'Excluir Obra'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cover container */}
              <div className="flex justify-center mb-3">
                  {book.capa_url ? (
                    <img
                      src={`http://localhost:5000${book.capa_url}`}
                      alt={`Capa de ${book.titulo}`}
                      className="w-40 h-60 object-cover rounded-r shadow-book hover:shadow-book-lg transition-shadow duration-300 border-l border-black/30"
                    />
                  ) : (
                  <BookCover titulo={book.titulo} autor={book.autor} size="md" />
                )}
              </div>

              {/* Information */}
              <div className="text-center mt-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-coffee dark:text-parchment-dark line-clamp-2" title={book.titulo}>
                    {book.titulo}
                  </h4>
                  <p className="text-xs text-coffee-muted dark:text-stone-400 font-serif italic truncate mt-0.5">
                    {book.autor}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    book.status === 'disponivel' 
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  }`}>
                    {book.status === 'disponivel' ? 'Disponível' : 'Emprestado'}
                  </span>
                  {book.ano && <span className="text-[10px] font-serif text-coffee-light dark:text-stone-500">{book.ano}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-parchment-light dark:bg-tobacco-light border border-stone-200 dark:border-stone-800 rounded-lg shadow-book overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-emerald-victorian text-gold-old text-xs uppercase tracking-wider font-sans border-b border-vintage-gold">
                  <th className="py-3 px-4">Capa</th>
                  <th className="py-3 px-4">Título</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Gênero</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-850 text-sm">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                    <td className="py-2 px-4">
                      {book.capa_url ? (
                        <img
                          src={`http://localhost:5000${book.capa_url}`}
                          alt={`Capa de ${book.titulo}`}
                          className="w-10 h-14 object-cover rounded shadow border border-black/20"
                        />
                      ) : (
                        <BookCover titulo={book.titulo} autor={book.autor} size="sm" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-coffee dark:text-parchment-dark">
                      {book.titulo}
                    </td>
                    <td className="py-3 px-4 font-serif italic text-coffee-muted dark:text-stone-400">
                      {book.autor}
                    </td>
                    <td className="py-3 px-4 text-xs font-sans text-stone-500">{book.isbn || '-'}</td>
                    <td className="py-3 px-4 text-xs text-stone-500">{book.genero || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        book.status === 'disponivel' 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                      }`}>
                        {book.status === 'disponivel' ? 'Disponível' : 'Emprestado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(book)}
                          className="p-1.5 text-emerald-victorian dark:text-gold-old hover:bg-stone-100 dark:hover:bg-stone-850 rounded"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className={`p-1.5 rounded ${
                            book.status === 'emprestado' 
                              ? 'text-stone-400 cursor-not-allowed' 
                              : 'text-red-600 hover:bg-stone-100 dark:hover:bg-stone-850'
                          }`}
                          disabled={book.status === 'emprestado'}
                          title={book.status === 'emprestado' ? 'Livro emprestado não pode ser excluído' : 'Excluir'}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Slide-Over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-parchment dark:bg-tobacco border-2 border-[#C5A059] double-border-gold rounded-lg shadow-book-lg w-full max-w-lg overflow-hidden relative page-enter page-enter-active">
            {/* Header */}
            <div className="bg-emerald-victorian text-gold-old p-4 border-b-2 border-vintage-gold flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif uppercase tracking-wide">
                {modalMode === 'add' ? 'Catalogar Nova Obra' : 'Atualizar Obra'}
              </h3>
              <button onClick={handleCloseModal} className="text-gold-old hover:text-gold-light">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-900/10 border border-red-500/30 rounded text-red-700 dark:text-red-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Título da Obra *</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: O Retrato de Dorian Gray"
                    required
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Autor *</label>
                  <input
                    type="text"
                    name="autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    placeholder="Ex: Oscar Wilde"
                    required
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Gênero / Categoria</label>
                  <input
                    type="text"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    placeholder="Ex: Romance Gothic"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* ISBN */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    placeholder="Ex: 9788594541413"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* Editora */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Editora</label>
                  <input
                    type="text"
                    name="editora"
                    value={formData.editora}
                    onChange={handleInputChange}
                    placeholder="Ex: DarkSide Books"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* Ano */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Ano de Publicação</label>
                  <input
                    type="number"
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    placeholder="Ex: 1890"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark rounded text-sm text-coffee dark:text-parchment-dark focus:outline-none focus:border-gold-old"
                  />
                </div>

                {/* Capa Upload */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-coffee-muted dark:text-stone-400 font-serif">Foto da Capa</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center justify-center px-4 py-2 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-tobacco-dark hover:bg-stone-100 dark:hover:bg-stone-850 rounded cursor-pointer text-xs font-semibold text-coffee dark:text-stone-300 transition-colors w-full">
                      <Upload className="w-4 h-4 mr-2 text-gold-old" />
                      <span>Fazer Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Preview */}
              {previewUrl && (
                <div className="border border-stone-300 dark:border-stone-800 rounded p-2 flex items-center space-x-4">
                  <img src={previewUrl} alt="Preview da capa" className="w-12 h-18 object-cover rounded shadow" />
                  <div className="text-xs">
                    <p className="font-semibold text-coffee dark:text-parchment-dark">Arquivo Carregado</p>
                    <p className="text-stone-450 dark:text-stone-500">Imagem pronta para salvar</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setFormData(prev => ({ ...prev, capaFile: null })); setPreviewUrl(null); }} 
                    className="ml-auto p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

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

export default Livros;
