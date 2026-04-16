const orderModel = require('../models/orderModel');
const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');
const { calculateTotals } = require('../utils/billing');

const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    name: item.name || 'unknown',
    serviceType: item.serviceType || 'regular',
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unitPrice) || 0,
    notes: item.notes || '',
  }));
};

const attachCustomerData = (order) => {
  const customer = customerModel.findById(order.customerId);
  return {
    ...order,
    customer: customer
      ? {
          id: customer.id,
          name: customer.name || null,
          phone: customer.phone || null,
        }
      : null,
  };
};

const validateOrderPayload = (payload) => {
  if (!payload.customerId) {
    const error = new Error('customerId is required');
    error.status = 400;
    throw error;
  }

  const customer = customerModel.findById(payload.customerId);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }

  const items = normalizeItems(payload.items);
  if (items.length === 0) {
    const error = new Error('At least one order item is required');
    error.status = 400;
    throw error;
  }

  return items;
};

const normalizeStatus = (status) => {
  if (!status) return null;
  return status.toString().trim().toUpperCase();
};

exports.listOrders = async (filters = {}) => {
  const statusFilter = normalizeStatus(filters.status);
  const nameFilter = filters.customerName ? filters.customerName.toString().trim().toLowerCase() : null;
  const phoneFilter = filters.customerPhone ? filters.customerPhone.toString().replace(/\D/g, '') : null;

  return orderModel
    .findAll()
    .map(attachCustomerData)
    .filter((order) => {
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }

      if (nameFilter) {
        const customerName = order.customer?.name || '';
        if (!customerName.toLowerCase().includes(nameFilter)) {
          return false;
        }
      }

      if (phoneFilter) {
        const customerPhone = (order.customer?.phone || '').replace(/\D/g, '');
        if (!customerPhone.includes(phoneFilter)) {
          return false;
        }
      }

      return true;
    });
};

exports.createOrder = async (payload) => {
  const items = validateOrderPayload(payload);
  const totals = calculateTotals(items, payload.taxRate, payload.discount);

  const order = {
    id: uuidv4(),
    customerId: payload.customerId,
    status: 'RECEIVED',
    items,
    notes: payload.notes || '',
    pickupDate: payload.pickupDate || null,
    deliveryDate: payload.deliveryDate || null,
    taxRate: Number(payload.taxRate) || 0,
    discount: Number(payload.discount) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...totals,
  };

  return orderModel.create(order);
};

exports.getOrderById = async (id) => {
  const order = orderModel.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }
  return attachCustomerData(order);
};

exports.updateOrder = async (id, updates) => {
  const existing = orderModel.findById(id);
  if (!existing) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  const updatedData = { ...existing, ...updates };

  if (updates.items) {
    updatedData.items = normalizeItems(updates.items);
  }

  if (updates.status) {
    updatedData.status = normalizeStatus(updates.status);
    if (!VALID_STATUSES.includes(updatedData.status)) {
      const error = new Error(`Invalid status; valid statuses are: ${VALID_STATUSES.join(', ')}`);
      error.status = 400;
      throw error;
    }
  }

  updatedData.taxRate = Number(updatedData.taxRate) || 0;
  updatedData.discount = Number(updatedData.discount) || 0;

  const totals = calculateTotals(updatedData.items, updatedData.taxRate, updatedData.discount);
  Object.assign(updatedData, totals);
  updatedData.updatedAt = new Date().toISOString();

  const order = orderModel.update(id, updatedData);
  return attachCustomerData(order);
};

exports.updateOrderStatus = async (id, status) => {
  if (!status) {
    const error = new Error('Status is required');
    error.status = 400;
    throw error;
  }

  const normalizedStatus = normalizeStatus(status);
  if (!VALID_STATUSES.includes(normalizedStatus)) {
    const error = new Error(`Invalid status; valid statuses are: ${VALID_STATUSES.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return exports.updateOrder(id, { status: normalizedStatus });
};

exports.deleteOrder = async (id) => {
  const order = orderModel.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }
  orderModel.delete(id);
};
