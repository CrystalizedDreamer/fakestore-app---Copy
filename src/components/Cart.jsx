import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store';

// Displays the items currently in the cart
export default function Cart() {
  // Get cart state and actions from the cart context
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  // If the cart is empty, show a message
  if (cart.length === 0) {
    return <div className="container my-4"><h4>Your cart is empty.</h4></div>;
  }

  return (
    <div className="container my-4">
      <h4>Your Cart</h4>
      {/* List all items in the cart */}
      <ul className="list-group mb-3">
        {cart.map((item, idx) => (
          <li key={item.id + '-' + idx} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.title}</strong> <span className="text-muted">${item.price}</span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {/* Button to clear the entire cart */}
      <button className="btn btn-warning" onClick={() => dispatch(clearCart())}>
        Clear Cart
      </button>
    </div>
  );
}
