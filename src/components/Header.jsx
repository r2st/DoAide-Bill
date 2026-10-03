export default function Header({ onNewInvoice, onShowHistory }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">
              <span className="text-gold-400">Do</span>
              <span className="text-gray-800">Aide</span>{' '}
              <span className="text-gold-400">Bill</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Free Invoice Generator for Indian Businesses</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="hidden sm:inline">History</span>
          </button>
          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gold-400 rounded-lg hover:bg-gold-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">New Invoice</span>
          </button>
        </div>
      </div>
    </header>
  );
}
