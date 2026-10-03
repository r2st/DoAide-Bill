import { formatCurrency, numberToWords } from '../utils/gst';
import { DOCUMENT_TYPES } from '../utils/constants';

const TEMPLATE_STYLES = {
  professional: {
    headerBg: '#2563EB', headerText: '#FFFFFF', accentColor: '#2563EB',
    tableHeaderBg: '#EFF6FF', tableHeaderText: '#1E40AF', borderColor: '#BFDBFE',
  },
  modern: {
    headerBg: 'linear-gradient(135deg, #1F2937, #F0B429)', headerText: '#FFFFFF', accentColor: '#F0B429',
    tableHeaderBg: '#FFF9E6', tableHeaderText: '#92400E', borderColor: '#FDE68A',
  },
  minimal: {
    headerBg: '#FFFFFF', headerText: '#1F2937', accentColor: '#1F2937',
    tableHeaderBg: '#F9FAFB', tableHeaderText: '#374151', borderColor: '#E5E7EB',
  },
  classic: {
    headerBg: '#FFFBEB', headerText: '#78350F', accentColor: '#92400E',
    tableHeaderBg: '#FEF3C7', tableHeaderText: '#78350F', borderColor: '#D97706',
  },
  bold: {
    headerBg: '#1F2937', headerText: '#FFFFFF', accentColor: '#DC2626',
    tableHeaderBg: '#FEE2E2', tableHeaderText: '#991B1B', borderColor: '#FCA5A5',
  },
  elegant: {
    headerBg: '#F5F3FF', headerText: '#5B21B6', accentColor: '#7C3AED',
    tableHeaderBg: '#EDE9FE', tableHeaderText: '#6D28D9', borderColor: '#C4B5FD',
  },
  colorful: {
    headerBg: 'linear-gradient(135deg, #F0B429, #F59E0B)', headerText: '#FFFFFF', accentColor: '#F59E0B',
    tableHeaderBg: '#FFFBEB', tableHeaderText: '#92400E', borderColor: '#FCD34D',
  },
  corporate: {
    headerBg: '#1E3A5F', headerText: '#FFFFFF', accentColor: '#1E3A5F',
    tableHeaderBg: '#F0F4F8', tableHeaderText: '#1E3A5F', borderColor: '#94A3B8',
  },
};

export default function InvoicePreview({ invoice, totals }) {
  const style = TEMPLATE_STYLES[invoice.template] || TEMPLATE_STYLES.professional;
  const docLabel = DOCUMENT_TYPES.find(d => d.value === invoice.documentType)?.label || 'Invoice';
  const fc = (amt) => formatCurrency(amt, invoice.currency);

  const isGradient = style.headerBg.includes('gradient');
  const headerStyle = isGradient
    ? { background: style.headerBg, color: style.headerText }
    : { backgroundColor: style.headerBg, color: style.headerText };

  const minimalMode = invoice.template === 'minimal';

  return (
    <div
      id="invoice-preview"
      className="bg-white text-gray-900"
      style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', lineHeight: '1.5' }}
    >
      {/* Header */}
      <div
        style={{
          ...headerStyle,
          padding: minimalMode ? '0 0 16px 0' : '24px',
          borderRadius: minimalMode ? 0 : '8px',
          marginBottom: '24px',
          borderBottom: minimalMode ? `2px solid ${style.accentColor}` : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {invoice.businessLogo && (
                <img src={invoice.businessLogo} alt="Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
              )}
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{invoice.businessName || 'Your Business'}</div>
              </div>
            </div>
            {invoice.businessAddress && <div style={{ opacity: 0.85, whiteSpace: 'pre-line', fontSize: '12px' }}>{invoice.businessAddress}</div>}
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>
              {invoice.businessGstin && <span>GSTIN: {invoice.businessGstin}</span>}
              {invoice.businessEmail && <span style={{ marginLeft: invoice.businessGstin ? '16px' : 0 }}>{invoice.businessEmail}</span>}
              {invoice.businessPhone && <span style={{ marginLeft: '16px' }}>{invoice.businessPhone}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{docLabel}</div>
            {invoice.invoiceNumber && <div style={{ fontSize: '14px', opacity: 0.9 }}>#{invoice.invoiceNumber}</div>}
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              {invoice.invoiceDate && <div>Date: {invoice.invoiceDate}</div>}
              {invoice.dueDate && <div>Due: {invoice.dueDate}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: style.accentColor, marginBottom: '4px', letterSpacing: '0.5px' }}>Bill To</div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{invoice.clientName || 'Client Name'}</div>
          {invoice.clientAddress && <div style={{ color: '#6B7280', whiteSpace: 'pre-line', fontSize: '12px' }}>{invoice.clientAddress}</div>}
          {invoice.clientGstin && <div style={{ color: '#6B7280', fontSize: '12px' }}>GSTIN: {invoice.clientGstin}</div>}
          <div style={{ color: '#6B7280', fontSize: '12px' }}>
            {invoice.clientEmail && <span>{invoice.clientEmail}</span>}
            {invoice.clientPhone && <span style={{ marginLeft: invoice.clientEmail ? '12px' : 0 }}>{invoice.clientPhone}</span>}
          </div>
        </div>
        {invoice.businessState && invoice.clientState && (
          <div style={{ flex: '0 0 auto', padding: '8px 16px', borderRadius: '6px', backgroundColor: totals.interState ? '#FEF3C7' : '#ECFDF5', fontSize: '12px', alignSelf: 'flex-start' }}>
            <span style={{ fontWeight: 600, color: totals.interState ? '#92400E' : '#065F46' }}>
              {totals.interState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}
            </span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: style.tableHeaderBg, color: style.tableHeaderText }}>
            <th style={thStyle(style.borderColor)}>#</th>
            <th style={{ ...thStyle(style.borderColor), textAlign: 'left' }}>Description</th>
            <th style={thStyle(style.borderColor)}>HSN</th>
            <th style={thStyle(style.borderColor)}>Qty</th>
            <th style={thStyle(style.borderColor)}>Rate</th>
            <th style={thStyle(style.borderColor)}>Disc.</th>
            <th style={thStyle(style.borderColor)}>Taxable</th>
            <th style={thStyle(style.borderColor)}>GST</th>
            <th style={thStyle(style.borderColor)}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {totals.itemDetails.map((item, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${style.borderColor}` }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 500 }}>{item.description || '-'}</td>
              <td style={tdStyle}>{item.hsn || '-'}</td>
              <td style={tdStyle}>{item.quantity}</td>
              <td style={tdStyle}>{fc(item.rate)}</td>
              <td style={tdStyle}>{item.discount > 0 ? (item.discountType === 'percent' ? `${item.discount}%` : fc(item.discount)) : '-'}</td>
              <td style={tdStyle}>{fc(item.taxableAmount)}</td>
              <td style={tdStyle}>{item.gstRate}%</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{fc(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <div style={{ width: '280px' }}>
          <TotalRow label="Subtotal" value={fc(totals.totalSubtotal)} borderColor={style.borderColor} />
          {totals.totalDiscount > 0 && <TotalRow label="Discount" value={`- ${fc(totals.totalDiscount)}`} borderColor={style.borderColor} />}
          <TotalRow label="Taxable Amount" value={fc(totals.totalTaxable)} borderColor={style.borderColor} />
          {totals.interState ? (
            <TotalRow label="IGST" value={fc(totals.totalIgst)} borderColor={style.borderColor} />
          ) : (
            <>
              <TotalRow label="CGST" value={fc(totals.totalCgst)} borderColor={style.borderColor} />
              <TotalRow label="SGST" value={fc(totals.totalSgst)} borderColor={style.borderColor} />
            </>
          )}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '10px 0',
            borderTop: `2px solid ${style.accentColor}`, fontWeight: 700, fontSize: '16px', color: style.accentColor,
          }}>
            <span>Total</span>
            <span>{fc(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Amount in Words */}
      {totals.grandTotal > 0 && (
        <div style={{ padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '6px', marginBottom: '24px', fontSize: '12px' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Amount in Words: </span>
          <span style={{ color: '#6B7280' }}>
            {invoice.currency === 'INR' ? 'Rupees ' : ''}{numberToWords(totals.grandTotal)}
          </span>
        </div>
      )}

      {/* Bank Details */}
      {(invoice.bankName || invoice.accountNumber || invoice.ifscCode || invoice.upiId) && (
        <div style={{ marginBottom: '24px', padding: '16px', border: `1px solid ${style.borderColor}`, borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: style.accentColor, marginBottom: '8px', letterSpacing: '0.5px' }}>Bank Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: '12px' }}>
            {invoice.bankName && <><span style={{ color: '#6B7280' }}>Bank:</span><span style={{ fontWeight: 500 }}>{invoice.bankName}</span></>}
            {invoice.accountNumber && <><span style={{ color: '#6B7280' }}>Account:</span><span style={{ fontWeight: 500 }}>{invoice.accountNumber}</span></>}
            {invoice.ifscCode && <><span style={{ color: '#6B7280' }}>IFSC:</span><span style={{ fontWeight: 500 }}>{invoice.ifscCode}</span></>}
            {invoice.upiId && <><span style={{ color: '#6B7280' }}>UPI:</span><span style={{ fontWeight: 500 }}>{invoice.upiId}</span></>}
          </div>
        </div>
      )}

      {/* Notes & Terms */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {invoice.notes && (
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: style.accentColor, marginBottom: '4px', letterSpacing: '0.5px' }}>Notes</div>
            <div style={{ color: '#6B7280', fontSize: '12px', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
          </div>
        )}
        {invoice.terms && (
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: style.accentColor, marginBottom: '4px', letterSpacing: '0.5px' }}>Terms & Conditions</div>
            <div style={{ color: '#6B7280', fontSize: '12px', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
          </div>
        )}
      </div>

      {/* Signature */}
      {invoice.signature && (
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <img src={invoice.signature} alt="Signature" style={{ height: '60px', width: 'auto', marginLeft: 'auto' }} />
          <div style={{ borderTop: `1px solid ${style.borderColor}`, display: 'inline-block', paddingTop: '4px', fontSize: '12px', color: '#6B7280', minWidth: '200px' }}>
            Authorized Signatory
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', borderTop: `1px solid ${style.borderColor}`, paddingTop: '12px' }}>
        Generated with DoAide Bill &mdash; bill.doaide.com
      </div>
    </div>
  );
}

function TotalRow({ label, value, borderColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${borderColor}`, fontSize: '13px' }}>
      <span style={{ color: '#6B7280' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const thStyle = (borderColor) => ({
  padding: '8px 10px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.3px', textAlign: 'right', borderBottom: `2px solid ${borderColor}`,
});

const tdStyle = {
  padding: '8px 10px', textAlign: 'right', fontSize: '12px',
};
