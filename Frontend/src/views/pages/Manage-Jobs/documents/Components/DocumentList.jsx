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

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/jobs`);
      console.log("Fetched jobs:", res.data);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setMessage("Failed to fetch jobs.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const columns = [
    { title: "Post Name", data: "postName" },
    { title: "Organization", data: "organization" },
    { title: "Job Type", data: "jobType" },
    { title: "Category", data: "jobCategory" },
    { title: "Location", data: "jobLocation" },
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
                  navigate(`/admin/jobs/view/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEye className="me-1" /> View
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/jobs/edit/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this job?")) return;
                  try {
                    await fetch(`${BASE_URL}/api/jobs/${rowData._id || rowData.id}`, { method: "DELETE" });
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

export default JobList;
