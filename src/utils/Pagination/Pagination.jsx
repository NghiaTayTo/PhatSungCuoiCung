import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import './Pagination.css';

const Pagination = ({ totalPages, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (page) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageClick(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageClick(currentPage + 1);
        }
    };

    const getPaginationItems = () => {
        const paginationItems = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                paginationItems.push(
                    <button
                        key={i}
                        className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (startPage === 1) {
                endPage = 5;
            } else if (endPage === totalPages) {
                startPage = totalPages - 4;
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationItems.push(
                    <button
                        key={i}
                        className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </button>
                );
            }

            if (startPage > 1) {
                paginationItems.unshift(<span key="ellipsis-start" className="ellipsis">...</span>);
            }
            if (endPage < totalPages) {
                paginationItems.push(<span key="ellipsis-end" className="ellipsis">...</span>);
            }

            if (endPage < totalPages) {
                paginationItems.push(
                    <button
                        key={totalPages}
                        className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                        onClick={() => handlePageClick(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            }
        }
        return paginationItems;
    };

    return (
        <div className="pagination">
            <FontAwesomeIcon
                className="pagination-icon"
                icon={faAngleLeft}
                onClick={handlePreviousPage} // Gọi hàm khi nhấn nút Trang trước
                style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed', opacity: currentPage > 1 ? 1 : 0.5 }}
            />
            {getPaginationItems()}
            <FontAwesomeIcon
                className="pagination-icon"
                icon={faAngleRight}
                onClick={handleNextPage} // Gọi hàm khi nhấn nút Trang tiếp theo
                style={{ cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', opacity: currentPage < totalPages ? 1 : 0.5 }}
            />
        </div>
    );
};

export default Pagination;
