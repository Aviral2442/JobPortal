import { useEffect, useState, useRef, Component } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import TableList from "@/components/table/TableList";
import { createRoot } from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
    TbChevronLeft,
    TbChevronRight,
    TbChevronsLeft,
    TbChevronsRight,
    TbEye,
} from "react-icons/tb";
import axios from "@/api/axios";
import { formatDate } from "@/components/DateFormat";
import ComponentCard from "@/components/ComponentCard";

const AdmitCardGovernmentList = ({ isActive }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("success");
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const { id } = useParams();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Fetch jobs - government sector
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/job-categories/student_applied_jobs_list_and_counts/${id}`);
            console.log("Fetched jobs:", res.data);
            // Filter for government sector jobs
            setJobs(res.data?.jsonData?.appliedJobslist || []);
        } catch (err) {
            console.error(err);
            setJobs([]);
            setMessage("Failed to fetch admit cards.");
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
        {
            title: "S.No.", data: null, orderable: false, searchable: false, render: (data, type, row, meta) => {
                return meta.row + 1;
            }
        },
        { title: "Post Name", data: "jobId.job_title" },
        { title: "Sector", data: "jobId.job_sector.job_sector_name" },
        { title: "Category", data: "jobId.job_category.category_name" },
        { title: "Type", data: "jobId.job_type.job_type_name" },
        { title: "Status", data: "applicationStatus",
            render: (data) => {
                return `<span class="badge badge-label badge-soft-success">${data}</span>`;
            }
        },
        { title: "Vacancy", data: "jobId.job_vacancy_total" },
        {
            title: "Date", data: "appliedAt",
            render: (data) => {
                return formatDate(data);
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
                    <div>
                        <button
                            className="eye-icon"
                            onClick={() => navigate(`/admin/jobs/edit/${rowData.jobId._id}`)}
                        >
                            <TbEye className="" />
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
                <ComponentCard className="">
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
                </ComponentCard>
            )}
        </Container>
    );
};

export default AdmitCardGovernmentList;
