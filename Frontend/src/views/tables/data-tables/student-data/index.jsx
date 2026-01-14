import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert, Spinner, Badge } from "react-bootstrap";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
  TbDotsVertical,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbEye,
} from "react-icons/tb";
import axios from "@/api/axios";
import toast from "react-hot-toast";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";
import { formatDate } from "@/components/DateFormat";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const StudentList = ({ refreshFlag }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch students data
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/student/students_list");
      const studentsData = response.data?.jsonData?.students || response.data?.data || [];
      console.log("Fetched students:", studentsData);

      setStudents(studentsData);
      toast.success("Students loaded successfully");
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("Error loading students");
      setVariant("danger");
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshFlag]);

  // Handle view student details
  const handleView = (student) => {
    navigate(`/admin/students/view/${student._id}`);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return '<span class="badge badge-label badge-soft-success">Active</span>';
      case "inactive":
        return '<span class="badge badge-label badge-soft-warning">Inactive</span>';
      case "blocked":
        return '<span class="badge badge-label badge-soft-danger">Blocked</span>';
      default:
        return '<span class="badge badge-label badge-soft-secondary">Unknown</span>';
    }
  };

  const columns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (data, type, row, meta) => {
        // Determine total records (handles client/server-side)
        const totalRecords =
          (typeof meta.settings.fnRecordsDisplay === "function"
            ? meta.settings.fnRecordsDisplay()
            : meta.settings._iRecordsDisplay) || meta.settings._iRecordsTotal || 0;

        // Calculate current global index (0-based)
        const currentIndex = meta.settings._iDisplayStart + meta.row;

        // Return reversed serial number (descending)
        return totalRecords - currentIndex;
      },
    },
    {
      title: "Profile",
      data: "studentProfilePic",
      orderable: false,
      render: (data) => {
        if (data) {
          return `<img src="${BASE_URL}${data}" alt="Profile" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;" />`;
        }
        return `<div style="width: 20px; height: 20px; border-radius: 50%; background: #e9ecef; display: flex; align-items: center; justify-content: center;">
                  <i class="ti ti-user"></i>
                </div>`;
      },
    },
    {
      title: "Name",
      data: "studentFirstName",
      render: (data, type, row) => {
        return `${row.studentFirstName || ''} ${row.studentLastName || ''}`;
      },
    },
    {
      title: "Email",
      data: "studentEmail",
    },
    {
      title: "Mobile",
      data: "studentMobileNo",
    },
    {
      title: "Sector",
      data: "studentJobSector",
      render: (data) => data?.job_sector_name || "N/A",
    },
    {
        title: "Date Created",
        data: "studentCreatedAt",
        render: (data) => formatDate(data),
    },
    {
      title: "Status",
      data: "accountStatus",
      render: (data) => getStatusBadge(data),
    },
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, cellData, rowData) => {
        const root = createRoot(td);
        root.render(
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="drop-arrow-none fs-xxl link-reset p-0"
            >
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleView(rowData)}>
                <TbEye className="me-2" />
                View Details
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/admin/student/detail/${rowData._id}`)}>
                <TbEye className="me-2" />
                View Wizard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Container fluid className="px-0">
      {message && (
        <Row>
          <Col>
            <Alert
              variant={variant}
              onClose={() => setMessage("")}
              dismissible
            >
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
              data={students}
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
                order: [[8, "desc"]], // Sort by date created
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

export default StudentList;