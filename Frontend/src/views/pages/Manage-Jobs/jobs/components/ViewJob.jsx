import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Table, Badge, Image, Alert, Button } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import { IMAGE_BASE_URL } from "@/config/apiConfig";
import api from "@/api/axios";

// Axios with Vite baseURL
// const api = (() => {
//   const instance = axios.create();
//   instance.interceptors.request.use((config) => {
//     const baseURL = import.meta.env?.VITE_BASE_URL || "";
//     config.baseURL = baseURL;
//     return config;
//   });
//   return instance;
// })();

export default function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get(`/jobs/get_job_details/${id}`);
        console.log("Fetched job data:", res.data);
        if (!cancelled) setJob(res.data?.jsonData?.data || null);
      } catch (e) {
        setError("Failed to load job");
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }
  if (!job) {
    return <Alert variant="info" className="mt-3">Loading...</Alert>;
  }

  const {
    job_title,
    job_organization,
    job_advertisement_no,
    job_type,
    job_sector,
    job_category,
    job_short_desc,
    job_end_date,
    job_logo,
    job_fees_details = [],
    job_vacancy_details = [],
    job_eligibility_details = [],
    job_salary_min,
    job_salary_max,
    job_salary_allowance,
    job_salary_inhand,
    job_salary_bond_condition,
    selection = [],
    job_important_links = [],
    howToApply = "",
    files = [],
    job_posted_date,
    job_last_updated_date,
    // date fields
    job_start_date,
    job_notification_release_date,
    job_fees_pmt_last_date,
    job_correction_start_date,
    job_correction_end_date,
    job_reopen_start_date,
    job_reopen_end_date,
    job_last_date_extended,
    job_fees_pmt_last_date_extended,
    job_exam_date,
    job_exam_date_extended,
    job_joining_date,
    job_re_exam_date,
  } = job;

  const dates = [
    { label: "Start Date", value: job_start_date },
    { label: "End Date", value: job_end_date },
    { label: "Notification Release Date", value: job_notification_release_date },
    { label: "Fees Payment Last Date", value: job_fees_pmt_last_date },
    { label: "Correction Start Date", value: job_correction_start_date },
    { label: "Correction End Date", value: job_correction_end_date },
    { label: "Reopen Start Date", value: job_reopen_start_date },
    { label: "Reopen End Date", value: job_reopen_end_date },
    { label: "Last Date Extended", value: job_last_date_extended },
    { label: "Fees Last Date Extended", value: job_fees_pmt_last_date_extended },
    { label: "Exam Date", value: job_exam_date },
    { label: "Exam Date Extended", value: job_exam_date_extended },
    { label: "Joining Date", value: job_joining_date },
    { label: "Re-Exam Date", value: job_re_exam_date },
  ].filter((d) => d.value && d.value !== 0);

  return (
    <div className="mb-4 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{job_title || "Job Details"}</h4>
        <div className="d-flex gap-2">
          <Link to="/admin/jobs" className="btn btn-secondary btn-sm">Back to List</Link>
          <Link to={`/admin/jobs/edit/${job._id}`} className="btn btn-primary btn-sm">Edit</Link>
        </div>
      </div>

      {/* Basic Info */}
      <ComponentCard className="mb-3" title="Basic Info" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row className="mb-2">
            <Col md={8}>
              <div><strong>Post:</strong> {job_title || "-"}</div>
              <div><strong>Organization:</strong> {job_organization || "-"}</div>
              <div><strong>Advt No:</strong> {job_advertisement_no || "-"}</div>
            </Col>
            <Col md={4} className="text-md-end">
              {job_logo?.trim() ? <Image src={`${IMAGE_BASE_URL}/${job_logo}`} alt="Logo" height={60} /> : null}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Job Type:</strong> {job_type?.job_type_name?.toString() || "-"}</Col>
            <Col md={4}><strong>Sector:</strong> {job_sector?.job_sector_name?.toString() || "-"}</Col>
            <Col md={4}><strong>Category:</strong> {job_category?.category_name?.toString() || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Expiry Date:</strong> {job_end_date ? new Date(job_end_date * 1000).toLocaleDateString() : "-"}</Col>
            <Col md={4}><strong>Posted:</strong> {job_posted_date ? new Date(job_posted_date * 1000).toLocaleString() : "-"}</Col>
            <Col md={4}><strong>Last Updated:</strong> {job_last_updated_date ? new Date(job_last_updated_date * 1000).toLocaleString() : "-"}</Col>
          </Row>
          <Row>
            <Col>
              <strong>Short Description:</strong>
              <div className="mt-1">{job_short_desc || "-"}</div>
            </Col>
          </Row>
        </Card.Body>
      </ComponentCard>

      {/* Important Dates */}
      <ComponentCard className="mb-3" title="Important Dates" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {dates.length === 0 ? (
            <div className="text-muted">No dates provided.</div>
          ) : (
            <Table bordered size="sm">
              <thead><tr><th>Label</th><th>Date</th></tr></thead>
              <tbody>
                {dates.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.label}</td>
                    <td>{new Date(d.value * 1000).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Application Fee */}
      <ComponentCard className="mb-3" title="Application Fee" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {job_fees_details.length === 0 ? (
            <div className="text-muted">No fee details.</div>
          ) : (
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post</th><th>General</th><th>OBC</th><th>SC</th><th>ST</th><th>EWS</th><th>PwD</th><th>Ex-SM</th><th>Women</th>
                </tr>
              </thead>
              <tbody>
                {job_fees_details.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.post_name || "-"}</td>
                    <td>{f.for_general ?? "-"}</td>
                    <td>{f.for_obc ?? "-"}</td>
                    <td>{f.for_sc ?? "-"}</td>
                    <td>{f.for_st ?? "-"}</td>
                    <td>{f.for_ews ?? "-"}</td>
                    <td>{f.for_pwd ?? "-"}</td>
                    <td>{f.for_ex_serviceman ?? "-"}</td>
                    <td>{f.for_women ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Vacancies */}
      <ComponentCard className="mb-3" title="Vacancies" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {job_vacancy_details.length === 0 ? (
            <div className="text-muted">No vacancies listed.</div>
          ) : (
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post</th><th>Total</th><th>General</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwD</th><th>Ex-SM</th><th>Women</th>
                </tr>
              </thead>
              <tbody>
                {job_vacancy_details.map((v, idx) => (
                  <tr key={idx}>
                    <td>{v.post_name || "-"}</td>
                    <td>{v.total ?? "-"}</td>
                    <td>{v.for_general ?? "-"}</td>
                    <td>{v.for_ews ?? "-"}</td>
                    <td>{v.for_obc ?? "-"}</td>
                    <td>{v.for_sc ?? "-"}</td>
                    <td>{v.for_st ?? "-"}</td>
                    <td>{v.for_pwd ?? "-"}</td>
                    <td>{v.for_ex_serviceman ?? "-"}</td>
                    <td>{v.for_women ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Eligibility */}
      <ComponentCard className="mb-3" title="Eligibility" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {job_eligibility_details.length === 0 ? (
            <div className="text-muted">No eligibility details provided.</div>
          ) : (
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post</th><th>Min Age</th><th>Max Age</th><th>Qualification</th><th>Experience</th><th>Extra Criteria</th>
                </tr>
              </thead>
              <tbody>
                {job_eligibility_details.map((e, idx) => (
                  <tr key={idx}>
                    <td>{e.post_name || "-"}</td>
                    <td>{e.eligibility_age_min ?? "-"}</td>
                    <td>{e.eligibility_age_max ?? "-"}</td>
                    <td>{e.eligibility_qualifications || "-"}</td>
                    <td>{e.eligibility_experience || "-"}</td>
                    <td>{e.extra_criteria || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Salary & Benefits */}
      <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row className="mb-2">
            <Col md={3}><strong>Min Salary:</strong> <span>{job_salary_min || "-"}</span></Col>
            <Col md={3}><strong>Max Salary:</strong> <span>{job_salary_max || "-"}</span></Col>
            <Col md={3}><strong>In Hand:</strong> <span>{job_salary_inhand || "-"}</span></Col>
            <Col md={3}><strong>Allowances:</strong> <span>{job_salary_allowance || "-"}</span></Col>
          </Row>
          {job_salary_bond_condition ? (
            <Row>
              <Col><strong>Bond Condition:</strong> <span>{job_salary_bond_condition}</span></Col>
            </Row>
          ) : null}
        </Card.Body>
      </ComponentCard>

      {/* Selection Process */}
      <ComponentCard className="mb-3" title="Selection Process" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {selection.length === 0 ? (
            <div className="text-muted">No selection stages.</div>
          ) : (
            <ul className="mb-0">
              {selection.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Important Links */}
      <ComponentCard className="mb-3" title="Important Links" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {job_important_links.length === 0 ? (
            <div className="text-muted">No links provided.</div>
          ) : (
            <ul className="mb-0">
              {job_important_links.map((l, idx) => (
                <li key={idx}>
                  <Badge bg="secondary" className="me-2">{l.type || "Link"}</Badge>
                  <a href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </ComponentCard>

      {/* How To Apply */}
      <ComponentCard className="mb-3" title="How To Apply" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {howToApply ? (
            <div dangerouslySetInnerHTML={{ __html: howToApply }} />
          ) : (
            <div className="text-muted">No instructions provided.</div>
          )}
        </Card.Body>
      </ComponentCard>

      {/* Files */}
      <ComponentCard className="mb-3" title="Files" isCollapsible  defaultOpen={false}>
        <Card.Body>
          {files.length === 0 ? (
            <div className="text-muted">No files uploaded.</div>
          ) : (
            <ul className="mb-0">
              {files.map((f, idx) => (
                <li key={idx}>
                  <a href={`${import.meta.env.VITE_BASE_URL}/${f}`} target="_blank" rel="noreferrer">{f.split("/").pop()}</a>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </ComponentCard>

      {/* SEO & Meta Info */}
      {/* <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row className="mb-2">
            <Col md={6}><strong>Meta Title:</strong> <span>{job_meta_title || "-"}</span></Col>
            <Col md={6}><strong>Keywords:</strong> <span>{job_meta_keywords || "-"}</span></Col>
          </Row>
          <Row className="mb-2">
            <Col><strong>Description:</strong>
              <div className="mt-1">{job_meta_description || "-"}</div>
            </Col>
          </Row>
          {job_meta_schemas ? (
            <div>
              <strong>Schemas:</strong>
              <pre className="mt-1 bg-light p-2 rounded" style={{ whiteSpace: "pre-wrap" }}>
                {job_meta_schemas}
              </pre>
            </div>
          ) : null}
        </Card.Body>
      </ComponentCard> */}

      <div className="d-flex justify-content-end">
        <Link to={`/admin/jobs/edit/${job._id}`} className="btn btn-primary">Edit Job</Link>
      </div>
    </div>
  );
}
