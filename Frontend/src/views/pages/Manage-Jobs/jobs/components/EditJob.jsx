import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Card, Table, Alert, Image } from "react-bootstrap";
import axios from "@/api/axios";
import SnowEditor from "@/components/SnowEditor";
import ComponentCard from "@/components/ComponentCard";
import FileUploader from "@/components/FileUploader";
import { FaRegTrashAlt } from "react-icons/fa";

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // expects route like /admin/jobs/edit/:id

  const [message, setMessage] = useState({ text: "", variant: "" });
  const [newFiles, setNewFiles] = useState([]); // files to append
  const [newLogo, setNewLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

 const initialValues = useMemo(() => ({
    _id: "",
    metaDetails: { job_meta_title: "", job_meta_description: "", job_meta_keywords: "", job_meta_schemas: "" },
    job_title: "",
    job_organization: "",
    job_advertisement_no: "",
    job_type: "Permanent",
    job_sector: "Central Govt",
    job_short_desc: "",
    job_category: "",
    job_sub_category: "",
    dates: [
      { label: "Application Start Date", date: "" },
      { label: "Application End Date", date: "" },
      { label: "Notification Release Date", date: "" },
      { label: "Fee Payment Last Date", date: "" },
      { label: "Correction Start Date", date: "" },
      { label: "Correction End Date", date: "" },
      { label: "Application Reopen Start Date", date: "" },
      { label: "Application Reopen End Date", date: "" },
      { label: "Application Last date Extended", date: "" },
      { label: "Fee Payment Last Date Extended", date: "" },
      { label: "Exam Date", date: "" },
      { label: "Exam Date Extended", date: "" },
      { label: "Admit Card Release Date", date: "" },
      { label: "Result Declaration Date", date: "" },
      { label: "Joining Date", date: "" },
      { label: "Re-Exam Date", date: "" },
      { label: "Answer Key Release Date", date: "" },
    ],
    fees: [
      { category: "General", fee: "" },
      { category: "OBC", fee: "" },
      { category: "SC", fee: "" },
      { category: "ST", fee: "" },
      { category: "EWS", fee: "" },
      { category: "PWD", fee: "" },
      { category: "Ex-Serviceman", fee: "" },
    ],
    vacancies: [{
      postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PWD: 0, ExService: 0, extraRequirements: ""
    }],
    eligibility: {
      qualification: "",
      ageMin: 0,
      ageMax: 0,
      experience: "",
      extraRequirements: "",
    },
    salary: {
      min: 0,
      max: 0,
      inHand: 0,
      allowances: "",
      salaryBondConditions: "",
    },
    selection: ["Shortlisting / Written Test", "Document Verification"],
    links: [{ type: "Apply Online", label: "Apply Online", url: "" }],
    howToApply: "",
    job_logo: "",
  }), []);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({ control, name: "dates" });
  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({ control, name: "fees" });
  const { fields: vacancyFields, append: appendVacancy, remove: removeVacancy } = useFieldArray({ control, name: "vacancies" });
  const { fields: selectionFields, append: appendSelection, remove: removeSelection } = useFieldArray({ control, name: "selection" });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  // Load job by id
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await axios.get(`/jobs/${id}`);
        if (cancelled) return;
        const job = res.data || {};
        // Normalize dates field to yyyy-mm-dd strings for inputs
        const normalizedDates = (job.dates || []).map((d) => ({
          label: d.label || "",
          date: d.date ? new Date(d.date).toISOString().slice(0, 10) : "",
        }));
        reset({ ...defaultValues, ...job, dates: normalizedDates, _id: job._id || id });
      } catch (e) {
        setMessage({ text: "Failed to load job", variant: "danger" });
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, reset, defaultValues]);

  const onUpdate = async (data) => {
    try {
      const fd = new FormData();
      fd.append("jobData", JSON.stringify(data));
      newFiles.forEach((f) => fd.append("files", f));
      if (newLogo) fd.append("logo", newLogo);

      await axios.put(`/jobs/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ text: "Job updated successfully!", variant: "success" });
      setTimeout(() => navigate("/admin/jobs"), 800);
    } catch (e) {
      console.error(e.response?.data || e.message);
      setMessage({ text: "Error updating job", variant: "danger" });
    }
  };

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onUpdate)}>
          <div className="d-flex gap-2 justify-content-end mb-3">
            <Button type="submit">Update Job</Button>
          </div>

          {/* Basic Details */}
          <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control {...register("postName")} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control as="textarea" {...register("shortDescription")} style={{ height: "50px" }} />
                  </Form.Group>
                </Col>

                <Col md={3}><Form.Group className="mb-2"><Form.Label>Organization</Form.Label><Form.Control {...register("organization")} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Advertisement Number</Form.Label><Form.Control {...register("advtNumber")} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Job Type</Form.Label>
                  <Form.Select {...register("jobType")}>
                    <option>Permanent</option><option>Contract</option><option>Apprentice</option>
                  </Form.Select>
                </Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Sector</Form.Label>
                  <Form.Select {...register("sector")}>
                    <option>Central Govt</option><option>State Govt</option><option>PSU</option>
                  </Form.Select>
                </Form.Group></Col>

                <Col md={3}><Form.Group className="mb-2"><Form.Label>Expiry Date</Form.Label><Form.Control type="date" {...register("expiryDate")} /></Form.Group></Col>

                <Col md={3}><Form.Group className="mb-2"><Form.Label>Job Location</Form.Label><Form.Control {...register("jobLocation")} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Experience</Form.Label><Form.Control {...register("experience")} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Mode Of Exam</Form.Label><Form.Control {...register("modeOfExam")} /></Form.Group></Col>

                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Replace Logo</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setNewLogo(file || null);
                          setLogoPreview(file ? URL.createObjectURL(file) : "");
                        }}
                      />
                      {logoPreview ? <Image src={logoPreview} alt="Logo preview" height={40} /> : null}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Important Dates */}
          <ComponentCard className="mb-3" title="Important Dates" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Label</th><th>Date</th><th className="text-center w-25">Action</th></tr></thead>
                <tbody>
                  {dateFields.map((field, idx) => (
                    <tr key={field.id}>
                      <td><Form.Control {...register(`dates.${idx}.label`, { required: true })} /></td>
                      <td><Form.Control type="date" {...register(`dates.${idx}.date`, { required: true })} /></td>
                      <td className="d-flex gap-2 justify-content-center">
                        <Button size="sm" onClick={() => appendDate({ label: "New Date", date: "" })}>+ Add</Button>
                        <Button size="sm" variant="light" onClick={() => removeDate(idx)}><FaRegTrashAlt /> Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </ComponentCard>

          {/* Application Fee */}
          <ComponentCard className="mb-3" title="Application Fee" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Category</th><th>Fee</th><th className="text-center w-25">Action</th></tr></thead>
                <tbody>
                  {feeFields.map((f, idx) => (
                    <tr key={f.id}>
                      <td><Form.Control {...register(`fees.${idx}.category`, { required: true })} /></td>
                      <td><Form.Control type="number" {...register(`fees.${idx}.fee`, { required: true })} /></td>
                      <td className="d-flex gap-2 justify-content-center">
                        <Button size="sm" onClick={() => appendFee({ category: "", fee: "" })}>+ Add</Button>
                        <Button size="sm" variant="light" onClick={() => removeFee(idx)}><FaRegTrashAlt /> Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </ComponentCard>

          {/* Vacancies */}
          <ComponentCard className="mb-3" title="Vacancies" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Post Name</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th><th className="w-25">Action</th></tr></thead>
                <tbody>
                  {vacancyFields.map((v, idx) => (
                    <tr key={v.id}>
                      {["postName","total","UR","EWS","OBC","SC","ST","PwBD"].map((fld) => (
                        <td key={fld}><Form.Control type={fld==="postName"?"text":"number"} {...register(`vacancies.${idx}.${fld}`)} /></td>
                      ))}
                      <td className="d-flex gap-2 justify-content-center">
                        <Button size="sm" onClick={() => appendVacancy({ postName:"", total:0, UR:0, EWS:0, OBC:0, SC:0, ST:0, PwBD:0, extraRequirements:"" })}>+ Add</Button>
                        <Button size="sm" variant="light" onClick={() => removeVacancy(idx)}><FaRegTrashAlt /> Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Form.Group className="mb-2">
                <Form.Label>Extra Requirements</Form.Label>
                <Controller
                  control={control}
                  name="vacancies.0.extraRequirements"
                  render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />}
                />
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Eligibility */}
          <ComponentCard className="mb-3" title="Eligibility" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={3}><Form.Group><Form.Label>Qualification</Form.Label><Form.Control {...register("eligibility.qualification")} /></Form.Group></Col>
                <Col md={2}><Form.Group><Form.Label>Final Year</Form.Label><Form.Select {...register("eligibility.finalYearEligible")}><option>Yes</option><option>No</option></Form.Select></Form.Group></Col>
                <Col md={1}><Form.Group><Form.Label>Min Age</Form.Label><Form.Control type="number" {...register("eligibility.ageMin")} /></Form.Group></Col>
                <Col md={1}><Form.Group><Form.Label>Max Age</Form.Label><Form.Control type="number" {...register("eligibility.ageMax")} /></Form.Group></Col>
                <Col md={2}><Form.Group><Form.Label>Age Relaxation</Form.Label><Form.Control {...register("eligibility.ageRelaxation")} /></Form.Group></Col>
                <Col md={2}><Form.Group><Form.Label>GATE Required</Form.Label><Form.Select {...register("eligibility.gateRequired")}><option>Yes</option><option>No</option></Form.Select></Form.Group></Col>
                <Col md={2}><Form.Group><Form.Label>GATE Codes</Form.Label><Form.Control {...register("eligibility.gateCodes")} /></Form.Group></Col>
              </Row>
              <Form.Group><Form.Label>Extra Requirements</Form.Label><Controller control={control} name="eligibility.extraRequirements" render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />} /></Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Salary & Benefits */}
          <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}><Form.Group><Form.Label>Pay Scale</Form.Label><Form.Control {...register("salary.payScale")} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>In Hand</Form.Label><Form.Control type="number" {...register("salary.inHand")} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Allowances</Form.Label><Form.Control {...register("salary.allowances")} /></Form.Group></Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Selection Process */}
          <ComponentCard className="mb-3" title="Selection Process" isCollapsible defaultOpen>
            <Card.Body>
              {selectionFields.map((s, idx) => (
                <Row key={s.id} className="mb-2">
                  <Col md={9}><Form.Control {...register(`selection.${idx}`)} /></Col>
                  <Col md={3} className="d-flex gap-2">
                    <Button size="sm" onClick={() => appendSelection("")}>+ Add Step</Button>
                    <Button size="sm" variant="light" onClick={() => removeSelection(idx)}><FaRegTrashAlt /> Remove</Button>
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </ComponentCard>

          {/* Important Links */}
          <ComponentCard className="mb-3" title="Important Links" isCollapsible defaultOpen>
            <Card.Body>
              {linkFields.map((l, idx) => (
                <Row key={l.id} className="mb-2">
                  <Col md={3}><Form.Control {...register(`links.${idx}.type`)} placeholder="Type" /></Col>
                  <Col md={3}><Form.Control {...register(`links.${idx}.label`)} placeholder="Label" /></Col>
                  <Col md={3}><Form.Control {...register(`links.${idx}.url`)} placeholder="URL" type="url" /></Col>
                  <Col md={3} className="d-flex gap-2 justify-content-center">
                    <Button size="sm" onClick={() => appendLink({ type: "", label: "", url: "" })}>+ Add Link</Button>
                    <Button size="sm" variant="light" onClick={() => removeLink(idx)}><FaRegTrashAlt /> Remove</Button>
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </ComponentCard>

          {/* Files (append) */}
          <ComponentCard className="mb-3" title="Files (append on update)" isCollapsible defaultOpen>
            <Card.Body>
              <Form.Group>
                <Form.Label>Add Files</Form.Label>
                <FileUploader files={newFiles} setFiles={setNewFiles} multiple maxFileCount={12} />
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* SEO & Meta Info */}
          <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={6}><Form.Group className="mb-2"><Form.Label>Meta Title</Form.Label><Form.Control {...register("metaDetails.title")} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label>Meta Description</Form.Label><Form.Control as="textarea" {...register("metaDetails.description")} style={{ height: "50px" }} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label>Meta Keywords</Form.Label><Form.Control {...register("metaDetails.keywords")} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label>Meta Schemas</Form.Label><Form.Control as="textarea" {...register("metaDetails.schemas")} style={{ height: "50px" }} /></Form.Group></Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          <div className="text-end mt-3 me-3">
            <Button type="submit">Update Job</Button>
          </div>
        </Form>
      </Card.Body>
    </div>
  );
}
