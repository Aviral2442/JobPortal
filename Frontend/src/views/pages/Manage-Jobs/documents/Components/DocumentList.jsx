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
import "@/global.css";

const DocumentList = () => {
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch document
  const fetchdocument = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/job-categories/get_document_list");
      console.log("Fetched document:", res.data?.jsonData?.documentData);
      setDocument(res.data?.jsonData?.documentData);
    } catch (err) {
      console.error(err);
      setDocument([]);
      setMessage("Failed to fetch document.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdocument();
  }, []);

  const columns = [
    { title: "S.No.", data: null, render: (data, type, row, meta) => meta.row + 1 },
    { title: "Title", data: "document_title" },
    { title: "Desc", data: "document_short_desc" },
    {
      title: "Date", data: "document_posted_date",
      render: (data) => {
        return formatDate(data);
      }
    },
    {
      title: "Status", data: "document_status",
      render: (data) => {
        switch (data) {
          case 0: return `<span class="badge badge-label badge-soft-success">Active</span>`;
          case 1: return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
          default: return `<span class="badge badge-label badge-soft-secondary">Unknown</span>`;
        }
      }
    },
    {
      title: "Actions",
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="eye-icon"
              onClick={() =>
                navigate(`/admin/documents/view/${rowData._id || rowData.id}`, { state: rowData })
              }
            >
              <TbEye className="" />
            </button>
            <button
              className="edit-icon"
              onClick={() =>
                navigate(`/admin/documents/edit/${rowData._id || rowData.id}`, { state: rowData })
              }
            >
              <TbEdit className="" />
            </button>
          </div>
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
              data={document}
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

export default DocumentList;
