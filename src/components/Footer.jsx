export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          Made with care by{' '}
          <a href="https://doaide.com" className="text-gold-500 hover:text-gold-600 font-medium" target="_blank" rel="noopener noreferrer">
            DoAide
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Free forever. No signup. No data collection.
        </p>
      </div>
    </footer>
  );
}
