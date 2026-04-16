const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');

exports.listCustomers = async () => customerModel.findAll();

exports.createCustomer = async (payload) => {
  const customer = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...payload,
  };
  return customerModel.create(customer);
};

exports.getCustomerById = async (id) => {
  const customer = customerModel.findById(id);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  return customer;
};

exports.updateCustomer = async (id, updates) => {
  const customer = customerModel.update(id, updates);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  return customer;
};

exports.deleteCustomer = async (id) => {
  const customer = customerModel.findById(id);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  customerModel.delete(id);
};
