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

const AnswerKeyGovernmentList = ({ isActive }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch answer keys - government sector
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/job-categories/government_answer_key_list`);
      console.log("Fetched government answer keys:", res.data);
      const answerKeys = res.data?.jsonData?.answerKeyData || res.data?.data || [];
      setJobs(answerKeys);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setMessage("Failed to fetch answer keys.");
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
    { title: "Job", data: "answerKey_JobId.job_title" },
    { title: "Title", data: "answerKey_Title" },
    { title: "Category", data: "answerKey_JobId.job_category.category_name" },
    { title: "Job Type", data: "answerKey_JobId.job_type.job_type_name" },
    { title: "Release Date", data: "answerKey_ReleaseDate", render: (data) => {
      return formatDate(data);
    } },
    { title: "Created At", data: "answerKey_CreatedAt", render: (data) => formatDate(data) },
    // { title: "Description", data: "answerKey_Desc" },
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
                  navigate(`/admin/answer-key/view/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEye className="me-1" /> View
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/answer-key/edit/${rowData._id || rowData.id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this answer key?")) return;
                  try {
                    await axios.delete(`/job-categories/delete_answer_key/${rowData._id || rowData.id}`);
                    setMessage("Answer key deleted successfully!");
                    setVariant("success");
                    fetchJobs();
                  } catch (err) {
                    console.error(err);
                    setMessage("Failed to delete answer key");
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

export default AnswerKeyGovernmentList;
