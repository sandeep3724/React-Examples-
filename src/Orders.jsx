import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Safely calculate max savings
  const maxSavings =
    orders.length > 0
      ? Math.max(...orders.map((o) => o.totalDiscount || 0))
      : 0;

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    const modal = new window.bootstrap.Modal(
      document.getElementById("orderDetailsModal")
    );
    modal.show();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "In Progress":
        return "badge bg-warning text-dark";
      case "Confirmed":
        return "badge bg-secondary";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-info";
    }
  };

  if (orders.length === 0) {
    return (
      <div
      
        className="container d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
         <img 
      src="/order.svg"   // 👈 replace with your image path
      alt="No Orders"
      style={{ width: "250px", maxWidth: "100%", marginBottom: "20px" }}
    />
        <h2 className="text-muted mb-3">📦 No past orders found...</h2>
        <a href="/" className="btn btn-lg btn-warning shadow-sm fw-semibold">
          🛒 Shop Now
        </a>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <h2 className="text-center text-primary fw-bold mb-5">📜 Orders History</h2>

      {orders.map((order) => {
        const totalDiscount = order.totalDiscount || 0;
        const isBestDeal = totalDiscount === maxSavings && maxSavings > 0;

        return (
          <div
            key={order.id}
            className={`card mb-4 shadow-lg border-0 rounded-4 overflow-hidden ${
              isBestDeal ? "border border-warning border-3" : ""
            }`}
          >
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <div>
               
                <h6 className="mb-1 fw-semibold">
                  🆔 Order ID: {order.id || "N/A"}{" "}
                  <span className={getStatusBadge(order.status)}>
                    Order Completed
                  </span>
                </h6>
                <small className="text-light">
                  📅 Date: {formatDate(order.date)} /⏰ Time {formatTime(order.date)}
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-info rounded-pill fw-semibold"
                onClick={() => handleViewDetails(order)}
              >
                🔍 View Details
              </button>
            </div>

            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h6 className="text-success fw-bold mb-2 mb-md-0">
                  💰 Final Price: ₹
                  {(order.finalPrice || order.total || 0).toFixed(2)}
                </h6>
                {totalDiscount > 0 && (
                  <span
                    className={`badge fw-semibold ms-0 ms-md-3 ${
                      isBestDeal ? "bg-warning text-dark" : "bg-success"
                    }`}
                  >
                    🎉 Savings: ₹{totalDiscount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal for order details */}
      <div
        className="modal fade"
        id="orderDetailsModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            {selectedOrder && (
              <>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    📦 Order #{selectedOrder.id}{" "}
                    <span className={getStatusBadge(selectedOrder.status)}>
                      Confirmed
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <p>
                      <b>🆔 Order ID:</b> {selectedOrder.id}
                    </p>
                    <p>
                      <b>📅 Date:</b> {formatDate(selectedOrder.date)}
                    </p>
                    <p>
                      <b>⏰ Time:</b> {formatTime(selectedOrder.date)}
                    </p>
                    <p>
                      <b>📌 Status:</b>{" "}
                      <span className={getStatusBadge(selectedOrder.status)}>
                      Confirmed
                      </span>
                    </p>
                  </div>

                  <table className="table table-bordered table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {item.quantity}
                            </span>
                          </td>
                          <td>₹{item.price}</td>
                          <td className="fw-semibold text-success">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold mb-3">💰 Payment Summary</h6>
                    <p>
                      <b>Subtotal:</b> ₹
                      {(
                        selectedOrder.subtotal ||
                        selectedOrder.total ||
                        0
                      ).toFixed(2)}
                    </p>
                    {selectedOrder.manualDiscount > 0 && (
                      <p className="text-success fw-bold">
                        🏷️ Manual Discount: -₹
                        {selectedOrder.manualDiscount.toFixed(2)}
                      </p>
                    )}
                    {selectedOrder.couponDiscount > 0 && (
                      <p className="text-success fw-bold">
                        🎟️ Coupon Discount: -₹
                        {selectedOrder.couponDiscount.toFixed(2)}
                      </p>
                    )}
                    {selectedOrder.totalDiscount > 0 && (
                      <p
                        className={`text-success fw-bold fs-5 ${
                          selectedOrder.totalDiscount === maxSavings
                            ? "text-warning"
                            : ""
                        }`}
                      >
                        🎉 Total Savings: ₹
                        {selectedOrder.totalDiscount.toFixed(2)}
                      </p>
                    )}
                    <h4 className="text-danger fw-bold mt-3 text-end">
                      Final Price: ₹
                      {(
                        selectedOrder.finalPrice ||
                        selectedOrder.total ||
                        0
                      ).toFixed(2)}
                    </h4>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
