import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  if (orders.length === 0) {
    return <h2 className="text-center text-muted mt-5">📦 No past orders found...</h2>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">📜 Order History</h2>

      {orders.map((order) => (
        <div key={order.id} className="card mb-4 shadow-lg border-0 rounded-3">
          <div className="card-header bg-dark text-white d-flex justify-content-between">
            <h5>🆔 Order ID: {order.id}</h5>
            <small>📅 {order.date}</small>
          </div>

          <div className="card-body">
            <h6>🛒 Items:</h6>
            <ul className="list-group mb-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{item.name} (x{item.quantity})</span>
                  <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                </li>
              ))}
            </ul>

            <p>Total: <b>₹{order.total}</b></p>
            {order.buttonDiscount > 0 && <p>Manual Discount: -₹{order.buttonDiscount}</p>}
            {order.couponDiscount > 0 && <p>Coupon Discount: -₹{order.couponDiscount}</p>}
            <h5 className="text-success">💰 Final Paid: ₹{order.finalPrice}</h5>
            <p className="text-muted">Payment Method: {order.method}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
