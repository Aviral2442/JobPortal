import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import TableList from "@/components/table/TableList";
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
import { formatDate } from "@/components/DateFormat";
import "@/global.css";

const StudyMaterialList = () => {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const fetchStudyMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/job-categories/get_job_study_material_list");
      setStudyMaterials(res.data?.jsonData?.studyMaterials || []);
    } catch (err) {
      console.error(err);
      setStudyMaterials([]);
      setMessage("Failed to fetch study materials.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?")) return;
    try {
      await axios.delete(`/job-categories/delete_job_study_material/${id}`);
      setMessage("Study material deleted successfully.");
      setVariant("success");
      fetchStudyMaterials();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete study material.");
      setVariant("danger");
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const columns = [
    {
      title: "S.No.",
      data: null,
      render: (data, type, row, meta) => meta.row + 1,
    },
    {
      title: "Title",
      data: "studyMaterial_title",
    },
    {
      title: "Job",
      data: "studyMaterial_jobId",
      render: (data) => data?.job_title || "N/A",
    },
    {
      title: "Release Date",
      data: "studyMaterial_releaseDate",
      render: (data) => formatDate(data),
    },
    {
      title: "Files",
      data: "studyMaterial_files",
      render: (data) => (data ? data.length : 0),
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
              className="edit-icon"
              onClick={() =>
                navigate(`/admin/study-material/edit/${rowData._id || rowData.id}`)
              }
            >
              <TbEdit />
            </button>
            <button
              className="eye-icon text-danger"
              onClick={() => handleDelete(rowData._id || rowData.id)}
            >
              <TbTrash />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Container fluid className="py-3">
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
              data={studyMaterials}
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

export default StudyMaterialList;
