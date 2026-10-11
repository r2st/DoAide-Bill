export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-full">
            <div className="w-4 h-4 bg-teal-600 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-medium text-teal-700 dark:text-teal-400">A DoAide Product</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
            <a href="https://doaide.com" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors" target="_blank" rel="noopener noreferrer">DoAide</a>
            <span>&middot;</span>
            <a href="https://bill.doaide.com" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Bill</a>
          </div>

          <p className="text-xs text-gray-400 dark:text-slate-500">
            Free forever. No signup. No data collection.
          </p>
        </div>
      </div>
    </footer>
  );
}
