export function calculateItemTotal(item) {
  const quantity = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const subtotal = quantity * rate;

  let discount = 0;
  if (item.discountType === 'percent') {
    discount = subtotal * ((Number(item.discount) || 0) / 100);
  } else {
    discount = Number(item.discount) || 0;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const gstRate = Number(item.gstRate) || 0;
  const gstAmount = taxableAmount * (gstRate / 100);

  return { subtotal, discount, taxableAmount, gstAmount, total: taxableAmount + gstAmount };
}

export function isInterState(businessState, clientState) {
  if (!businessState || !clientState) return false;
  return businessState !== clientState;
}

export function calculateInvoiceTotals(items, businessState, clientState) {
  const interState = isInterState(businessState, clientState);

  let totalSubtotal = 0;
  let totalDiscount = 0;
  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let grandTotal = 0;

  const itemDetails = items.map(item => {
    const calc = calculateItemTotal(item);
    totalSubtotal += calc.subtotal;
    totalDiscount += calc.discount;
    totalTaxable += calc.taxableAmount;

    if (interState) {
      totalIgst += calc.gstAmount;
    } else {
      totalCgst += calc.gstAmount / 2;
      totalSgst += calc.gstAmount / 2;
    }

    grandTotal += calc.total;
    return { ...item, ...calc };
  });

  return {
    itemDetails,
    totalSubtotal: round2(totalSubtotal),
    totalDiscount: round2(totalDiscount),
    totalTaxable: round2(totalTaxable),
    totalCgst: round2(totalCgst),
    totalSgst: round2(totalSgst),
    totalIgst: round2(totalIgst),
    grandTotal: round2(grandTotal),
    interState,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function formatCurrency(amount, currencyCode = 'INR') {
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currencyCode} ${num.toFixed(2)}`;
  }
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertGroup(n) {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertGroup(n % 100) : '');
}

export function numberToWords(num) {
  if (num === 0) return 'Zero';
  const intPart = Math.floor(Math.abs(num));
  const decPart = Math.round((Math.abs(num) - intPart) * 100);

  let words = '';
  if (intPart >= 10000000) {
    words += convertGroup(Math.floor(intPart / 10000000)) + ' Crore ';
  }
  const rem1 = intPart % 10000000;
  if (rem1 >= 100000) {
    words += convertGroup(Math.floor(rem1 / 100000)) + ' Lakh ';
  }
  const rem2 = rem1 % 100000;
  if (rem2 >= 1000) {
    words += convertGroup(Math.floor(rem2 / 1000)) + ' Thousand ';
  }
  const rem3 = rem2 % 1000;
  if (rem3 > 0) {
    words += convertGroup(rem3);
  }

  words = words.trim() || 'Zero';
  if (decPart > 0) {
    words += ' and ' + convertGroup(decPart) + ' Paise';
  }

  return words + ' Only';
}
