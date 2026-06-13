import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'multilivros.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite MultiLivros.');
  }
});

// Helper functions for Promises
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize Tables
export const initDb = async () => {
  // 1. Livros
  await dbRun(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      isbn TEXT UNIQUE,
      editora TEXT,
      ano INTEGER,
      genero TEXT,
      status TEXT DEFAULT 'disponivel',
      capa_url TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Leitores
  await dbRun(`
    CREATE TABLE IF NOT EXISTS leitores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      telefone TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Emprestimos
  await dbRun(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      livro_id INTEGER NOT NULL,
      leitor_id INTEGER NOT NULL,
      data_emprestimo DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_devolucao_prevista DATETIME NOT NULL,
      data_devolucao_real DATETIME,
      status TEXT DEFAULT 'ativo',
      FOREIGN KEY(livro_id) REFERENCES livros(id) ON DELETE CASCADE,
      FOREIGN KEY(leitor_id) REFERENCES leitores(id) ON DELETE CASCADE
    )
  `);

  // Seed Data if empty
  const booksCount = await dbGet('SELECT COUNT(*) as count FROM livros');
  if (booksCount.count === 0) {
    console.log('Semeando dados iniciais no banco de dados...');
    
    // Seed Books
    const books = [
      ['O Retrato de Dorian Gray', 'Oscar Wilde', '9788594541413', 'DarkSide Books', 1890, 'Clássicos Gothic', 'disponivel', null],
      ['Frankenstein', 'Mary Shelley', '9788594540447', 'DarkSide Books', 1818, 'Ficção Científica/Gothic', 'emprestado', null],
      ['Drácula', 'Bram Stoker', '9788594540829', 'DarkSide Books', 1897, 'Terror/Gothic', 'disponivel', null],
      ['A Divina Comédia', 'Dante Alighieri', '9788525410191', 'L&PM Editores', 1320, 'Poesia Clássica', 'disponivel', null],
      ['Estudo em Vermelho', 'Arthur Conan Doyle', '9788537809631', 'Zahar', 1887, 'Mistério/Policial', 'emprestado', null],
      ['O Corvo e Outros Poemas', 'Edgar Allan Poe', '9788568014523', 'Tordesilhas', 1845, 'Poesia/Gothic', 'emprestado', null],
    ];

    for (const book of books) {
      await dbRun(
        'INSERT INTO livros (titulo, autor, isbn, editora, ano, genero, status, capa_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        book
      );
    }

    // Seed Readers
    const readers = [
      ['Arthur Pendragon', 'arthur.king@camelot.com', '(11) 99999-8888'],
      ['Victor Frankenstein', 'victor@geneva.edu', '(11) 98888-7777'],
      ['Mina Harker', 'mina.harker@london.co.uk', '(11) 97777-6666'],
      ['Edgar Allan Poe', 'edgar.allan@poe.org', '(11) 96666-5555'],
    ];

    for (const reader of readers) {
      await dbRun(
        'INSERT INTO leitores (nome, email, telefone) VALUES (?, ?, ?)',
        reader
      );
    }

    // Seed Loans
    const today = new Date();
    
    // Overdue loan (Victor Frankenstein borrowed Frankenstein)
    const dateLoan1 = new Date();
    dateLoan1.setDate(today.getDate() - 10);
    const dateDue1 = new Date();
    dateDue1.setDate(today.getDate() - 3);

    // Active loan within due date (Mina Harker borrowed Estudo em Vermelho)
    const dateLoan2 = new Date();
    dateLoan2.setDate(today.getDate() - 4);
    const dateDue2 = new Date();
    dateDue2.setDate(today.getDate() + 3);

    // Overdue loan (Edgar Allan Poe borrowed O Corvo)
    const dateLoan3 = new Date();
    dateLoan3.setDate(today.getDate() - 15);
    const dateDue3 = new Date();
    dateDue3.setDate(today.getDate() - 5);

    await dbRun(
      'INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)',
      [2, 2, dateLoan1.toISOString(), dateDue1.toISOString(), 'atrasado']
    );

    await dbRun(
      'INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)',
      [5, 3, dateLoan2.toISOString(), dateDue2.toISOString(), 'ativo']
    );

    await dbRun(
      'INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)',
      [6, 4, dateLoan3.toISOString(), dateDue3.toISOString(), 'atrasado']
    );
    
    console.log('Semeadura de banco de dados concluída!');
  }
};

export default db;
