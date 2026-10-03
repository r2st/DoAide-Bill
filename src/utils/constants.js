export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export const DOCUMENT_TYPES = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'estimate', label: 'Estimate' },
  { value: 'quotation', label: 'Quotation' },
  { value: 'proforma', label: 'Proforma Invoice' },
];

export const DEFAULT_LINE_ITEM = {
  description: '',
  hsn: '',
  quantity: 1,
  rate: 0,
  gstRate: 18,
  discount: 0,
  discountType: 'percent',
};

export const DEFAULT_INVOICE = {
  documentType: 'invoice',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: 'INR',
  businessName: '',
  businessAddress: '',
  businessGstin: '',
  businessState: '',
  businessEmail: '',
  businessPhone: '',
  businessLogo: null,
  clientName: '',
  clientAddress: '',
  clientGstin: '',
  clientState: '',
  clientEmail: '',
  clientPhone: '',
  items: [{ ...DEFAULT_LINE_ITEM }],
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: '',
  notes: '',
  terms: 'Payment due within 30 days of invoice date.',
  signature: null,
  template: 'professional',
};
