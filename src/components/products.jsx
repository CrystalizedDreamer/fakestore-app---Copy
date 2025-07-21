import React, { useState, useEffect } from "react";
function Products() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => setEditMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

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

                  <button className="btn btn-primary btn-sm w-100">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {modalProduct && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalProduct.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalProduct(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={modalProduct.image}
                  alt={modalProduct.title}
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                  className="mb-3"
                />
                <p>
                  <strong>Price:</strong> ${modalProduct.price}
                </p>
                <p>
                  <strong>Category:</strong> {modalProduct.category}
                </p>
                <p>{modalProduct.description}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editProduct && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form
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
                  } catch {
                    alert("Error updating product.");
                  }
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditProduct(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, price: e.target.value }))
                      }
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      className="form-control"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, category: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      className="form-control"
                      value={editForm.image}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, image: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditProduct(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this product?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={async () => {
                    try {
                      await fetch(
                        `https://fakestoreapi.com/products/${editProduct.id}`,
                        { method: "DELETE" }
                      );
                      setProducts(
                        products.filter((p) => p.id !== editProduct.id)
                      );
                      setEditProduct(null);
                      setEditMessage("Product deleted successfully!");
                    } catch {
                      alert("Error deleting product.");
                    }
                    setShowDeleteConfirm(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
