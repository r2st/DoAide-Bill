import { useState, useRef, useCallback } from 'react';
import { INDIAN_STATES, GST_RATES, CURRENCIES, DOCUMENT_TYPES, DEFAULT_LINE_ITEM } from '../utils/constants';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400';
const selectCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white';

export default function InvoiceForm({ invoice, onChange }) {
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const updateField = useCallback((field, value) => {
    onChange({ [field]: value });
  }, [onChange]);

  const updateItem = useCallback((index, field, value) => {
    const items = invoice.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ items });
  }, [invoice.items, onChange]);

  const addItem = useCallback(() => {
    onChange({ items: [...invoice.items, { ...DEFAULT_LINE_ITEM }] });
  }, [invoice.items, onChange]);

  const removeItem = useCallback((index) => {
    if (invoice.items.length <= 1) return;
    onChange({ items: invoice.items.filter((_, i) => i !== index) });
  }, [invoice.items, onChange]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ businessLogo: ev.target.result });
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleSignatureUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ signature: ev.target.result });
    reader.readAsDataURL(file);
  }, [onChange]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1F2937';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) onChange({ signature: canvas.toDataURL() });
  }, [isDrawing, onChange]);

  const clearSignature = useCallback(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    onChange({ signature: null });
  }, [onChange]);

  return (
    <div className="space-y-4">
      <Section title="Document Settings">
        <div className="grid grid-cols-2 gap-3 pt-3">
          <Field label="Document Type">
            <select value={invoice.documentType} onChange={e => updateField('documentType', e.target.value)} className={selectCls}>
              {DOCUMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Number">
            <input value={invoice.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} placeholder="INV-001" className={inputCls} />
          </Field>
          <Field label="Date">
            <input type="date" value={invoice.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Due Date">
            <input type="date" value={invoice.dueDate} onChange={e => updateField('dueDate', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Currency">
            <select value={invoice.currency} onChange={e => updateField('currency', e.target.value)} className={selectCls}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Your Business">
        <div className="space-y-3 pt-3">
          <Field label="Business Name">
            <input value={invoice.businessName} onChange={e => updateField('businessName', e.target.value)} placeholder="Your Business Name" className={inputCls} />
          </Field>
          <Field label="Address">
            <textarea value={invoice.businessAddress} onChange={e => updateField('businessAddress', e.target.value)} placeholder="Full address" rows={2} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GSTIN">
              <input value={invoice.businessGstin} onChange={e => updateField('businessGstin', e.target.value)} placeholder="22AAAAA0000A1Z5" className={inputCls} />
            </Field>
            <Field label="State">
              <select value={invoice.businessState} onChange={e => updateField('businessState', e.target.value)} className={selectCls}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Email">
              <input type="email" value={invoice.businessEmail} onChange={e => updateField('businessEmail', e.target.value)} placeholder="email@business.com" className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={invoice.businessPhone} onChange={e => updateField('businessPhone', e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
            </Field>
          </div>
          <Field label="Logo">
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100" />
              {invoice.businessLogo && (
                <button onClick={() => updateField('businessLogo', null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              )}
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Client Details">
        <div className="space-y-3 pt-3">
          <Field label="Client Name">
            <input value={invoice.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Client Name" className={inputCls} />
          </Field>
          <Field label="Address">
            <textarea value={invoice.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} placeholder="Client address" rows={2} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GSTIN">
              <input value={invoice.clientGstin} onChange={e => updateField('clientGstin', e.target.value)} placeholder="Client GSTIN" className={inputCls} />
            </Field>
            <Field label="State">
              <select value={invoice.clientState} onChange={e => updateField('clientState', e.target.value)} className={selectCls}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Email">
              <input type="email" value={invoice.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} placeholder="client@email.com" className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={invoice.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} placeholder="Client phone" className={inputCls} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Line Items">
        <div className="space-y-3 pt-3">
          {invoice.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">Item {i + 1}</span>
                {invoice.items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description" className={inputCls} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input value={item.hsn} onChange={e => updateItem(i, 'hsn', e.target.value)} placeholder="HSN/SAC" className={inputCls} />
                  <input type="number" min="0" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className={inputCls} />
                  <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} placeholder="Rate" className={inputCls} />
                  <select value={item.gstRate} onChange={e => updateItem(i, 'gstRate', Number(e.target.value))} className={selectCls}>
                    {GST_RATES.map(r => <option key={r} value={r}>GST {r}%</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" min="0" step="0.01" value={item.discount} onChange={e => updateItem(i, 'discount', e.target.value)} placeholder="Discount" className={inputCls} />
                  <select value={item.discountType} onChange={e => updateItem(i, 'discountType', e.target.value)} className={selectCls}>
                    <option value="percent">%</option>
                    <option value="amount">Fixed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-gold-400 hover:text-gold-600 transition-colors"
          >
            + Add Item
          </button>
        </div>
      </Section>

      <Section title="Bank Details" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3 pt-3">
          <Field label="Bank Name">
            <input value={invoice.bankName} onChange={e => updateField('bankName', e.target.value)} placeholder="Bank Name" className={inputCls} />
          </Field>
          <Field label="Account Number">
            <input value={invoice.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} placeholder="Account Number" className={inputCls} />
          </Field>
          <Field label="IFSC Code">
            <input value={invoice.ifscCode} onChange={e => updateField('ifscCode', e.target.value)} placeholder="IFSC Code" className={inputCls} />
          </Field>
          <Field label="UPI ID">
            <input value={invoice.upiId} onChange={e => updateField('upiId', e.target.value)} placeholder="name@upi" className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Notes & Terms" defaultOpen={false}>
        <div className="space-y-3 pt-3">
          <Field label="Notes">
            <textarea value={invoice.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Additional notes for the client..." rows={2} className={inputCls} />
          </Field>
          <Field label="Terms & Conditions">
            <textarea value={invoice.terms} onChange={e => updateField('terms', e.target.value)} rows={2} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Digital Signature" defaultOpen={false}>
        <div className="pt-3">
          <div className="flex gap-2 mb-3">
            <label className="flex-1">
              <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
              <span className="block text-center py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                Upload Signature
              </span>
            </label>
            <button onClick={clearSignature} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-2">Or draw below:</p>
          <canvas
            ref={sigCanvasRef}
            width={360}
            height={120}
            className="w-full border border-gray-300 rounded-lg cursor-crosshair bg-white"
            style={{ touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {invoice.signature && (
            <p className="text-xs text-green-600 mt-1">Signature captured</p>
          )}
        </div>
      </Section>
    </div>
  );
}
