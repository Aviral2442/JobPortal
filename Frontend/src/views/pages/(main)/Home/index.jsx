import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { TbBriefcase, TbMail, TbPhone, TbSend, TbUser } from 'react-icons/tb';
import { LuSparkles } from 'react-icons/lu';
import PageMeta from '@/components/PageMeta';
import { appName } from '@/helpers';
import toast from 'react-hot-toast';
import axios from '@/api/axios';

const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error('Please fill all required fields.');
            return;
        }
        setSubmitting(true);
        try {
            const response = await axios.post('/dynamic-content/submit_contact_us_form', formData);
            if (response.data.status !== 200) {
                throw new Error(response.data.message || 'Failed to submit form');
            }
            await new Promise((r) => setTimeout(r, 800));
            toast.success('Thank you! Your message has been sent.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageMeta title="Home" />

            {/* ─── Hero Section ─── */}
            <div
                className="text-white d-flex align-items-center"
                style={{
                    background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 50%, #084298 100%)',
                    padding: '80px 0',
                }}
            >
                <Container className="text-center">
                    <div className="d-flex justify-content-center mb-3">
                        <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary"
                            style={{ width: 64, height: 64 }}
                        >
                            <TbBriefcase size={32} />
                        </span>
                    </div>
                    <h1 className="fw-bold mb-3">Welcome to {appName}</h1>
                    <p className="lead mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
                        Your one-stop destination for discovering Government, Private &amp; PSU jobs opportunities, admit cards, results, and more.
                    </p>
                    <a href="#contact" className="btn btn-light btn-lg px-4">
                        Get In Touch
                    </a>
                </Container>
            </div>

            {/* ─── Features Row ─── */}
            <div style={{ background: '#f5f7fa' }} className="py-5">
                <Container>
                    <Row className="g-4 text-center">
                        {[
                            { icon: <TbBriefcase size={28} />, title: 'Latest Jobs', desc: 'Browse latest government, private & PSU job opportunities updated daily.' },
                            { icon: <LuSparkles size={28} />, title: 'Admit Cards & Study Material', desc: 'Download admit cards and stay prepared for your upcoming exams.' },
                            { icon: <TbMail size={28} />, title: 'Results & Answer Keys', desc: 'Check results and answer keys as soon as they are released.' },
                        ].map((item, idx) => (
                            <Col md={4} key={idx}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="p-4">
                                        <div
                                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary mb-3"
                                            style={{ width: 56, height: 56 }}
                                        >
                                            {item.icon}
                                        </div>
                                        <h5 className="fw-semibold">{item.title}</h5>
                                        <p className="text-muted mb-0">{item.desc}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* ─── Contact Us Section ─── */}
            <div id="contact" className="flex-grow-1 py-5" style={{ background: '#fff' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={7} md={10}>
                            <Card className="shadow-sm border-0">
                                <Card.Header
                                    className="d-flex align-items-center gap-2 py-3"
                                    style={{ borderBottom: '1px dashed #dee2e6' }}
                                >
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                                        style={{ width: 36, height: 36, minWidth: 36 }}
                                    >
                                        <TbSend size={18} />
                                    </span>
                                    <h5 className="mb-0 fw-semibold">Contact Us</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold small">
                                                        Full Name <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><TbUser size={16} /></span>
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            placeholder="Your name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ background: 'var(--inputField-bg)' }}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold small">
                                                        Email Address <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><TbMail size={16} /></span>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            placeholder="you@example.com"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ background: 'var(--inputField-bg)' }}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold small">Phone Number</Form.Label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><TbPhone size={16} /></span>
                                                        <Form.Control
                                                            type="tel"
                                                            name="phone"
                                                            placeholder="+91 XXXXX XXXXX"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            style={{ background: 'var(--inputField-bg)' }}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold small">
                                                        Message <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        name="message"
                                                        placeholder="Write your message here..."
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                        style={{ background: 'var(--inputField-bg)' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} className="text-end">
                                                <Button type="submit" variant="primary" disabled={submitting}>
                                                    {submitting ? 'Sending...' : 'Send Message'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Home;