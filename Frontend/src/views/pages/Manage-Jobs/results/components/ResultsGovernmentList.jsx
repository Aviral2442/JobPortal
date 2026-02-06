import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert, Spinner } from "react-bootstrap";
import TableList from "@/components/table/TableList";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
  TbDotsVertical,
  TbEdit,
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbEye,
} from "react-icons/tb";
import axios from "@/api/axios";
import { formatDate } from "@/components/DateFormat";

const ResultsGovernmentList = ({ isActive }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch results - government sector
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/job-categories/government_result_list`);
      console.log("Fetched government results:", res.data);
      const results = res.data?.jsonData?.resultData || res.data?.data || [];
      setJobs(results);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setMessage("Failed to fetch results.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchJobs();
    }
  }, [isActive]);

  const columns = [
    { title: "S.No", data: null, render: (data, type, row, meta) => meta.row + 1 },
    { title: "Job", data: "result_JobId.job_title" },
    { title: "Title", data: "result_Title" },
    { title: "Category", data: "result_JobId.job_category.category_name" },
    { title: "Job Type", data: "result_JobId.job_type.job_type_name" },
    { title: "Release Date", data: "result_ReleaseDate", render: (data) => {
      return formatDate(data);
    } },
    { title: "Created At", data: "result_CreatedAt", render: (data) => formatDate(data) },
    {
      title: "Actions",
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <Dropdown.Toggle variant="link" className="drop-arrow-none p-0">
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/result/view/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEye className="me-1" /> View
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/result/edit/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this result?")) return;
                  try {
                    await axios.delete(`/job-categories/delete_result/${rowData._id || rowData.id}`);
                    setMessage("Result deleted successfully!");
                    setVariant("success");
                    fetchJobs();
                  } catch (err) {
                    console.error(err);
                    setMessage("Failed to delete result");
                    setVariant("danger");
                  }
                }}
              >
                <TbTrash className="me-1" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Container fluid className="py-3">
      {message && <Alert variant={variant} onClose={() => setMessage("")} dismissible>{message}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <Col>
            <TableList
              ref={tableRef}
              data={jobs}
              columns={columns}
              options={{
                responsive: true,
                dom:
                  "<'d-md-flex justify-content-between align-items-center my-2'<'dt-buttons'B>f>" +
                  "rt" +
                  "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
                buttons: [
                  { extend: "copyHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "csvHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "excelHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "pdfHtml5", className: "btn btn-sm btn-secondary" },
                ],
                paging: true,
                language: {
                  paginate: {
                    first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft />),
                    previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft />),
                    next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight />),
                    last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight />),
                  },
                },
              }}
              className="table table-striped dt-responsive w-100"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ResultsGovernmentList;
