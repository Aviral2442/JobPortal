import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert, Spinner, Badge } from "react-bootstrap";
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
import toast from "react-hot-toast";
import { formatDate } from "@/components/DateFormat";
import ComponentCard from "@/components/ComponentCard";

const AppliedOnList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // Fetch applied jobs list
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/job-categories/job_applied_list_of_students`);
      console.log("Fetched applications:", res.data);
      setApplications(res.data.jsonData?.data || []);
      toast.success("Applications fetched successfully");
    } catch (err) {
      console.error(err);
      setApplications([]);
      setMessage("Failed to fetch applications.");
      toast.error("Failed to fetch applications");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const statusColors = {
      applied: "primary",
      shortlisted: "info",
      interview: "warning",
      selected: "success",
      rejected: "danger",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status?.toUpperCase() || "N/A"}
      </Badge>
    );
  };

  const columns = [
    {
        title: "S.No",
        data: null,
        render: (data, type, row, meta) => {
          return meta.row + 1;
        }
    },
    { 
      title: "S_Name", 
      data: null,
      render: (data, type, row) => {
        return `${row.studentId?.studentFirstName || ""} ${row.studentId?.studentLastName || ""}`;
      }
    },
    { 
      title: "Email", 
      data: null,
      defaultContent: "",
      render: (data, type, row) => {
        return row.studentId?.studentEmail || "";
      }
    },
    { 
      title: "Job Title", 
      data: null,
      defaultContent: "",
      render: (data, type, row) => {
        return row.jobId?.job_title || "";
      }
    },
    { 
      title: "Category", 
      data: null,
      defaultContent: "",
      render: (data, type, row) => {
        return row.jobId?.job_category?.category_name || "";
      }
    },
    { 
      title: "Job Sector", 
      data: null,
      defaultContent: "",
      render: (data, type, row) => {
        return row.jobId?.job_sector?.job_sector_name || "";
      }
    },
    { 
      title: "Applied Date", 
      data: "appliedAt",
      render: (data) => {
        return formatDate(data);
      }
    },
    // {
    //   title: "Status",
    //   data: null,
    //   orderable: false,
    //   createdCell: (td, cellData, rowData) => {
    //     td.innerHTML = "";
    //     const root = createRoot(td);
    //     root.render(getStatusBadge(rowData.applicationStatus));
    //   },
    // },
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
                  navigate(`/admin/jobs/view/${rowData.jobId?._id}`)
                }
              >
                <TbEye className="me-1" /> View Job
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/students/view/${rowData.studentId?._id}`)
                }
              >
                <TbEye className="me-1" /> View Student
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="mt-4 pb-3">
      <ComponentCard title="Job Applied" className="py-2">
        <Container fluid className="">
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
              <Col>
                <TableList
                  ref={tableRef}
                  data={applications}
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
      </ComponentCard>
    </div>
  );
};

export default AppliedOnList;