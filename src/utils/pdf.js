import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function generatePDF(elementId, filename = 'invoice.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;

  const x = (pdfWidth - width) / 2;

  let heightLeft = height;
  let position = 0;

  pdf.addImage(imgData, 'PNG', x, position, width, height);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = -(height - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', x, position, width, height);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
}

export function shareViaWhatsApp(invoice) {
  const text = encodeURIComponent(
    `Invoice ${invoice.invoiceNumber || ''} from ${invoice.businessName || 'Business'}\n` +
    `Amount: ${invoice.currency} ${invoice.grandTotal || ''}\n` +
    `Generated with DoAide Bill - https://bill.doaide.com`
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
}
