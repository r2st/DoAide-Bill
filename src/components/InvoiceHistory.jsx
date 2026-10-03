import { useState, useEffect } from 'react';
import { getInvoices, deleteInvoice } from '../utils/storage';
import { formatCurrency } from '../utils/gst';
import { DOCUMENT_TYPES } from '../utils/constants';

export default function InvoiceHistory({ onLoad, onClose }) {
  const [invoices, setInvoices] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const getDocLabel = (type) =>
    DOCUMENT_TYPES.find(d => d.value === type)?.label || 'Invoice';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">Invoice History</h2>
        </div>
        <span className="text-sm text-gray-500">{invoices.length} saved</span>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="text-gray-500 font-medium">No saved invoices yet</p>
          <p className="text-sm text-gray-400 mt-1">Your saved invoices will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 bg-gold-50 text-gold-700 rounded-full">
                      {getDocLabel(inv.documentType)}
                    </span>
                    {inv.invoiceNumber && (
                      <span className="text-sm font-mono text-gray-600">#{inv.invoiceNumber}</span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 truncate">{inv.clientName || 'No client name'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {inv.invoiceDate && <span>{inv.invoiceDate}</span>}
                    {inv.grandTotal != null && (
                      <span className="font-medium text-gray-700">
                        {formatCurrency(inv.grandTotal, inv.currency)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => onLoad(inv)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-gold-400 hover:bg-gold-500 rounded-lg transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      confirmDelete === inv.id
                        ? 'bg-red-500 text-white'
                        : 'text-red-500 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    {confirmDelete === inv.id ? 'Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
