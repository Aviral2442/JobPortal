import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import TableList from "@/components/table/TableList";
import DT from 'datatables.net-bs5';
import ReactDOMServer from "react-dom/server";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";

const JobTypeList = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const fetchJobTypes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/job-types/get_job_type_list`);
      console.log('fetchJobTypes response:', res.data);
      
      // Extract data from the response structure
      const data = res.data?.jsonData?.jobTypes || [];
      setJobTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setJobTypes([]);
      setMessage('Failed to fetch job types.');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this job type?')) return;

    try {
      await axios.delete(`/job-types/delete_job_type/${id}`);
      setMessage('Job type deleted successfully.');
      setVariant('success');
      fetchJobTypes();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to delete job type.');
      setVariant('danger');
    }
  };

  // DataTable columns with proper data mapping
  const columns = [
    {
      title: 'S.No.',
      data: null,
      orderable: false,
      searchable: false,
      render: (data, type, row, meta) => {
        return meta.row + 1;
      },
    },
    {
      title: 'Job Type Name',
      data: null,
      defaultContent: '-',
      render: (data, type, row) => {
        // prefer snake_case, then camelCase, then fallback
        return row?.job_type_name ?? row?.jobType_name ?? '-';
      },
    },
    {
      title: 'Status',
      data: 'jobType_status',
      render: (data) => {
        if (data === 0 || data === "0" || data === "active") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (data === 1 || data === "1" || data === "inactive") {
          return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
        }
        return `<span class="badge badge-label badge-soft-secondary">Unknown</span>`;
      },
    },
    {
      title: 'Actions',
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = '';
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <Dropdown.Toggle variant="link" className="drop-arrow-none p-0">
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => navigate(`/admin/job-type/edit/${rowData._id}`, { state: rowData })}
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

  // Link DataTables plugin
  TableList.use = DT;

  return (
    <Container fluid className="pt-4">
      {message && <Alert variant={variant} dismissible onClose={() => setMessage('')}>{message}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <Col>
            <TableList
              ref={tableRef}
              data={jobTypes}
              columns={columns}
              options={{
                responsive: true,
                pageLength: 10,
                dom: "<'d-md-flex justify-content-between align-items-center my-2'<'dt-buttons'B>f>" +
                  "rt" +
                  "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
                buttons: [
                  { extend: "copyHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "csvHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "excelHtml5", className: "btn btn-sm btn-secondary" },
                  { extend: "pdfHtml5", className: "btn btn-sm btn-secondary" },
                ],
                paging: true,
                ordering: true,
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

export default JobTypeList;
