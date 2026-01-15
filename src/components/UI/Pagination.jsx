import React from 'react';
import './Pagination.css';

/**
 * Pagination - Generisk pagination-komponent för att navigera mellan sidor
 * 
 * Props:
 * - currentPage: number - Aktuell sida (1-indexed)
 * - totalPages: number - Totalt antal sidor
 * - onPageChange: (pageNumber) => void - Callback när sidan ändras
 * - itemsPerPage: number (optional) - Antal items per sida (för information)
 */
function Pagination({ currentPage = 1, totalPages = 1, onPageChange, itemsPerPage = 10 }) {
  // Generera array av sidnummer att visa
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Visa max 5 sidnummer
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Justera startPage om vi är nära slutet
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();
  const startPage = pageNumbers[0] || 1;
  const endPage = pageNumbers[pageNumbers.length - 1] || 1;

  return (
    <div className="pagination-container">
      
      <div className="pagination-info">
        <span className="info-text">
          Sida {currentPage} av {totalPages}
        </span>
      </div>

      {/* Navigation */}
      <div className="pagination-nav">
        {/* Previous Button */}
        <button
          className="pagination-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Föregående sida"
        >
          <i className="fa-solid fa-chevron-left"></i>
          <span>Föregående</span>
        </button>

        
        <div className="pagination-numbers">
          {/* First page button if not shown */}
          {startPage > 1 && (
            <>
              <button
                className="pagination-btn page-btn"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="pagination-dots">...</span>}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              className={`pagination-btn page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Gå till sida ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page button if not shown */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="pagination-dots">...</span>}
              <button
                className="pagination-btn page-btn"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          className="pagination-btn next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Nästa sida"
        >
          <span>Nästa</span>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
