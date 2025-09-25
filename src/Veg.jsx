import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VegCard from "./VegCard";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

function Veg() {
  useEffect(() => {
    localStorage.setItem("lastCategory", "/veg");
  }, []);

  const vegList = useSelector((state) => state.products.vegItems) || [];

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // 🔹 Reset to first page if list changes
  useEffect(() => {
    setCurrentPage(0);
  }, [vegList]);

  // 🔹 Slice the products based on current page
  const offset = currentPage * itemsPerPage;
  const currentItems = vegList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(vegList.length / itemsPerPage);

  // 🔹 Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 🟢 Toast when adding item (this will be passed to VegCard)
  const handleAddToCart = (itemName) => {
    toast.success(`🥦 ${itemName} added to cart!`, {
      position: "top-right ",
      autoClose: 2000,
      theme: "colored",
    });
  };

  return (
    <div
      className="container-fluid min-vh-100 py-5"
      style={{
        marginTop: "70px",
        background: "linear-gradient(135deg, #f0fff4ff 0%, #d4f5d6 100%)",
      }}
    >
      <h2 className="mb-4 text-center fw-bold text-success">🥦 Fresh Veg Items</h2>

      {vegList.length === 0 ? (
        <p className="text-muted text-center">No veg items available..</p>
      ) : (
        <>
          <div className="row g-4 justify-content-center">
            {currentItems.map((item) => (
              <VegCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* 🔹 Pagination Controls */}
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center mt-5 gap-2"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-success text-success fw-bold"
              }
              previousClassName={"page-item"}
              previousLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-success text-success fw-bold"
              }
              nextClassName={"page-item"}
              nextLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-success text-success fw-bold"
              }
              activeClassName={"active bg-success text-white border-0"}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Veg;
