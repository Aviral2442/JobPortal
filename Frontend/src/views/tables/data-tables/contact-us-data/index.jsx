import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactDOMServer from "react-dom/server";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import toast from "react-hot-toast";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";
import api from "@/api/axios";
import { formatDate } from "@/components/DateFormat";
import "@/global.css";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const escapeHtml = (value) => {
  if (!value) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const ContactUsList = ({ refreshFlag }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const tableRef = useRef(null);

  const fetchContactUsSubmissions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dynamic-content/get_contact_us_submissions");
      const submissionsData = response.data?.jsonData || response.data?.data || [];
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (error) {
      console.error("Error fetching contact us submissions:", error);
      setMessage("Error loading contact us submissions");
      setVariant("danger");
      toast.error("Failed to load contact us submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactUsSubmissions();
  }, [refreshFlag]);

  const columns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (data, type, row, meta) => {
        return meta.row + 1;
      },
    },
    {
      title: "Name",
      data: "name",
      render: (data) => data || "N/A",
    },
    {
      title: "Email",
      data: "email",
      render: (data) => data || "N/A",
    },
    {
      title: "Phone",
      data: "phone",
      render: (data) => data || "N/A",
    },
    {
      title: "Message",
      data: "message",
      render: (data) => {
        if (!data) return "N/A";
        const text = String(data);
        const shortText = text.length > 80 ? `${text.slice(0, 80)}...` : text;
        return `<span title="${escapeHtml(text)}">${escapeHtml(shortText)}</span>`;
      },
    },
    {
      title: "Submitted At",
      data: "createdAt",
      render: (data) => formatDate(data),
    },
  ];

  return (
    <Container fluid className="px-0">
      {message && (
        <Row>
          <Col>
            <Alert variant={variant} onClose={() => setMessage("")} dismissible>
              {message}
            </Alert>
          </Col>
        </Row>
      )}

      {loading ? (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <DataTable
              ref={tableRef}
              data={submissions}
              columns={columns}
              options={{
                responsive: true,
                searching: true,
                dom:
                  "<'d-md-flex justify-content-between align-items-center'<'dt-buttons'B>f>" +
                  "rt" +
                  "<'d-md-flex justify-content-between align-items-center'ip>",
                buttons: [
                  { extend: "copyHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "csvHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "excelHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "pdfHtml5", className: "btn btn-sm btn-secondary" },
                ],
                paging: true,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                order: [[5, "desc"]],
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

export default ContactUsList;