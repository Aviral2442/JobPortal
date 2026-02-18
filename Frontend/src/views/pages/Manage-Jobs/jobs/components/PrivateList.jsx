import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import TableFilters from "@/components/table/TableFilters";
import TablePagination from "@/components/table/TablePagination";
import { useTableFilters } from "@/hooks/useTableFilters";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
  TbEdit,
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbEye,
} from "react-icons/tb";
import axios from "@/api/axios";
import toast from "react-hot-toast";
import { formatDate } from "@/components/DateFormat";
import { MdOutlineToggleOn, MdOutlineToggleOff } from "react-icons/md";
import jszip from "jszip";
import pdfmake from "pdfmake";
import DatatableActionButton from "@/components/DatatableActionButton";
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

const PrivateList = ({ isActive }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [localSearchInput, setLocalSearchInput] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

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

  // Handle status toggle
  const handleToggle = async (jobId, columnName, currentValue) => {
    try {
      let newValue;
      if (columnName === "job_status") {
        newValue = currentValue === 1 ? 0 : 1;
      } else {
        newValue = !currentValue;
      }

      await axios.post(`/job-categories/update_jobs_status/${jobId}`, {
        updateColumnName: columnName,
        updateValue: newValue,
      });

      toast.success(`${columnName} updated successfully`);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${columnName}`);
    }
  };

  // Fetch jobs with server-side filters & pagination
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = getFilterParams(PAGE_SIZE);
      const res = await axios.get(`/job-categories/private_sector_job_list`, { params });
      const data = res.data.jsonData;
      setJobs(data?.primateJobs || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setTotalPages(0);
      setMessage("Failed to fetch jobs.");
      toast.error("Failed to fetch jobs");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  }, [getFilterParams]);

  // Re-fetch when tab becomes active or filters/page change
  useEffect(() => {
    if (isActive) {
      fetchJobs();
    }
  }, [isActive, fetchJobs]);

  // Clear selection when data changes
  useEffect(() => {
    setSelectedRows([]);
  }, [jobs]);

  useEffect(() => {
    setLocalSearchInput(searchFilter ? String(searchFilter) : "");
  }, [searchFilter]);

  const handleSearchSubmit = () => {
    handleSearchFilterChange(localSearchInput);
    handlePageChange(0);
  }

  // Row selection helpers
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === jobs.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(jobs.map((j) => j._id));
    }
  };

  // Sync DOM checkboxes + row highlight whenever selectedRows changes
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
    const selectAll = document.getElementById('private-select-all');
    if (selectAll) {
      selectAll.checked = jobs.length > 0 && selectedRows.length === jobs.length;
    }
  }, [selectedRows, jobs]);

  const columns = [
    {
      title: `<input type="checkbox" class="row-select-cb" id="private-select-all" />`,
      data: null,
      orderable: false,
      searchable: false,
      className: "text-center",
      width: "40px",
      render: () => `<input type="checkbox" class="row-select-cb" />`,
    },
    {
      title: "S.No",
      data: null,
      orderable: false,
      render: (data, type, row, meta) => meta.row + 1 + currentPage * PAGE_SIZE,
    },
    { title: "Post Name", data: "job_title" },
    { title: "Organization", data: "job_organization" },
    { title: "Job Sector", data: "job_sector.job_sector_name" },
    { title: "Category", data: "job_category.category_name" },
    {
      title: "Date",
      data: "job_posted_date",
      render: (data) => formatDate(data),
    },
    {
      title: "Recommended",
      data: null,
      orderable: false,
      className: "text-center",
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        td.style.textAlign = "center";
        const root = createRoot(td);
        root.render(
          <button
            onClick={() =>
              handleToggle(rowData._id, "jobRecommendation", rowData.jobRecommendation)
            }
            className="border-0 bg-transparent p-0"
          >
            {rowData.jobRecommendation ? (
              <MdOutlineToggleOn size={24} color="green" />
            ) : (
              <MdOutlineToggleOff size={24} color="gray" />
            )}
          </button>
        );
      },
    },
    {
      title: "Featured",
      data: null,
      orderable: false,
      className: "text-center",
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        td.style.textAlign = "center";
        const root = createRoot(td);
        root.render(
          <button
            onClick={() =>
              handleToggle(rowData._id, "jobFeatured", rowData.jobFeatured)
            }
            className="border-0 bg-transparent p-0"
          >
            {rowData.jobFeatured ? (
              <MdOutlineToggleOn size={24} color="green" />
            ) : (
              <MdOutlineToggleOff size={24} color="gray" />
            )}
          </button>
        );
      },
    },
    {
      title: "Status",
      data: null,
      orderable: false,
      className: "text-center",
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        td.style.textAlign = "center";
        const root = createRoot(td);
        root.render(
          <button
            onClick={() =>
              handleToggle(rowData._id, "job_status", rowData.job_status)
            }
            className="border-0 bg-transparent p-0"
          >
            {rowData.job_status === 1 ? (
              <MdOutlineToggleOn size={24} color="green" />
            ) : (
              <MdOutlineToggleOff size={24} color="gray" />
            )}
          </button>
        );
      },
    },
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, _cellData, rowData) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="eye-icon"
              onClick={() =>
                navigate(`/admin/jobs/view/${rowData._id || rowData.id}`, {
                  state: rowData,
                })
              }
            >
              <TbEye />
            </button>
            <button
              className="edit-icon"
              onClick={() =>
                navigate(`/admin/jobs/edit/${rowData._id || rowData.id}`, {
                  state: rowData,
                })
              }
            >
              <TbEdit />
            </button>
            <button
              className="remark-icon"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this job?"))
                  return;
                try {
                  await fetch(
                    `${BASE_URL}/api/jobs/${rowData._id || rowData.id}`,
                    { method: "DELETE" }
                  );
                  setMessage("Job deleted successfully!");
                  setVariant("success");
                  fetchJobs();
                } catch (err) {
                  console.error(err);
                  setMessage("Failed to delete job");
                  setVariant("danger");
                }
              }}
            >
              <TbTrash />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Container fluid className="py-0">
      {message && (
        <Alert variant={variant} onClose={() => setMessage("")} dismissible>
          {message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-2 m-0 borderBottom">
            <DatatableActionButton
              endpoint="/job-categories/private_sector_job_list"
              dataAccess="primateJobs"
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

            {/* RIGHT: Search */}
            <div className="">
              {/* <label className="mb-0 ">Search:</label> */}
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

          {/* Bulk action toolbar */}
          <BulkActionToolbar
            selectedIds={selectedRows}
            onActionComplete={fetchJobs}
            onClearSelection={() => setSelectedRows([])}
          />

          <Col className="overflow-x-scroll">
            <DataTable
              ref={tableRef}
              data={jobs}
              columns={columns}
              options={{
                responsive: true,
                searching: false,
                layout: {
                  topStart: null,
                },
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
                  tableEl.removeEventListener("click", tableEl._privateCbHandler);
                  tableEl._privateCbHandler = (e) => {
                    const cb = e.target.closest('.row-select-cb');
                    if (!cb) return;
                    if (cb.id === 'private-select-all') {
                      toggleAllRows();
                      return;
                    }
                    const tr = cb.closest('tr');
                    if (!tr) return;
                    const rowData = tableRef.current?.dt()?.row(tr)?.data();
                    if (rowData?._id) toggleRow(rowData._id);
                  };
                  tableEl.addEventListener("click", tableEl._privateCbHandler);
                },
              }}
              className="table table-striped dt-responsive w-100"
            />

            {/* Server-side pagination */}
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

export default PrivateList;