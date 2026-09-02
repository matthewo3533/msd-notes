export interface AdditionalPayment {
  id: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
}

export const createBlankAdditionalPayment = (): AdditionalPayment => ({
  id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  supplierName: '',
  supplierId: '',
  amount: 0,
  recoveryRate: 0
});

export const hasAdditionalPaymentData = (payment: AdditionalPayment): boolean => {
  return !!(
    (payment.supplierName && payment.supplierName.trim()) ||
    (payment.supplierId && payment.supplierId.trim()) ||
    (payment.amount && payment.amount > 0) ||
    (payment.recoveryRate && payment.recoveryRate > 0)
  );
};

export const formatAdditionalPaymentsNote = (payments?: AdditionalPayment[]): string => {
  if (!Array.isArray(payments) || payments.length === 0) {
    return '';
  }

  const blocks = payments
    .filter(hasAdditionalPaymentData)
    .map((payment) => {
      let block = '';
      if (payment.supplierName && payment.supplierName.trim()) {
        block += `Supplier Name: ${payment.supplierName}\n`;
      }
      if (payment.supplierId && payment.supplierId.trim()) {
        block += `Supplier ID: ${payment.supplierId}\n`;
      }
      if (payment.amount && payment.amount > 0) {
        block += `Amount: $${payment.amount.toFixed(2)}\n`;
      }
      if (payment.recoveryRate && payment.recoveryRate > 0) {
        block += `Recovery rate: $${payment.recoveryRate.toFixed(2)}\n`;
      }
      return block;
    })
    .filter(Boolean);

  if (blocks.length === 0) {
    return '';
  }

  return '\n' + blocks.join('\n');
};
