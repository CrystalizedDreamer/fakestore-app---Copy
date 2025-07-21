
import React, { useState } from "react";
import { useCart } from './CartContext';
import { useQuery } from '@tanstack/react-query';
import ProductDetailsModal from './ProductDetailsModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';



function Products() {
  const { addToCart, cart, removeFromCart, clearCart } = useCart();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // React Query for products
  const { data: products = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  React.useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => setEditMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  if (loading) return <div id="loading">Loading...</div>;

  return (
    <div className="container my-4">
      {editMessage && (
        <div className="alert alert-success text-center" role="alert">
          {editMessage}
        </div>
      )}
      <div className="row">
        {products.map((product) => (
          <div
            className="col-12 col-sm-6 col-md-3 mb-4 mt-4 pt-2 pb-2"
            key={product.id}
          >
            <div className="card h-100" id="productCard">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
              />
              <div className="cardBody">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <p className="card-text">{product.category}</p>
                <p className="card-text" style={{ fontSize: "0.9em" }}>
                  {product.description.substring(0, 80)}...
                </p>
                <div className="d-flex flex-column gap-2 mt-auto">
                  <button
                    className="btn btn-outline-warning w-100"
                    onClick={() => {
                      setEditProduct(product);
                      setEditForm({
                        title: product.title,
                        price: product.price,
                        category: product.category,
                        description: product.description,
                        image: product.image,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={() => setModalProduct(product)}
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() =>addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Product Details Modal */}
      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
      {/* Edit Product Modal */}
      <EditProductModal
        editProduct={editProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditProduct(null)}
        onDelete={() => setShowDeleteConfirm(true)}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await fetch(
              `https://fakestoreapi.com/products/${editProduct.id}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  ...editForm,
                  price: parseFloat(editForm.price),
                }),
                headers: { "Content-Type": "application/json" },
              }
            );
            setEditProduct(null);
            setEditForm({
              title: "",
              price: "",
              category: "",
              description: "",
              image: "",
            });
            setEditMessage("Product updated successfully!");
            refetch();
          } catch {
            alert("Error updating product.");
          }
        }}
      />
      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={async () => {
          try {
            await fetch(
              `https://fakestoreapi.com/products/${editProduct.id}`,
              { method: "DELETE" }
            );
            setEditProduct(null);
            setEditMessage("Product deleted successfully!");
            refetch();
          } catch {
            alert("Error deleting product.");
          }
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}

export default Products;
