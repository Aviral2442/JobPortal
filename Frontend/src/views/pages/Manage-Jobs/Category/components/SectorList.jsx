import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import axios from '@/api/axios';
import TableList from "@/components/table/TableList";
import DT from 'datatables.net-bs5';

const SectorList = ({ onEditRow, refreshFlag, onDataChanged }) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const tableRef = useRef(null);

  // Fetch sectors
  const fetchSectors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/job-categories/get_job_sector_list');
      console.log('Fetch sector response:', res.data);
      
      // Extract data correctly from response
      const data = res.data?.jsonData?.data || res.data?.data || [];
      setSectors(Array.isArray(data) ? data : []);
      
      if (data.length === 0) {
        setMessage('No sectors found.');
        setVariant('info');
      }
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setSectors([]);
      setMessage(err.response?.data?.message || 'Failed to fetch sectors.');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, [refreshFlag]);

  // Delete sector
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this sector?')) return;

    try {
      await axios.delete(`/job-categories/delete_job_sector/${id}`);
      setMessage('Sector deleted successfully.');
      setVariant('success');
      fetchSectors();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error('Error deleting sector:', err);
      setMessage(err.response?.data?.message || 'Failed to delete sector.');
      setVariant('danger');
    }
  };

  // DataTable columns
  const columns = [
    { 
      title: 'S.No.',
      data: null,
      orderable: false,
      render: (data, type, row, meta) => meta.row + 1
    },
    { title: 'Sector Name', data: 'job_sector_name' },
    {
      title: 'Status',
      data: 'job_sector_status',
      render: (data) => {
        if (data == 0 || data === 'active') {
          return '<span class="badge badge-label badge-soft-success">Active</span>';
        } else {
          return '<span class="badge badge-label badge-soft-danger">Inactive</span>';
        }
      }
    },
    {
      title: 'Actions',
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = '';
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <Dropdown.Toggle variant="link" className="drop-arrow-none p-0">
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onEditRow(rowData)}>
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
              data={sectors}
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
              }}
              className="table table-striped dt-responsive w-100"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SectorList;
