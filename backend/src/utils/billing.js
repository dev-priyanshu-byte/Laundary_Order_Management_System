exports.calculateTotals = (items = [], taxRate = 0.1, discount = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0);

  const tax = Number((subtotal * taxRate).toFixed(2));
  const discountAmount = Number(discount) || 0;
  const total = Number((subtotal + tax - discountAmount).toFixed(2));

  return { subtotal, tax, discount: discountAmount, total };
};
