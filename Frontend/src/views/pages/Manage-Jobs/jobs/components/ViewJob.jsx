import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Table, Badge, Image, Alert, Button } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";

// Axios with Vite baseURL
const api = (() => {
  const instance = axios.create();
  instance.interceptors.request.use((config) => {
    const baseURL = import.meta.env?.VITE_BASE_URL || "";
    config.baseURL = baseURL;
    return config;
  });
  return instance;
})();

export default function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        if (!cancelled) setJob(res.data || null);
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
    postName,
    organization,
    advtNumber,
    jobType,
    sector,
    jobCategory,
    jobLocation,
    experience,
    modeOfExam,
    shortDescription,
    expiryDate,
    logo,
    metaDetails = {},
    dates = [],
    fees = [],
    vacancies = [],
    eligibility = {},
    salary = {},
    selection = [],
    links = [],
    howToApply = "",
    files = [],
    createdAt,
    updatedAt,
  } = job;

  return (
    <div className="mb-4 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{postName || "Job Details"}</h4>
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
              <div><strong>Post:</strong> {postName || "-"}</div>
              <div><strong>Organization:</strong> {organization || "-"}</div>
              <div><strong>Advt No:</strong> {advtNumber || "-"}</div>
            </Col>
            <Col md={4} className="text-md-end">
              {logo ? <Image src={`${import.meta.env.VITE_BASE_URL}/${logo}`} alt="Logo" height={60} /> : null}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}><strong>Job Type:</strong> {jobType || "-"}</Col>
            <Col md={3}><strong>Sector:</strong> {sector || "-"}</Col>
            <Col md={3}><strong>Category:</strong> {jobCategory || "-"}</Col>
            <Col md={3}><strong>Location:</strong> {jobLocation || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}><strong>Experience:</strong> {experience || "-"}</Col>
            <Col md={3}><strong>Mode of Exam:</strong> {modeOfExam || "-"}</Col>
            <Col md={3}><strong>Expiry Date:</strong> {expiryDate ? new Date(expiryDate).toLocaleDateString() : "-"}</Col>
            <Col md={3}><strong>Updated:</strong> {updatedAt ? new Date(updatedAt).toLocaleString() : "-"}</Col>
          </Row>
          <Row>
            <Col>
              <strong>Short Description:</strong>
              <div className="mt-1">{shortDescription || "-"}</div>
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
                    <td>{d.label || "-"}</td>
                    <td>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</td>
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
          {fees.length === 0 ? (
            <div className="text-muted">No fee details.</div>
          ) : (
            <Table bordered size="sm">
              <thead><tr><th>Category</th><th>Fee</th></tr></thead>
              <tbody>
                {fees.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.category || "-"}</td>
                    <td>{f.fee || "-"}</td>
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
          {vacancies.length === 0 ? (
            <div className="text-muted">No vacancies listed.</div>
          ) : (
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v, idx) => (
                  <tr key={idx}>
                    <td>{v.postName || "-"}</td>
                    <td>{v.total ?? "-"}</td>
                    <td>{v.UR ?? "-"}</td>
                    <td>{v.EWS ?? "-"}</td>
                    <td>{v.OBC ?? "-"}</td>
                    <td>{v.SC ?? "-"}</td>
                    <td>{v.ST ?? "-"}</td>
                    <td>{v.PwBD ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {vacancies[0]?.extraRequirements ? (
            <div className="mt-2">
              <strong>Extra Requirements:</strong>
              <div className="mt-1" dangerouslySetInnerHTML={{ __html: vacancies[0].extraRequirements }} />
            </div>
          ) : null}
        </Card.Body>
      </ComponentCard>

      {/* Eligibility */}
      <ComponentCard className="mb-3" title="Eligibility" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row className="mb-2">
            <Col md={3}><strong>Qualification:</strong> {eligibility.qualification || "-"}</Col>
            <Col md={2}><strong>Final Year:</strong> {eligibility.finalYearEligible || "-"}</Col>
            <Col md={2}><strong>Min Age:</strong> {eligibility.ageMin ?? "-"}</Col>
            <Col md={2}><strong>Max Age:</strong> {eligibility.ageMax ?? "-"}</Col>
            <Col md={3}><strong>GATE Required:</strong> {eligibility.gateRequired || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><strong>Age Relaxation:</strong> {eligibility.ageRelaxation || "-"}</Col>
            <Col md={6}><strong>GATE Codes:</strong> {eligibility.gateCodes || "-"}</Col>
          </Row>
          {eligibility.extraRequirements ? (
            <div>
              <strong>Extra Requirements:</strong>
              <div className="mt-1" dangerouslySetInnerHTML={{ __html: eligibility.extraRequirements }} />
            </div>
          ) : null}
        </Card.Body>
      </ComponentCard>

      {/* Salary & Benefits */}
      <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row>
            <Col md={4}><strong>Pay Scale:</strong> <span>{salary.payScale || "-"}</span></Col>
            <Col md={4}><strong>In Hand:</strong> <span>{salary.inHand || "-"}</span></Col>
            <Col md={4}><strong>Allowances:</strong> <span>{salary.allowances || "-"}</span></Col>
          </Row>
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
          {links.length === 0 ? (
            <div className="text-muted">No links provided.</div>
          ) : (
            <ul className="mb-0">
              {links.map((l, idx) => (
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
      <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible  defaultOpen={false}>
        <Card.Body>
          <Row className="mb-2">
            <Col md={6}><strong>Meta Title:</strong> <span>{metaDetails.title || "-"}</span></Col>
            <Col md={6}><strong>Keywords:</strong> <span>{metaDetails.keywords || "-"}</span></Col>
          </Row>
          <Row className="mb-2">
            <Col><strong>Description:</strong>
              <div className="mt-1">{metaDetails.description || "-"}</div>
            </Col>
          </Row>
          {metaDetails.schemas ? (
            <div>
              <strong>Schemas:</strong>
              <pre className="mt-1 bg-light p-2 rounded" style={{ whiteSpace: "pre-wrap" }}>
                {metaDetails.schemas}
              </pre>
            </div>
          ) : null}
        </Card.Body>
      </ComponentCard>

      <div className="d-flex justify-content-end">
        <Link to={`/admin/jobs/edit/${job._id}`} className="btn btn-primary">Edit Job</Link>
      </div>
    </div>
  );
}
