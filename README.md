# DoAide Bill

Free invoice and bill generator for Indian freelancers and small businesses. No signup required.

**Live:** https://bill.doaide.com

## Features

- Invoice, Estimate, Quotation, and Proforma Invoice generation
- 8 professional templates (Professional, Modern, Minimal, Classic, Bold, Elegant, Colorful, Corporate)
- GST-compliant: auto-calculates CGST/SGST (intra-state) or IGST (inter-state)
- Multi-currency support (INR, USD, EUR, GBP)
- PDF download via html2canvas + jsPDF
- Invoice history saved in localStorage
- Digital signature (draw or upload)
- WhatsApp sharing
- Mobile responsive
- No backend, no login, no data collection

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- html2canvas-pro + jsPDF for PDF generation
- localStorage for invoice history

## Development

```bash
npm install
npm run dev    # runs on port 3070
npm run build
```

## License

MIT
