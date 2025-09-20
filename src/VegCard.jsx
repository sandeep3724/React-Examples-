import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./store";
import { toast } from "react-toastify"; // ✅ Import toast

function VegCard({ item }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(` ${item.name} added to cart!`);
  };

  return (
    <div className="col-md-3 col-sm-6">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={item.image}
          alt={item.name}
          className="card-img-top"
          style={{ height: "120px", objectFit: "contain" }}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text text-truncate-multiline">{item.description}</p>
          <h6 className="price-tag fw-bold text-success">₹ {item.price}</h6>
          <button className="btn btn-success w-100" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default VegCard;
