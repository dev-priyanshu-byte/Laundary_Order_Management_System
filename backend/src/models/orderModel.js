// This model is a placeholder. Replace with a real DB schema or ORM model.

class OrderModel {
  constructor() {
    this.orders = [];
  }

  findAll() {
    return this.orders;
  }

  findById(id) {
    return this.orders.find((order) => order.id === id);
  }

  create(order) {
    this.orders.push(order);
    return order;
  }

  update(id, updates) {
    const order = this.findById(id);
    if (!order) return null;
    Object.assign(order, updates);
    return order;
  }

  delete(id) {
    this.orders = this.orders.filter((order) => order.id !== id);
  }
}

module.exports = new OrderModel();
