const API_BASE = '/api';
const AUTH_HEADER = { Authorization: 'Bearer demo-token' };

const showMessage = (elementId, message) => {
  const element = document.getElementById(elementId);
  element.textContent = message;
};

const loadDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE}/dashboard`, { headers: AUTH_HEADER });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Failed to load dashboard');

    const data = result.data;
    document.getElementById('dashboard').innerHTML = `
      <p>Total orders: <strong>${data.totalOrders}</strong></p>
      <p>Total revenue: <strong>$${data.revenue.toFixed(2)}</strong></p>
      <p>Average order: <strong>$${data.averageOrderValue.toFixed(2)}</strong></p>
      <pre>${JSON.stringify(data.ordersPerStatus, null, 2)}</pre>
    `;
  } catch (error) {
    showMessage('filterMessage', error.message);
  }
};

const createCustomer = async () => {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  if (!name) return showMessage('customerMessage', 'Customer name is required.');

  try {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({ name, phone }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Failed to create customer');

    showMessage('customerMessage', `Customer created with ID ${result.data.id}`);
  } catch (error) {
    showMessage('customerMessage', error.message);
  }
};

const createOrder = async () => {
  const customerId = document.getElementById('orderCustomerId').value.trim();
  const name = document.getElementById('itemName').value.trim();
  const quantity = Number(document.getElementById('itemQuantity').value);
  const unitPrice = Number(document.getElementById('itemPrice').value);
  const taxRate = Number(document.getElementById('taxRate').value);
  const discount = Number(document.getElementById('discount').value);
  const notes = document.getElementById('orderNotes').value.trim();

  if (!customerId) return showMessage('orderMessage', 'Customer ID is required.');
  if (!name) return showMessage('orderMessage', 'Item name is required.');

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({
        customerId,
        items: [{ name, serviceType: 'dry-clean', quantity, unitPrice }],
        taxRate,
        discount,
        notes,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Failed to create order');

    showMessage('orderMessage', `Order created with ID ${result.data.id}`);
    loadOrders();
    loadDashboard();
  } catch (error) {
    showMessage('orderMessage', error.message);
  }
};

const loadOrders = async () => {
  try {
    const status = document.getElementById('filterStatus').value;
    const customerName = document.getElementById('filterCustomerName').value.trim();
    const customerPhone = document.getElementById('filterCustomerPhone').value.trim();

    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (customerName) params.append('customerName', customerName);
    if (customerPhone) params.append('customerPhone', customerPhone);

    const response = await fetch(`${API_BASE}/orders?${params.toString()}`, { headers: AUTH_HEADER });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Failed to load orders');

    const rows = result.data.map((order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer?.name || 'Unknown'}</td>
        <td>${order.customer?.phone || 'Unknown'}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td class="status ${order.status}">${order.status}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td><button onclick="changeStatus('${order.id}')">Change Status</button></td>
      </tr>
    `).join('');

    document.getElementById('ordersList').innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Total</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (error) {
    showMessage('filterMessage', error.message);
  }
};

const changeStatus = async (orderId) => {
  const status = prompt('Enter new status: RECEIVED, PROCESSING, READY, DELIVERED');
  if (!status) return;

  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Status update failed');

    showMessage('filterMessage', `Order ${orderId} status updated to ${result.data.status}`);
    loadOrders();
    loadDashboard();
  } catch (error) {
    showMessage('filterMessage', error.message);
  }
};

window.addEventListener('load', () => {
  loadOrders();
  loadDashboard();
});
