import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

const TablePagination = ({
  currentPage,
  totalPages,
  itemsName = 'items',
  showInfo,
  previousPage,
  canPreviousPage,
  pageCount,
  pageIndex,
  setPageIndex,
  nextPage,
  canNextPage
}) => {

  // Build page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // max page buttons (excluding ellipsis)

    if (pageCount <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 0; i < pageCount; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(0);

    let start = Math.max(1, pageIndex - 1);
    let end = Math.min(pageCount - 2, pageIndex + 1);

    // Adjust window so we always show at least 3 middle pages
    if (start <= 1) {
      end = Math.min(pageCount - 2, 3);
      start = 1;
    }
    if (end >= pageCount - 2) {
      start = Math.max(1, pageCount - 4);
      end = pageCount - 2;
    }

    if (start > 1) pages.push('ellipsis-start');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 2) pages.push('ellipsis-end');

    // Always show last page
    pages.push(pageCount - 1);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Row className={clsx('align-items-center text-center text-sm-start', showInfo ? 'justify-content-between' : 'justify-content-end')}>
      {showInfo && (
        <Col sm>
          <div className="text-muted">
            Showing page <span className="fw-semibold">{currentPage}</span> of <span className="fw-semibold">{totalPages}</span>
          </div>
        </Col>
      )}
      <Col sm="auto" className="mt-3 mt-sm-0">
        <div>
          <ul className="pagination pagination-boxed mb-0 justify-content-center">
            <li className="page-item">
              <button className="page-link" onClick={() => previousPage()} disabled={!canPreviousPage}>
                <TbChevronLeft />
              </button>
            </li>

            {pageNumbers.map((item, idx) => {
              if (typeof item === 'string') {
                return (
                  <li key={item} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
              return (
                <li key={item} className={`page-item ${pageIndex === item ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPageIndex(item)}>
                    {item + 1}
                  </button>
                </li>
              );
            })}

            <li className="page-item">
              <button className="page-link" onClick={() => nextPage()} disabled={!canNextPage}>
                <TbChevronRight />
              </button>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default TablePagination; 