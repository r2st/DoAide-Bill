const STORAGE_KEY = 'doaide-bill-invoices';

export function saveInvoice(invoice) {
  try {
    const invoices = getInvoices();
    const existing = invoices.findIndex(inv => inv.id === invoice.id);
    const toSave = { ...invoice, updatedAt: new Date().toISOString() };

    if (existing >= 0) {
      invoices[existing] = toSave;
    } else {
      toSave.id = generateId();
      toSave.createdAt = new Date().toISOString();
      invoices.unshift(toSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return toSave;
  } catch {
    return invoice;
  }
}

export function getInvoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteInvoice(id) {
  try {
    const invoices = getInvoices().filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    // silent
  }
}

export function getInvoiceById(id) {
  return getInvoices().find(inv => inv.id === id) || null;
}

function generateId() {
  return 'inv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
