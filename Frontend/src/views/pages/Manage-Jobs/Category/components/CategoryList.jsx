import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert, Spinner } from "react-bootstrap";
import TableList from "@/components/table/TableList";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactDOMServer from "react-dom/server";

import {
  TbDotsVertical,
  TbEdit,
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/job-categories/get_job_category_list`);
      // Ensure we get an array
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setMessage("Failed to fetch categories.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    if (!id) return console.error("Invalid category ID");
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/api/categories/${id}`);
      setMessage(res.data.message || "Category deleted successfully");
      setVariant("success");
      fetchCategories(); // Refresh after delete
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setMessage(err.response?.data?.message || "Failed to delete category");
      setVariant("danger");
    }
  };

  const columns = [
    { title: "Name", data: "categoryName" },
    { title: "SKU", data: "categorySKU" },
    {
      title: "Status",
      data: "categoryStatus",
      createdCell: (td, cellData) => {
        td.innerHTML = cellData === 0 ? "Active" : cellData === 1 ? "Inactive" : "Deleted";
      },
    },
    {
      title: "Image",
      data: "categoryImage",
      orderable: false,
      createdCell: (td, cellData) => {
        td.innerHTML = cellData
          ? `<img src="${BASE_URL}${cellData}" alt="img" width="50" />`
          : "";
      },
    },
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
                  navigate(`/admin/category/edit/${rowData._id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={() => handleDelete(rowData._id)}>
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
      {message && <Alert variant={variant}>{message}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <Col>
            <TableList
              ref={tableRef}
              data={categories}
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

export default CategoryList;