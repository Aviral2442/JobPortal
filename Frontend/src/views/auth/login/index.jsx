import { Button, Card, CardBody, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import AppLogo from '@/components/AppLogo';
import { appName, author, currentYear } from '@/helpers';
import { Link } from 'react-router';
import PageMeta from "@/components/PageMeta";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Page = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "admin"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // React Router hook

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("Submitting login form with data:", formData);
        // console.log("Using base URL:", import.meta.env.VITE_BASE_URL);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                formData
            );
            console.log("✅ Login successful:", res.data);


            // Save token in localStorage
            localStorage.setItem("token", res.data.token);

            // Redirect using React Router
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };
    return <>
        <PageMeta title="Sign In" />

        <div className="auth-box overflow-hidden align-items-center d-flex">
            <Container>
                <Row className="justify-content-center">
                    <Col xxl={4} md={6} sm={8}>
                        <Card>
                            <CardBody>
                                <div className="auth-brand mb-4">
                                    <AppLogo />
                                    <p className="text-muted w-lg-75 mt-3">Let’s get you signed in. Enter your email
                                        and
                                        password to continue.</p>
                                </div>

                                <div className="">
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup className="mb-3">
                                            <div style={{ marginBottom: "12px" }}>
                                                <label htmlFor="role">Role</label>
                                                <select
                                                    id="role"
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    className="form-select" >
                                                    <option value="">-- Select Role --</option>
                                                    <option value="admin">Admin</option>

                                                </select>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userEmail">
                                                Email<span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="email" name="email" id="userEmail" placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required />
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userPassword">
                                                Password <span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="password" id="userPassword" placeholder="••••••••"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required />
                                        </FormGroup>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2" disabled={loading}>
                                                {loading ? "Logging in..." : "Login"}
                                            </Button>
                                        </div>
                                    </Form>


                                </div>
                            </CardBody>
                        </Card>
                        <p className="text-center text-muted mt-4 mb-0">
                            © {currentYear} {appName}
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    </>;
};
export default Page;