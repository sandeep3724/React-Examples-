import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VegCard from "./VegCard";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

function Nonveg() {
  useEffect(() => {
    localStorage.setItem("lastCategory", "/nonveg");
  }, []);

  const nonvegList = useSelector((state) => state.products.nonvegItems) || [];

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // 🔹 Reset to first page if list changes
  useEffect(() => {
    setCurrentPage(0);
  }, [nonvegList]);

  // 🔹 Slice items based on page
  const offset = currentPage * itemsPerPage;
  const currentItems = nonvegList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(nonvegList.length / itemsPerPage);

  // 🔹 Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 🟢 Toast when adding item (this will be passed to VegCard)
  const handleAddToCart = (itemName) => {
    toast.success(`🍗 ${itemName} added to cart!`, {
      position: "top-left",
      autoClose: 2000,
      theme: "colored",
    });
  };

  return (
    <div
      className="container-fluid min-vh-100 py-5"
      style={{
        marginTop: "70px",
        background: "linear-gradient(135deg, #fff5f5 0%, #ffd6d6 100%)",
      }}
    >
      <h2 className="mb-4 text-center fw-bold text-danger">🍗 Non-Veg Items</h2>

      {nonvegList.length === 0 ? (
        <p className="text-muted text-center">No non-veg items available</p>
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
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center mt-5 gap-2"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-danger text-danger fw-bold"
              }
              previousClassName={"page-item"}
              previousLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-danger text-danger fw-bold"
              }
              nextClassName={"page-item"}
              nextLinkClassName={
                "page-link shadow-sm rounded px-3 py-2 border-danger text-danger fw-bold"
              }
              activeClassName={"active bg-danger text-white border-0"}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Nonveg;
