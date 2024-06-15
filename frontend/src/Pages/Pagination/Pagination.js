import React from "react";
import './Pagination.css'

const Pagination = ({
  page,
  totalPage,
  setPage,
}) => {
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
 
  return (
    <>
     <div className="pegination">
  <button
    disabled={page === 1}
    onClick={() => handlePageChange(page - 1)}
  >
    Previous
  </button>
  <span className="show-pages">
    Page {page} of {totalPage}
  </span>
  <button
    disabled={page === (totalPage === 0 ? 1 : totalPage)}
    onClick={() => handlePageChange(page + 1)}
  >
    Next
  </button>
    </div>

    </>
  );
};

 

export default Pagination