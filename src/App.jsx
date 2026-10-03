import { useState, useCallback } from 'react';
import Header from './components/Header';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceHistory from './components/InvoiceHistory';
import TemplateSelector from './components/TemplateSelector';
import Footer from './components/Footer';
import { DEFAULT_INVOICE } from './utils/constants';
import { saveInvoice } from './utils/storage';
import { generatePDF, shareViaWhatsApp } from './utils/pdf';
import { calculateInvoiceTotals, formatCurrency } from './utils/gst';

export default function App() {
  const [invoice, setInvoice] = useState({ ...DEFAULT_INVOICE });
  const [activeTab, setActiveTab] = useState('form');
  const [showHistory, setShowHistory] = useState(false);
  const [generating, setGenerating] = useState(false);

  const totals = calculateInvoiceTotals(
    invoice.items,
    invoice.businessState,
    invoice.clientState
  );

  const updateInvoice = useCallback((updates) => {
    setInvoice(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(() => {
    const saved = saveInvoice({ ...invoice, grandTotal: totals.grandTotal });
    setInvoice(saved);
  }, [invoice, totals.grandTotal]);

  const handleDownloadPDF = useCallback(async () => {
    setActiveTab('preview');
    setGenerating(true);
    await new Promise(r => setTimeout(r, 300));
    try {
      const filename = `${invoice.documentType}_${invoice.invoiceNumber || 'draft'}.pdf`;
      await generatePDF('invoice-preview', filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
    setGenerating(false);
  }, [invoice.documentType, invoice.invoiceNumber]);

  const handleShare = useCallback(() => {
    shareViaWhatsApp({
      ...invoice,
      grandTotal: formatCurrency(totals.grandTotal, invoice.currency),
    });
  }, [invoice, totals.grandTotal]);

  const handleLoadInvoice = useCallback((loaded) => {
    setInvoice(loaded);
    setShowHistory(false);
    setActiveTab('form');
  }, []);

  const handleNewInvoice = useCallback(() => {
    setInvoice({ ...DEFAULT_INVOICE, invoiceDate: new Date().toISOString().split('T')[0] });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNewInvoice={handleNewInvoice}
        onShowHistory={() => setShowHistory(true)}
      />

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {showHistory ? (
          <InvoiceHistory
            onLoad={handleLoadInvoice}
            onClose={() => setShowHistory(false)}
          />
        ) : (
          <>
            <TemplateSelector
              selected={invoice.template}
              onSelect={(template) => updateInvoice({ template })}
            />

            <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200 max-w-xs mx-auto sm:hidden">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'form'
                    ? 'bg-gold-400 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-gold-400 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className={`w-full sm:w-1/2 lg:w-[45%] ${activeTab !== 'form' ? 'hidden sm:block' : ''}`}>
                <InvoiceForm invoice={invoice} onChange={updateInvoice} />
              </div>

              <div className={`w-full sm:w-1/2 lg:w-[55%] ${activeTab !== 'preview' ? 'hidden sm:block' : ''}`}>
                <div className="sticky top-4">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={generating}
                      className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {generating ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      )}
                      Download PDF
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                      Save
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Share
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[80vh]">
                    <InvoicePreview invoice={invoice} totals={totals} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
