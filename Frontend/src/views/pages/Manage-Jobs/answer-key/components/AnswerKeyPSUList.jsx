import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import TableFilters from "@/components/table/TableFilters";
import TablePagination from "@/components/table/TablePagination";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  TbEdit,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbEye,
} from "react-icons/tb";
import axios from "@/api/axios";
import { formatDate } from "@/components/DateFormat";
import toast from "react-hot-toast";
import jszip from "jszip";
import pdfmake from "pdfmake";
import DatatableActionButton from "../../../../../components/DatatableActionButton";
import BulkActionToolbar from "@/components/table/BulkActionToolbar";
import "@/global.css";

DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);
DataTable.use(DT);

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "Active", value: "0" },
  { label: "Inactive", value: "1" },
];

const AnswerKeyPSUList = ({ isActive }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [selectedRows, setSelectedRows] = useState([]);
  const [localSearchInput, setLocalSearchInput] = useState("");
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const jobsRef = useRef([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    dateFilter,
    statusFilter,
    dateRange,
    searchFilter,
    currentPage,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePageChange,
    getFilterParams,
    handleSearchFilterChange,
  } = useTableFilters();

  // Fetch answer keys - PSU sector
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = getFilterParams(PAGE_SIZE);
      const res = await axios.get(`/job-categories/psu_answer_key_list`, { params });
      console.log("Fetched PSU answer keys:", res.data);
      const data = res.data?.jsonData;
      setJobs(data?.answerKeyData || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setTotalPages(0);
      setMessage("Failed to fetch answer keys.");
      toast.error("Failed to fetch answer keys.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  }, [getFilterParams]);

  useEffect(() => {
    if (isActive) {
      fetchJobs();
    }
  }, [isActive, fetchJobs]);

  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  useEffect(() => {
    setSelectedRows([]);
  }, [jobs]);

  useEffect(() => {
    setLocalSearchInput(searchFilter ? String(searchFilter) : "");
  }, [searchFilter]);

  const handleSearchSubmit = () => {
    handleSearchFilterChange(localSearchInput);
    handlePageChange(0);
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) => {
      const currentJobs = jobsRef.current;
      if (prev.length === currentJobs.length && currentJobs.length > 0) {
        return [];
      } else {
        return currentJobs.map((j) => j._id);
      }
    });
  };

  useEffect(() => {
    const table = tableRef.current?.dt();
    if (!table) return;
    table.rows().every(function () {
      const data = this.data();
      const node = this.node();
      if (!data || !node) return;
      const cb = node.querySelector('.row-select-cb');
      const isSelected = selectedRows.includes(data._id);
      if (cb) cb.checked = isSelected;
      if (isSelected) node.classList.add('selected-row');
      else node.classList.remove('selected-row');
    });
    const selectAll = document.getElementById('psu-answerkey-select-all');
    if (selectAll) {
      selectAll.checked = jobs.length > 0 && selectedRows.length === jobs.length;
    }
  }, [selectedRows, jobs]);

  const columns = [
    {
      title: `<input type="checkbox" class="row-select-cb" id="psu-answerkey-select-all" />`,
      data: null,
      orderable: false,
      searchable: false,
      className: "text-center",
      width: "10px",
      render: () => `<input type="checkbox" class="row-select-cb" />`,
    },
    {
      title: "S.No",
      data: null,
      orderable: false,
      render: (data, type, row, meta) => meta.row + 1 + currentPage * PAGE_SIZE,
    },
    { title: "Job", data: "answerKey_JobId.job_title" },
    { title: "Title", data: "answerKey_Title" },
    { title: "Category", data: "answerKey_JobId.job_category.category_name" },
    { title: "Job Type", data: "answerKey_JobId.job_type.job_type_name" },
    { title: "Release Date", data: "answerKey_ReleaseDate", render: (data) => formatDate(data) },
    { title: "Created At", data: "answerKey_CreatedAt", render: (data) => formatDate(data) },
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="eye-icon"
              onClick={() =>
                navigate(`/admin/answer-key/view/${rowData._id || rowData.id}`, { state: rowData })
              }
            >
              <TbEye />
            </button>
            <button
              className="edit-icon"
              onClick={() =>
                navigate(`/admin/answer-key/edit/${rowData._id || rowData.id}`, { state: rowData })
              }
            >
              <TbEdit />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Container fluid className="py-0">
      {message && <Alert variant={variant} onClose={() => setMessage("")} dismissible>{message}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-2 m-0 borderBottom">
            <DatatableActionButton
              endpoint="/job-categories/psu_answer_key_list"
              dataAccess="answerKeyData"
            />
            <div className="">
              <TableFilters
                dateFilter={dateFilter}
                statusFilter={statusFilter}
                dateRange={dateRange}
                onDateFilterChange={handleDateFilterChange}
                onStatusFilterChange={handleStatusFilterChange}
                onDateRangeChange={handleDateRangeChange}
                statusOptions={STATUS_OPTIONS}
                showDateFilter
                showDateRange
                showStatusFilter
              />
            </div>

            <div className="">
              <input
                className="form-control form-control-sm"
                style={{ width: 220 }}
                placeholder="Search..."
                value={localSearchInput}
                onChange={(e) => {
                  setLocalSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
              />
            </div>
          </div>

          <BulkActionToolbar
            selectedIds={selectedRows}
            onActionComplete={fetchJobs}
            onClearSelection={() => setSelectedRows([])}
          />

          <Col className="overflow-x-scroll fs-5">
            <DataTable
              ref={tableRef}
              data={jobs}
              columns={columns}
              options={{
                responsive: true,
                searching: false,
                layout: { topStart: null },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  { extend: "csv", className: "btn btn-sm btn-secondary" },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  { extend: "pdf", className: "btn btn-sm btn-secondary" },
                ],
                paging: false,
                ordering: true,
                info: false,
                language: {
                  paginate: {
                    first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft />),
                    previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft />),
                    next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight />),
                    last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight />),
                  },
                },
                drawCallback: function () {
                  const tableEl = tableRef.current?.dt()?.table().node();
                  if (!tableEl) return;
                  tableEl.removeEventListener("click", tableEl._psuAkCbHandler);
                  tableEl._psuAkCbHandler = (e) => {
                    const cb = e.target.closest('.row-select-cb');
                    if (!cb) return;
                    if (cb.id === 'psu-answerkey-select-all') {
                      toggleAllRows();
                      return;
                    }
                    const tr = cb.closest('tr');
                    if (!tr) return;
                    const rowData = tableRef.current?.dt()?.row(tr)?.data();
                    if (rowData?._id) toggleRow(rowData._id);
                  };
                  tableEl.addEventListener("click", tableEl._psuAkCbHandler);
                },
              }}
              className="table table-striped dt-responsive w-100"
            />

            {totalPages > 0 && (
              <TablePagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                showInfo
                previousPage={() => handlePageChange(currentPage - 1)}
                canPreviousPage={currentPage > 0}
                pageCount={totalPages}
                pageIndex={currentPage}
                setPageIndex={(index) => handlePageChange(index)}
                nextPage={() => handlePageChange(currentPage + 1)}
                canNextPage={currentPage < totalPages - 1}
              />
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AnswerKeyPSUList;
