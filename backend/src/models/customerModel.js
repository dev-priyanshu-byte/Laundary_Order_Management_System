class CustomerModel {
  constructor() {
    this.customers = [];
  }

  findAll() {
    return this.customers;
  }

  findById(id) {
    return this.customers.find((customer) => customer.id === id);
  }

  create(customer) {
    this.customers.push(customer);
    return customer;
  }

  update(id, updates) {
    const customer = this.findById(id);
    if (!customer) return null;
    Object.assign(customer, updates);
    return customer;
  }

  delete(id) {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }
}

module.exports = new CustomerModel();
