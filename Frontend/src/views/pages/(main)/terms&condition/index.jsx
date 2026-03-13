import React, { useEffect, useState } from 'react'
import axios from '@/api/axios';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import { TbBook, TbBook2 } from 'react-icons/tb';

const TermsAndCondition = () => {

    const [termsAndCondition, setTermsAndCondition] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTermsAndCondition = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/dynamic-content/get_dynamic_content');
                setTermsAndCondition(res.data?.jsonData?.termsAndConditions || "");
            } catch (err) {
                console.error('Failed to fetch terms and conditions:', err);
                setTermsAndCondition("");
            } finally {
                setLoading(false);
            }
        };

        fetchTermsAndCondition();
    }, []);


    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center p-5' style={{ minHeight: '100vh' }}>
                <Spinner animation='border' variant='primary' />
            </div>
        )
    }

    return (
        <>
            <PageMeta title="Terms & Conditions" />

            <div>
                <Container className='py-5'>
                    <Row className='mb-4'>
                        <Col>
                            <div className='d-flex align-items-center gap-2 mb-1'>
                                <TbBook size={28} className='text-primary' />
                                <h4 className='fw-bold mb-0'>Terms & Conditions</h4>
                            </div>
                            <p className='text-muted mb-0 ms-1'>
                                Please review the terms and conditions before using the platform.
                            </p>
                        </Col>
                    </Row>

                    <Row className=''>
                        <Col xs={12}>
                            <Card className='shadow-sm border-0'>
                                <Card.Header className=''>
                                    <span
                                        className='d-flex align-items-center justify-content-center rounded-circle bg-primary text-white'
                                        style={{ width: 36, height: 36, minWidth: 36 }}
                                    >
                                        <TbBook2 size={18}/>
                                    </span>
                                    <h5 className="mb-0 fw-semibold">Terms & Conditions</h5>
                                </Card.Header>
                                <Card.Body className='p-4'>
                                    {termsAndCondition ? (
                                        <div className='ql-snow' style={{ border: 'none' }}>
                                            <div
                                                className='ql-editor'
                                                style={{ padding: 0 }}
                                                dangerouslySetInnerHTML={{ __html: termsAndCondition }}
                                            >
                                            </div>
                                        </div>
                                    ): (
                                        <div className='d-flex flex-column align-items-center gap-3 py-5'>
                                            <TbBook size={48} className='text-muted' />
                                            <p className='text-muted mb-0'>No content available</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default TermsAndCondition