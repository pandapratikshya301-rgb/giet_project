import React, { useState, useMemo } from 'react';

// ==========================================
// MOCK INITIAL DATA
// ==========================================
const INITIAL_BOOKS = [
  { id: 'b1', title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', genre: 'Programming', isbn: '978-1593279509', year: 2018, quantity: 5, available: 4, rating: 4.8, gradient: 'from-amber-500 to-orange-600' },
  { id: 'b2', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', isbn: '978-0132350884', year: 2008, quantity: 3, available: 2, rating: 4.7, gradient: 'from-blue-500 to-cyan-600' },
  { id: 'b3', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441172719', year: 1965, quantity: 8, available: 8, rating: 4.9, gradient: 'from-violet-500 to-purple-600' },
  { id: 'b4', title: 'The Pragmatic Programmer', author: 'Andy Hunt', genre: 'Programming', isbn: '978-0135957059', year: 2019, quantity: 4, available: 3, rating: 4.9, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'b5', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', isbn: '978-0446310789', year: 1960, quantity: 6, available: 5, rating: 4.8, gradient: 'from-pink-500 to-rose-600' },
  { id: 'b6', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', isbn: '978-0345339683', year: 1937, quantity: 7, available: 7, rating: 4.9, gradient: 'from-red-500 to-pink-600' },
];

const INITIAL_MEMBERS = [
  { id: 'm1', name: 'Alex Rivera', email: 'alex@giet.edu', type: 'Student', borrowLimit: 3, borrowedCount: 1, joinedDate: '2025-09-12' },
  { id: 'm2', name: 'Dr. Sarah Chen', email: 'sarah.chen@giet.edu', type: 'Faculty', borrowLimit: 7, borrowedCount: 2, joinedDate: '2024-03-20' },
  { id: 'm3', name: 'Michael Kross', email: 'michael.k@giet.edu', type: 'Student', borrowLimit: 3, borrowedCount: 0, joinedDate: '2025-10-01' },
  { id: 'm4', name: 'Sophia Patel', email: 'sophia.p@giet.edu', type: 'Premium Member', borrowLimit: 5, borrowedCount: 1, joinedDate: '2025-01-15' },
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', bookId: 'b1', bookTitle: 'Eloquent JavaScript', memberId: 'm1', memberName: 'Alex Rivera', issueDate: '2026-08-01', dueDate: '2026-08-15', returnDate: null, status: 'Issued', fine: 0 },
  { id: 't2', bookId: 'b2', bookTitle: 'Clean Code', memberId: 'm2', memberName: 'Dr. Sarah Chen', issueDate: '2026-07-20', dueDate: '2026-08-03', returnDate: null, status: 'Overdue', fine: 5 },
  { id: 't3', bookId: 'b4', bookTitle: 'The Pragmatic Programmer', memberId: 'm2', memberName: 'Dr. Sarah Chen', issueDate: '2026-08-05', dueDate: '2026-08-19', returnDate: null, status: 'Issued', fine: 0 },
  { id: 't4', bookId: 'b5', bookTitle: 'To Kill a Mockingbird', memberId: 'm4', memberName: 'Sophia Patel', issueDate: '2026-07-10', dueDate: '2026-07-24', returnDate: '2026-07-22', status: 'Returned', fine: 0 },
];

const GENRES = ['Programming', 'Software Engineering', 'Sci-Fi', 'Fiction', 'Fantasy', 'Biography', 'Mystery'];

export default function Library() {
  // State variables
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | books | members | transactions

  // Search & Filter States
  const [bookSearch, setBookSearch] = useState('');
  const [bookGenreFilter, setBookGenreFilter] = useState('All');
  const [bookSortBy, setBookSortBy] = useState('title'); // title | year | available | rating

  const [memberSearch, setMemberSearch] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('All');

  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('All'); // All | Issued | Overdue | Returned

  // Form Modals States
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null for new, book object for edit
  const [bookForm, setBookForm] = useState({ title: '', author: '', genre: 'Programming', isbn: '', year: 2026, quantity: 1 });

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // null for new, member object for edit
  const [memberForm, setMemberForm] = useState({ name: '', email: '', type: 'Student' });

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({ memberId: '', bookId: '' });

  // Notifications state (toast list)
  const [notifications, setNotifications] = useState([]);

  // Trigger brief feedback notification toast
  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Helper date parsing (fixed current date for simulation: 2026-08-08)
  const CURRENT_DATE_STR = '2026-08-08';
  const getDaysDifference = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Dynamic calculations for Dashboard
  const dashboardStats = useMemo(() => {
    const totalTitles = books.length;
    const totalCopies = books.reduce((sum, b) => sum + Number(b.quantity), 0);
    const issuedBooks = transactions.filter(t => t.status === 'Issued' || t.status === 'Overdue').length;
    const overdueBooks = transactions.filter(t => {
      if (t.status === 'Overdue') return true;
      if (t.status === 'Issued') {
        const diff = getDaysDifference(t.dueDate, CURRENT_DATE_STR);
        return diff > 0; // if current date is past due date
      }
      return false;
    }).length;
    const activeMembersCount = members.length;
    
    // Total Fines (accumulated $5 from mock + returning overdue calculations)
    const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);

    return { totalTitles, totalCopies, issuedBooks, overdueBooks, activeMembersCount, totalFines };
  }, [books, transactions, members]);

  // Compute genre counts for SVG chart
  const genreChartData = useMemo(() => {
    const counts = {};
    books.forEach(b => {
      counts[b.genre] = (counts[b.genre] || 0) + Number(b.quantity);
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }, [books]);

  // ==========================================
  // BOOK CRUD & FILTERS
  // ==========================================
  const filteredBooks = useMemo(() => {
    return books
      .filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
          b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
          b.isbn.includes(bookSearch);
        const matchesGenre = bookGenreFilter === 'All' || b.genre === bookGenreFilter;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (bookSortBy === 'title') return a.title.localeCompare(b.title);
        if (bookSortBy === 'year') return b.year - a.year;
        if (bookSortBy === 'available') return b.available - a.available;
        if (bookSortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [books, bookSearch, bookGenreFilter, bookSortBy]);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author || !bookForm.isbn) {
      notify('Please fill out all required fields.', 'error');
      return;
    }

    if (editingBook) {
      // Edit Book
      // Calculate delta of quantity change to update available count
      const qtyDiff = Number(bookForm.quantity) - Number(editingBook.quantity);
      const updatedAvailable = Math.max(0, Number(editingBook.available) + qtyDiff);

      setBooks(prev => prev.map(b => b.id === editingBook.id ? {
        ...b,
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
        isbn: bookForm.isbn,
        year: Number(bookForm.year),
        quantity: Number(bookForm.quantity),
        available: updatedAvailable
      } : b));
      notify(`Updated "${bookForm.title}" successfully.`);
    } else {
      // Create Book
      const gradients = [
        'from-amber-500 to-orange-600',
        'from-blue-500 to-cyan-600',
        'from-violet-500 to-purple-600',
        'from-emerald-500 to-teal-600',
        'from-pink-500 to-rose-600',
        'from-red-500 to-pink-600'
      ];
      const newBook = {
        id: 'b' + (books.length + 1),
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
        isbn: bookForm.isbn,
        year: Number(bookForm.year),
        quantity: Number(bookForm.quantity),
        available: Number(bookForm.quantity),
        rating: 5.0,
        gradient: gradients[Math.floor(Math.random() * gradients.length)]
      };
      setBooks(prev => [...prev, newBook]);
      notify(`Added "${bookForm.title}" to library catalogue.`);
    }

    setBookModalOpen(false);
    setEditingBook(null);
    setBookForm({ title: '', author: '', genre: 'Programming', isbn: '', year: 2026, quantity: 1 });
  };

  const openEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      year: book.year,
      quantity: book.quantity
    });
    setBookModalOpen(true);
  };

  const deleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Check if any active transaction exists for this book
    const hasActiveTx = transactions.some(t => t.bookId === bookId && (t.status === 'Issued' || t.status === 'Overdue'));
    if (hasActiveTx) {
      notify(`Cannot delete "${book.title}" because copies are currently issued.`, 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${book.title}" from catalog?`)) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
      notify(`Removed "${book.title}" from database.`);
    }
  };


  // ==========================================
  // MEMBER CRUD & FILTERS
  // ==========================================
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesType = memberTypeFilter === 'All' || m.type === memberTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [members, memberSearch, memberTypeFilter]);

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.email) {
      notify('Please fill out all fields.', 'error');
      return;
    }

    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? {
        ...m,
        name: memberForm.name,
        email: memberForm.email,
        type: memberForm.type,
        borrowLimit: memberForm.type === 'Student' ? 3 : memberForm.type === 'Faculty' ? 7 : 5
      } : m));
      notify(`Updated member account for ${memberForm.name}.`);
    } else {
      const newMember = {
        id: 'm' + (members.length + 1),
        name: memberForm.name,
        email: memberForm.email,
        type: memberForm.type,
        borrowLimit: memberForm.type === 'Student' ? 3 : memberForm.type === 'Faculty' ? 7 : 5,
        borrowedCount: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setMembers(prev => [...prev, newMember]);
      notify(`Registered member "${memberForm.name}" successfully.`);
    }

    setMemberModalOpen(false);
    setEditingMember(null);
    setMemberForm({ name: '', email: '', type: 'Student' });
  };

  const openEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      type: member.type
    });
    setMemberModalOpen(true);
  };

  const deleteMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    if (member.borrowedCount > 0) {
      notify(`Cannot delete "${member.name}" because they have ${member.borrowedCount} unreturned books.`, 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete member "${member.name}"?`)) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      notify(`Deleted member account for ${member.name}.`);
    }
  };


  // ==========================================
  // TRANSACTION LOGS & BORROW / RETURN
  // ==========================================
  const filteredTxs = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.bookTitle.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.memberName.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.id.includes(txSearch);
      
      let matchesStatus = true;
      if (txStatusFilter !== 'All') {
        if (txStatusFilter === 'Overdue') {
          // calculate overdue live
          if (t.status === 'Overdue') matchesStatus = true;
          else if (t.status === 'Issued') {
            const overdueDays = getDaysDifference(t.dueDate, CURRENT_DATE_STR);
            matchesStatus = overdueDays > 0;
          } else {
            matchesStatus = false;
          }
        } else {
          matchesStatus = t.status === txStatusFilter;
        }
      }
      return matchesSearch && matchesStatus;
    });
  }, [transactions, txSearch, txStatusFilter]);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const { memberId, bookId } = issueForm;
    if (!memberId || !bookId) {
      notify('Please select a member and a book.', 'error');
      return;
    }

    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);

    if (!member || !book) {
      notify('Invalid member or book selected.', 'error');
      return;
    }

    // Verify borrowing limits
    if (member.borrowedCount >= member.borrowLimit) {
      notify(`Member has reached their limit of ${member.borrowLimit} borrowed books.`, 'error');
      return;
    }

    // Verify book stock
    if (book.available <= 0) {
      notify(`"${book.title}" is currently out of stock.`, 'error');
      return;
    }

    // Generate Dates
    const issueDateStr = CURRENT_DATE_STR; // standard simulation issue date
    const dueDate = new Date(issueDateStr);
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks limit
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Create Transaction
    const newTx = {
      id: 'tx' + (transactions.length + 100),
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      returnDate: null,
      status: 'Issued',
      fine: 0
    };

    // Update States
    setTransactions(prev => [newTx, ...prev]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b));
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, borrowedCount: m.borrowedCount + 1 } : m));

    setIssueModalOpen(false);
    setIssueForm({ memberId: '', bookId: '' });
    notify(`Issued "${book.title}" to ${member.name}.`);
  };

  const handleReturnBook = (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status === 'Returned') return;

    // Calculate fine dynamically: $1 per day overdue
    const overdueDays = getDaysDifference(tx.dueDate, CURRENT_DATE_STR);
    const fine = overdueDays > 0 ? overdueDays * 1 : 0;

    // Update Transaction
    setTransactions(prev => prev.map(t => t.id === txId ? {
      ...t,
      returnDate: CURRENT_DATE_STR,
      status: 'Returned',
      fine: fine
    } : t));

    // Update book inventory
    setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, available: Math.min(b.quantity, b.available + 1) } : b));

    // Update member count
    setMembers(prev => prev.map(m => m.id === tx.memberId ? { ...m, borrowedCount: Math.max(0, m.borrowedCount - 1) } : m));

    if (fine > 0) {
      notify(`Returned "${tx.bookTitle}". Overdue by ${overdueDays} days. Fine of $${fine} recorded.`, 'warning');
    } else {
      notify(`Returned "${tx.bookTitle}" on time. Thank you!`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0 py-6 min-h-screen text-zinc-850 dark:text-zinc-100 flex flex-col gap-6 relative">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-lg flex items-center justify-between border text-white transition-all duration-300 animate-slide-in ${
              n.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
              n.type === 'warning' ? 'bg-amber-600 border-amber-500' :
              'bg-rose-600 border-rose-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {n.type === 'success' ? '✓' : n.type === 'warning' ? '⚠' : '✗'}
              </span>
              <p className="text-sm font-medium">{n.message}</p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
              className="text-white hover:text-zinc-200 transition-colors ml-4 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase">GIET UNIVERSITY CATALOGUE</span>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Library Management Portal
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400 mt-1">
            Track book reserves, manage student registries, issue borrows and returns. Simulated Date: <span className="font-semibold">{CURRENT_DATE_STR}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setEditingBook(null); setBookForm({ title: '', author: '', genre: 'Programming', isbn: '', year: 2026, quantity: 1 }); setBookModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>+</span> Add Book
          </button>
          <button
            onClick={() => { setEditingMember(null); setMemberForm({ name: '', email: '', type: 'Student' }); setMemberModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-150 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer"
          >
            <span>+</span> Register Member
          </button>
          <button
            onClick={() => { setIssueForm({ memberId: '', bookId: '' }); setIssueModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-90 active:scale-[0.98] rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>⇄</span> Issue Book
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-zinc-250 dark:border-zinc-800 overflow-x-auto gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'books', label: 'Books Catalog', icon: '📚' },
          { id: 'members', label: 'Members', icon: '👥' },
          { id: 'transactions', label: 'Transactions', icon: '🔄' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB CONTENT: DASHBOARD
          ========================================== */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Statistics Grid */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Stat Card 1 */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Titles</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{dashboardStats.totalTitles}</span>
                <span className="text-zinc-400 text-xs font-semibold">titles</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Unique literary entries</p>
            </div>

            {/* Stat Card 2 */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Copies</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{dashboardStats.totalCopies}</span>
                <span className="text-zinc-400 text-xs font-semibold">books</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Physical shelf count</p>
            </div>

            {/* Stat Card 3 */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Books Issued</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{dashboardStats.issuedBooks}</span>
                <span className="text-zinc-400 text-xs font-semibold">issued</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Currently on loan</p>
            </div>

            {/* Stat Card 4 */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Overdue Books</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${dashboardStats.overdueBooks > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {dashboardStats.overdueBooks}
                </span>
                <span className="text-zinc-400 text-xs font-semibold">overdue</span>
              </div>
              <p className="text-[11px] text-rose-500/85 mt-2">Awaiting return fines</p>
            </div>

            {/* Stat Card 5 */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Fines Logged</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">${dashboardStats.totalFines}</span>
                <span className="text-zinc-400 text-xs font-semibold">USD</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Overdue policy charges</p>
            </div>
          </div>

          {/* SVG Pie Chart / Visuals Block */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm md:col-span-2">
            <h3 className="text-base font-bold mb-4">Book Stock Distribution by Genre</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-around py-4">
              {/* Stacked Chart Bar representation */}
              <div className="w-full max-w-sm flex flex-col gap-3">
                {genreChartData.map((genre, idx) => {
                  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-red-500', 'bg-purple-500'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={genre.name} className="flex flex-col">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{genre.name}</span>
                        <span className="text-zinc-400">{genre.count} books ({genre.percentage}%)</span>
                      </div>
                      <div className="w-full bg-zinc-250 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className={`${color} h-full rounded-full`} style={{ width: `${genre.percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vector decorative SVG donut display */}
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(120, 120, 120, 0.1)" strokeWidth="3" />
                  
                  {/* Segment calculation display */}
                  {(() => {
                    let accumulatedPercent = 0;
                    const colorsHex = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#a855f7'];
                    return genreChartData.map((genre, idx) => {
                      const color = colorsHex[idx % colorsHex.length];
                      const strokeDasharray = `${genre.percentage} ${100 - genre.percentage}`;
                      const strokeDashoffset = 100 - accumulatedPercent;
                      accumulatedPercent += genre.percentage;
                      return (
                        <circle
                          key={genre.name}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke={color}
                          strokeWidth="3.2"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black">{dashboardStats.totalCopies}</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Action Center */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-3">Recent Activities</h3>
              <div className="flex flex-col gap-4">
                {transactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="flex gap-3 text-sm">
                    <div className="mt-1">
                      {tx.status === 'Returned' ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[10px]">🟢</span>
                      ) : tx.status === 'Overdue' ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40 text-[10px]">🔴</span>
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40 text-[10px]">🔵</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-1 text-zinc-800 dark:text-zinc-155">{tx.bookTitle}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {tx.status === 'Returned' ? 'Returned by ' : 'Borrowed by '} {tx.memberName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('transactions')}
              className="mt-6 w-full text-center text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              View all transactions →
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB CONTENT: BOOKS CATALOGUE
          ========================================== */}
      {activeTab === 'books' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Search title, author, isbn..."
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
              />
              {bookSearch && (
                <button onClick={() => setBookSearch('')} className="absolute right-3 top-2 text-zinc-400 hover:text-zinc-650 text-sm">✕</button>
              )}
            </div>

            {/* Filter and Sort options */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <select
                value={bookGenreFilter}
                onChange={(e) => setBookGenreFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Genres</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                value={bookSortBy}
                onChange={(e) => setBookSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="title">Sort: Title</option>
                <option value="year">Sort: Year</option>
                <option value="available">Sort: Available Qty</option>
                <option value="rating">Sort: High Rating</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-400">No books found matching search filters.</p>
              <button onClick={() => { setBookSearch(''); setBookGenreFilter('All'); }} className="text-xs font-bold text-violet-600 mt-2">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:border-violet-500/35 transition-all duration-300 overflow-hidden group"
                >
                  {/* Book Banner/Cover visual representation */}
                  <div className={`h-36 bg-gradient-to-tr ${book.gradient} p-4 flex flex-col justify-between relative`}>
                    {/* Badge */}
                    <span className="self-start text-[10px] uppercase font-extrabold tracking-wider bg-black/35 text-white px-2 py-0.5 rounded-full">
                      {book.genre}
                    </span>

                    {/* Quick rating indicator */}
                    <div className="absolute top-4 right-4 bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5 text-xs text-white font-bold flex items-center gap-1">
                      ⭐ {book.rating}
                    </div>

                    <div className="text-white">
                      <p className="text-xs font-semibold opacity-75">{book.author}</p>
                      <h4 className="text-lg font-black leading-tight line-clamp-1">{book.title}</h4>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-zinc-400 block uppercase font-bold text-[9px] tracking-wide">ISBN Code</span>
                        <span className="font-mono font-medium">{book.isbn}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block uppercase font-bold text-[9px] tracking-wide">Publish Year</span>
                        <span className="font-semibold">{book.year}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-zinc-400 block uppercase font-bold text-[9px] tracking-wide">Shelf Quantity</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{book.quantity} copies</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-zinc-400 block uppercase font-bold text-[9px] tracking-wide">Availability</span>
                        <span className={`font-extrabold ${book.available > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                          {book.available > 0 ? `${book.available} Instock` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Book Actions */}
                    <div className="flex border-t border-zinc-100 dark:border-zinc-800/80 pt-3 justify-end gap-2">
                      <button
                        onClick={() => openEditBook(book)}
                        className="p-1 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-violet-500/50 dark:hover:border-violet-400/50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="p-1 px-3 border border-rose-200 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB CONTENT: MEMBERS DIRECTORY
          ========================================== */}
      {activeTab === 'members' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Members search & filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member name or email..."
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
              />
            </div>

            <select
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none w-full md:w-auto"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Premium Member">Premium Member</option>
            </select>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm bg-white dark:bg-zinc-900/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Member Type</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Books Loaned</th>
                  <th className="p-4">Borrow Limit</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/80">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/35 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-zinc-100">{member.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        member.type === 'Student' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                        member.type === 'Faculty' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                        'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400'
                      }`}>
                        {member.type}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">{member.joinedDate}</td>
                    <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">{member.borrowedCount}</td>
                    <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">{member.borrowLimit}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditMember(member)}
                          className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="px-2.5 py-1 border border-rose-200 dark:border-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors cursor-pointer"
                        >
                          Remove
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

      {/* ==========================================
          TAB CONTENT: TRANSACTIONS AND HISTORY
          ========================================== */}
      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* TX Filtering bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search book title or member..."
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
              />
            </div>

            <select
              value={txStatusFilter}
              onChange={(e) => setTxStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none w-full md:w-auto"
            >
              <option value="All">All Loan Statuses</option>
              <option value="Issued">Issued</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Transactions Log Table */}
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm bg-white dark:bg-zinc-900/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Tx ID</th>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Issue & Due Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Fine Policy</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/80">
                {filteredTxs.map((tx) => {
                  // Live calculate status badge if issued but past due date
                  let liveStatus = tx.status;
                  let overdueFine = tx.fine || 0;
                  
                  if (tx.status === 'Issued') {
                    const diff = getDaysDifference(tx.dueDate, CURRENT_DATE_STR);
                    if (diff > 0) {
                      liveStatus = 'Overdue';
                      overdueFine = diff * 1; // $1/day
                    }
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/35 transition-colors">
                      <td className="p-4 font-mono text-zinc-400 font-semibold text-xs">{tx.id}</td>
                      <td className="p-4">
                        <span className="font-bold line-clamp-1 text-zinc-800 dark:text-zinc-100">{tx.bookTitle}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-zinc-700 dark:text-zinc-300">{tx.memberName}</span>
                      </td>
                      <td className="p-4 text-xs">
                        <p className="font-medium text-zinc-700 dark:text-zinc-300">Issued: {tx.issueDate}</p>
                        <p className="text-zinc-400">Due Date: {tx.dueDate}</p>
                      </td>
                      <td className="p-4 text-xs text-zinc-500 font-medium">
                        {tx.returnDate ? tx.returnDate : <span className="italic text-zinc-400">not returned</span>}
                      </td>
                      <td className="p-4">
                        {overdueFine > 0 ? (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            ${overdueFine} fine
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">no fine</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          liveStatus === 'Returned' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                          liveStatus === 'Overdue' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 animate-pulse' :
                          'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                        }`}>
                          {liveStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {(liveStatus === 'Issued' || liveStatus === 'Overdue') && (
                          <button
                            onClick={() => handleReturnBook(tx.id)}
                            className="px-3 py-1 bg-violet-50 hover:bg-violet-100 dark:bg-violet-955/20 dark:hover:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-bold border border-violet-250 dark:border-violet-900 rounded-lg transition-colors cursor-pointer"
                          >
                            Return
                          </button>
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

      {/* ==========================================
          FORM MODAL: ADD / EDIT BOOK
          ========================================== */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-zoom-in">
            <div className="p-5 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                {editingBook ? 'Edit Book Details' : 'Register New Book'}
              </h3>
              <button
                onClick={() => setBookModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-650 transition-colors font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. Clean Architecture"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Robert C. Martin"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Genre *</label>
                  <select
                    value={bookForm.genre}
                    onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                  >
                    {GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">ISBN Code *</label>
                <input
                  type="text"
                  required
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  placeholder="e.g. 978-0135957059"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Publish Year *</label>
                  <input
                    type="number"
                    required
                    value={bookForm.year}
                    onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={bookForm.quantity}
                    onChange={(e) => setBookForm({ ...bookForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          FORM MODAL: REGISTER / EDIT MEMBER
          ========================================== */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-zoom-in">
            <div className="p-5 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                {editingMember ? 'Edit Member Registry' : 'Register Library Member'}
              </h3>
              <button
                onClick={() => setMemberModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-650 transition-colors font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="e.g. john.doe@giet.edu"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Member Category *</label>
                <select
                  value={memberForm.type}
                  onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                >
                  <option value="Student">Student (Limit: 3 books)</option>
                  <option value="Faculty">Faculty (Limit: 7 books)</option>
                  <option value="Premium Member">Premium Member (Limit: 5 books)</option>
                </select>
              </div>

              <div className="flex border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          FORM MODAL: ISSUE BOOK
          ========================================== */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-zoom-in">
            <div className="p-5 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                Issue Book to Member
              </h3>
              <button
                onClick={() => setIssueModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-650 transition-colors font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Select Member *</label>
                <select
                  required
                  value={issueForm.memberId}
                  onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type} - Loans: {m.borrowedCount}/{m.borrowLimit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Select Book *</label>
                <select
                  required
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-800 dark:text-zinc-100"
                >
                  <option value="">-- Choose Book --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.available <= 0}>
                      {b.title} by {b.author} {b.available > 0 ? `(${b.available} available)` : '(Out of Stock)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
