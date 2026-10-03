const TEMPLATES = [
  { id: 'professional', name: 'Professional', color: '#2563EB' },
  { id: 'modern', name: 'Modern', color: '#F0B429' },
  { id: 'minimal', name: 'Minimal', color: '#1F2937' },
  { id: 'classic', name: 'Classic', color: '#92400E' },
  { id: 'bold', name: 'Bold', color: '#DC2626' },
  { id: 'elegant', name: 'Elegant', color: '#7C3AED' },
  { id: 'colorful', name: 'Colorful', color: '#F59E0B' },
  { id: 'corporate', name: 'Corporate', color: '#1E3A5F' },
];

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">Choose Template</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 justify-center flex-wrap" style={{ scrollbarWidth: 'none' }}>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              selected === t.id ? 'border-gold-400 shadow-md' : 'border-gray-200'
            }`}
          >
            <div className="bg-white p-1.5">
              <div className="rounded-sm overflow-hidden">
                <div style={{ backgroundColor: t.color }} className="h-4" />
                <div className="bg-gray-50 p-1.5 space-y-1">
                  <div className="h-1 bg-gray-300 rounded w-3/4" />
                  <div className="h-1 bg-gray-200 rounded w-1/2" />
                  <div className="h-1 bg-gray-200 rounded w-full" />
                  <div className="h-1 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
            <div className="text-[10px] font-medium text-gray-600 py-1 text-center bg-white">
              {t.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
