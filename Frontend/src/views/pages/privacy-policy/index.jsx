import api from '@/api/axios';
import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Spinner, Navbar } from 'react-bootstrap';
import { TbShieldLock, TbHelpCircle, TbPhone, TbMail } from 'react-icons/tb';
import PageMeta from '@/components/PageMeta';
import { appName, currentYear } from '@/helpers';
import logoSm from '@/assets/images/logo-sm.png';

const PrivacyPolicy = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPolicyData = async () => {
        try {
            const response = await api.get("/dynamic-content/get_dynamic_content");
            setData(response.data.jsonData);
        } catch (error) {
            console.error("Error fetching privacy policy:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicyData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <PageMeta title="Privacy Policy" />

            {/* Header */}
            <Navbar
                className="shadow-sm px-3 px-md-4 py-2"
                style={{ background: '#fff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 1030 }}
            >
                <Container fluid>
                    <Navbar.Brand href="/" className="d-flex align-items-center gap-2 text-decoration-none">
                        <img src={logoSm} alt={appName} height={36} />
                        <span className="fw-bold fs-5">{appName}</span>
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Main Content */}
            <div className="flex-grow-1" style={{ background: '#f5f7fa' }}>
                <Container className="py-4">

                    {/* Page Header */}
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <TbShieldLock size={26} className="text-primary" />
                                <h4 className="fw-bold mb-0">Privacy Policy &amp; Support</h4>
                            </div>
                            <p className="text-muted mb-0 ms-1">
                                Review our privacy policy, help center, and contact information below.
                            </p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Privacy Policy */}
                        <Col xs={12}>
                            <Card className="shadow-sm border-0">
                                <Card.Header
                                    className="d-flex align-items-center gap-2 py-3"
                                    style={{ borderBottom: '1px dashed #dee2e6' }}
                                >
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                                        style={{ width: 36, height: 36, minWidth: 36 }}
                                    >
                                        <TbShieldLock size={18} />
                                    </span>
                                    <h5 className="mb-0 fw-semibold">Privacy Policy</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {data?.privacyPolicy ? (
                                        <div
                                            className="ql-snow"
                                            style={{ border: 'none' }}
                                        >
                                            <div
                                                className="ql-editor"
                                                style={{ padding: 0 }}
                                                dangerouslySetInnerHTML={{ __html: data.privacyPolicy }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted">No privacy policy content available.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Help Center */}
                        <Col lg={8} xs={12}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Header
                                    className="d-flex align-items-center gap-2 py-3"
                                    style={{ borderBottom: '1px dashed #dee2e6' }}
                                >
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                        style={{ width: 36, height: 36, minWidth: 36, background: '#0dcaf0' }}
                                    >
                                        <TbHelpCircle size={18} />
                                    </span>
                                    <h5 className="mb-0 fw-semibold">Help Center</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {data?.helpCenter ? (
                                        <div
                                            className="ql-snow"
                                            style={{ border: 'none' }}
                                        >
                                            <div
                                                className="ql-editor"
                                                style={{ padding: 0 }}
                                                dangerouslySetInnerHTML={{ __html: data.helpCenter }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted">No help center content available.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Contact Support */}
                        <Col lg={4} xs={12}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Header
                                    className="d-flex align-items-center gap-2 py-3"
                                    style={{ borderBottom: '1px dashed #dee2e6' }}
                                >
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                                        style={{ width: 36, height: 36, minWidth: 36 }}
                                    >
                                        <TbPhone size={18} />
                                    </span>
                                    <h5 className="mb-0 fw-semibold">Contact Support</h5>
                                </Card.Header>
                                <Card.Body className="p-4 d-flex flex-column gap-3">

                                    {/* Phone */}
                                    <div
                                        className="d-flex align-items-center gap-3 p-3 rounded-3"
                                        style={{ background: 'var(--bs-tertiary-bg, #f8f9fa)' }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white flex-shrink-0"
                                            style={{ width: 48, height: 48 }}
                                        >
                                            <TbPhone size={22} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-muted mb-1 small fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                                                Phone
                                            </p>
                                            <h6 className="mb-0 fw-bold text-truncate">
                                                {data?.contactSupportNumber || 'N/A'}
                                            </h6>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div
                                        className="d-flex align-items-center gap-3 p-3 rounded-3"
                                        style={{ background: 'var(--bs-tertiary-bg, #f8f9fa)' }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle bg-danger text-white flex-shrink-0"
                                            style={{ width: 48, height: 48 }}
                                        >
                                            <TbMail size={22} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-muted mb-1 small fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                                                Email
                                            </p>
                                            <h6 className="mb-0 fw-bold">
                                                <a
                                                    href={`mailto:${data?.contactSupportEmail}`}
                                                    className="text-decoration-none text-truncate d-block"
                                                >
                                                    {data?.contactSupportEmail || 'N/A'}
                                                </a>
                                            </h6>
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Footer */}
            <footer
                className="text-center py-3"
                style={{ background: '#fff', borderTop: '1px solid #e9ecef' }}
            >
                <p className="text-muted mb-0 small">
                    &copy; {currentYear} {appName}. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;