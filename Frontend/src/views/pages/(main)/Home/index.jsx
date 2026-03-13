import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Col, Container, Form, Row, Badge, Modal, ProgressBar } from 'react-bootstrap';
import {
    TbBriefcase, TbMail, TbPhone, TbSend, TbUser,
    TbSearch, TbBuilding, TbChevronRight,
    TbStar, TbDownload, TbBook2, TbCertificate,
    TbClipboardList, TbArrowRight,
    TbBell, TbShield, TbTrendingUp, TbUsers,
    TbFileText, TbBook, TbAward, TbTarget,
    TbDeviceMobile, TbBrandGooglePlay, TbBrandApple,
    TbPlayerPlay, TbClock, TbFlame,
    TbSchool, TbNews, TbTag,
} from 'react-icons/tb';
import { LuSparkles, LuBadgeCheck, LuBuilding2, LuGraduationCap, LuLandmark, LuNetwork } from 'react-icons/lu';
import { MdOutlineAccountBalance } from 'react-icons/md';
import { FaQuoteLeft } from 'react-icons/fa';
import PageMeta from '@/components/PageMeta';
import { appName } from '@/helpers';
import toast from 'react-hot-toast';
import axios from '@/api/axios';
import './home.css';

/* ─── Scroll-reveal hook ─── */
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(timer); }
                    else setCount(start);
                }, 30);
            }
        }, { threshold: 0.5 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const JOB_CATEGORIES = [
    { key: 'govt', label: 'Government Jobs', icon: <LuLandmark size={32} />, cls: 'cat-govt', count: '4,200+', desc: 'Central & State Govt vacancies' },
    { key: 'private', label: 'Private Sector', icon: <LuBuilding2 size={32} />, cls: 'cat-private', count: '9,800+', desc: 'Top MNCs & startups hiring now' },
    { key: 'psu', label: 'PSU Jobs', icon: <LuNetwork size={32} />, cls: 'cat-psu', count: '1,500+', desc: 'ONGC, BHEL, NTPC & more' },
    { key: 'bank', label: 'Bank Jobs', icon: <MdOutlineAccountBalance size={32} />, cls: 'cat-bank', count: '3,400+', desc: 'SBI, PNB, RBI & all banks' },
    { key: 'defence', label: 'Defence / Army', icon: <TbShield size={32} />, cls: 'cat-defence', count: '820+', desc: 'Army, Navy & Air Force' },
    { key: 'railway', label: 'Railway Jobs', icon: <TbShield size={32} />, cls: 'cat-railway', count: '2,100+', desc: 'RRB, IRCTC & zone boards' },
];

const FEATURED_JOBS = [
    { id: 1, title: 'Software Developer', org: 'NIC – Govt of India', type: 'Govt', location: 'Delhi', posts: 250, deadline: '28 Mar 2026', tag: 'hot' },
    { id: 2, title: 'Assistant Manager', org: 'State Bank of India', type: 'Bank', location: 'Pan India', posts: 1200, deadline: '15 Apr 2026', tag: 'new' },
    { id: 3, title: 'Junior Engineer', org: 'NTPC Limited', type: 'PSU', location: 'Multiple', posts: 450, deadline: '10 Apr 2026', tag: 'hot' },
    { id: 4, title: 'UI/UX Designer', org: 'Infosys Technologies', type: 'Private', location: 'Bangalore', posts: 80, deadline: '05 Apr 2026', tag: 'new' },
    { id: 5, title: 'Data Analyst', org: 'TATA Consultancy', type: 'Private', location: 'Pune', posts: 140, deadline: '20 Apr 2026', tag: '' },
    { id: 6, title: 'Constable (GD)', org: 'SSC – CAPF', type: 'Govt', location: 'Pan India', posts: 26000, deadline: '30 Mar 2026', tag: 'hot' },
];

const LATEST_JOBS = [
    { id: 1, title: 'Tax Assistant', org: 'Income Tax Dept', posts: 600, type: 'Govt', deadline: '25 Mar 2026' },
    { id: 2, title: 'Research Analyst', org: 'SEBI', posts: 50, type: 'Govt', deadline: '26 Mar 2026' },
    { id: 3, title: 'Frontend Developer', org: 'Wipro Limited', posts: 200, type: 'Private', deadline: '27 Mar 2026' },
    { id: 4, title: 'Trainee Engineer', org: 'BHEL Haridwar', posts: 350, type: 'PSU', deadline: '28 Mar 2026' },
    { id: 5, title: 'Clerk / MTS', org: 'Indian Post Office', posts: 44228, type: 'Govt', deadline: '29 Mar 2026' },
    { id: 6, title: 'Product Manager', org: 'Flipkart', posts: 30, type: 'Private', deadline: '01 Apr 2026' },
];

const PROCESS_STEPS = [
    { icon: <TbUser size={28} />, title: 'Create Account', desc: 'Register free in under 2 minutes with email or mobile number.' },
    { icon: <TbSearch size={28} />, title: 'Search Jobs', desc: 'Filter jobs by category, location, qualification & more.' },
    { icon: <TbFileText size={28} />, title: 'Upload Documents', desc: 'Upload resume, photo & certificates in your profile.' },
    { icon: <TbClipboardList size={28} />, title: 'Apply Online', desc: 'Apply to jobs with a single click using your saved profile.' },
    { icon: <TbBell size={28} />, title: 'Get Notified', desc: 'Receive real-time alerts on application status & new openings.' },
    { icon: <TbMail size={28} />, title: 'Get Hired', desc: 'Attend interviews, clear selections & start your career.' },
];

const STUDY_MATERIALS = [
    { icon: <TbBook size={28} />, color: '#0d6efd', bg: '#e8f0fe', title: 'Previous Year Papers', desc: '10+ years solved papers for all govt exams', count: '2,400+ PDFs' },
    { icon: <TbAward size={28} />, color: '#7c3aed', bg: '#ede9fe', title: 'Mock Test Series', desc: 'Full-length & sectional tests with analytics', count: '500+ Tests' },
    { icon: <TbPlayerPlay size={28} />, color: '#065f46', bg: '#d1fae5', title: 'Video Lectures', desc: 'Expert-led classes for SSC, Banking & More', count: '3,000+ Videos' },
    { icon: <TbSchool size={28} />, color: '#dc2626', bg: '#fee2e2', title: 'Current Affairs', desc: 'Daily GK updates, monthly magazines & quiz', count: 'Updated Daily' },
    { icon: <TbBook2 size={28} />, color: '#b45309', bg: '#fef3c7', title: 'E-Books & Notes', desc: 'Handwritten & typed notes for all subjects', count: '1,200+ Notes' },
    { icon: <TbTarget size={28} />, color: '#0e7490', bg: '#cffafe', title: 'Exam Strategies', desc: 'Toppers\' tips, time tables & study plans', count: '80+ Guides' },
];

const QUICK_ACCESS = [
    { label: 'Admit Cards', icon: <TbCertificate size={28} />, cls: 'qc-1', count: '340 Active' },
    { label: 'Results', icon: <TbAward size={28} />, cls: 'qc-2', count: '120 New' },
    { label: 'Answer Keys', icon: <TbBook2 size={28} />, cls: 'qc-3', count: '85 Latest' },
    { label: 'Notifications', icon: <TbBell size={28} />, cls: 'qc-4', count: '200+ Posted' },
];

const ENROLLED_JOBS = [
    { title: 'SSC CGL 2025', org: 'Staff Selection Commission', progress: 75, stage: 'Document Upload', color: '#0d6efd' },
    { title: 'IBPS PO 2025', org: 'Institute of Banking Personnel', progress: 45, stage: 'Online Test', color: '#7c3aed' },
    { title: 'RRB NTPC 2025', org: 'Railway Recruitment Board', progress: 90, stage: 'Merit List', color: '#10b981' },
];

const TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'Selected in UPSC CSE 2024', text: 'This portal made my job search incredibly easy. The study material and mock tests were extremely helpful for my preparation.', stars: 5 },
    { name: 'Rahul Verma', role: 'Joined NTPC as JE', text: 'Got placed in PSU through this platform. The job alerts and one-click apply feature saved me so much time!', stars: 5 },
    { name: 'Anjali Singh', role: 'SBI PO 2024', text: 'The previous year papers and mock tests on this portal are the best. I cleared SBI PO in my first attempt!', stars: 5 },
    { name: 'Amit Tiwari', role: 'Software Dev at Wipro', text: 'Found my dream job in the IT sector. The private job listings are updated daily and very accurate.', stars: 4 },
];

const STATS = [
    { icon: <TbBriefcase size={22} />, target: 52000, suffix: '+', label: 'Active Jobs' },
    { icon: <TbUsers size={22} />, target: 1200000, suffix: '+', label: 'Registered Users' },
    { icon: <TbBuilding size={22} />, target: 4800, suffix: '+', label: 'Partner Companies' },
    { icon: <TbMail size={22} />, target: 320000, suffix: '+', label: 'Successful Placements' },
];

const TICKER_ITEMS = [
    '🔥 SSC CGL 2025 – 26000 posts | Last Date: 30 Mar',
    '📢 IBPS PO 2025 Online Registration Open',
    '🚂 RRB NTPC 2025 – 11558 Vacancies Released',
    '🏦 SBI Clerk 2026 – Notification Out | Apply Now',
    '⚡ UPSC Civil Services 2026 – Prelims on 25 May',
    '🛡️ Indian Army Agniveer – Registration Starts 01 Apr',
    '🌐 NTPC Executive Trainee – 1200 Posts',
    '🎯 SSC MTS 2026 – Applications Invited',
];

const APP_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.jobportal.app';
const APP_QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(APP_STORE_LINK)}`;

const typeMap = { Govt: 'badge-govt', Private: 'badge-private', PSU: 'badge-psu', Bank: 'badge-bank' };

/* ─── Component ─── */
const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAppModal, setShowAppModal] = useState(false);

    /* section refs */
    const statsRef = useReveal();
    const catRef = useReveal();
    const featRef = useReveal();
    const latestRef = useReveal();
    const processRef = useReveal();
    const materialRef = useReveal();
    const quickRef = useReveal();
    const enrolledRef = useReveal();
    const testimRef = useReveal();
    const appRef = useReveal();
    const contactRef = useReveal();
    const whyRef = useReveal();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const openAppModal = (e) => {
        if (e) e.preventDefault();
        setShowAppModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error('Please fill all required fields.');
            return;
        }
        // console.log(formData);
        setSubmitting(true);
        try {
            const response = await axios.post('/dynamic-content/submit_contact_us_form', formData);
            console.log(response);
            if (response.data.status !== 200) throw new Error(response.data.message || 'Failed');
            await new Promise(r => setTimeout(r, 600));
            toast.success('Thank you! Your message has been sent.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageMeta title="Home" />

            {/* ════════════════════════════════════════
                TICKER BAR
            ════════════════════════════════════════ */}
            <div className="ticker-wrapper">
                <div className="ticker-inner">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span className="ticker-item" key={i}>
                            <span className="dot" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════
                HERO SECTION
            ════════════════════════════════════════ */}
            <section className="hero-section">
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <Container className="position-relative z-1">
                    <Row className="align-items-center gy-5">
                        <Col lg={7} className="text-white text-center text-lg-start">
                            <div className="mb-3">
                                <span className="hero-badge">
                                    <span className="dot" />
                                    India's #1 Job Discovery Platform
                                </span>
                            </div>
                            <h1 className="hero-title fw-black mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.15 }}>
                                Find Your Dream<br />
                                <span className="text-gradient">Career Opportunity</span><br />
                                Today!
                            </h1>
                            <p className="hero-subtitle lead mb-4" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 520 }}>
                                Explore <strong style={{ color: '#fff' }}>52,000+</strong> live jobs across Government, Private & PSU sectors. One platform for applications, study materials, admit cards & results.
                            </p>
                            {/* <div className="hero-search-bar mb-5">
                                <div className="hero-search-wrapper">
                                    <TbSearch size={20} color="#0d6efd" />
                                    <input
                                        type="text"
                                        placeholder="Job title, keyword or company..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn btn-primary hero-search-btn">
                                        Search Jobs
                                    </button>
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center justify-content-lg-start">
                                    {['SSC CGL', 'IBPS PO', 'RRB NTPC', 'IT Jobs', 'Bank Jobs'].map(t => (
                                        <span key={t} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, padding: '3px 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div> */}
                            <div className="hero-cta d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                                <a href="#jobs" className="btn btn-primary btn-lg px-4" onClick={openAppModal}>
                                    <TbBriefcase className="me-2" />Browse Jobs
                                </a>
                                <a href="#contact" className="btn btn-outline-light btn-lg px-4 text-white">
                                    <TbSend className="me-2" />Contact Us
                                </a>
                            </div>
                        </Col>
                        <Col lg={5} className="d-none d-lg-flex justify-content-center align-items-center">
                            <div className="position-relative">
                                <div className="hero-floating-card position-relative">
                                    <div className="hero-mini-card mb-3">
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#4ade80,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TbMail size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>New Alert</div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>SSC CGL 2025 Released</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-floating-card-2">
                                    <div className="hero-mini-card">
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TbTrendingUp size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>This Week</div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>1,240 New Jobs</div>
                                        </div>
                                    </div>
                                    <div className="hero-mini-card mt-3">
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#e879f9,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LuBadgeCheck size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Users Placed</div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>3.2L+ Selected</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="hero-scroll-indicator">
                    scroll<span className="arrow" />
                </div>
            </section>

            {/* ════════════════════════════════════════
                STATS BAR
            ════════════════════════════════════════ */}
            <section className="stats-bar">
                <Container>
                    <Row ref={statsRef} className="reveal g-4">
                        {STATS.map((s, i) => (
                            <Col xs={6} md={3} key={i}>
                                <div className={`stat-item delay-${i + 1}`}>
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-number"><AnimatedCounter target={s.target} suffix={s.suffix} /></div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                JOB CATEGORIES
            ════════════════════════════════════════ */}
            <section className="section-bg-light py-5" id="categories">
                <Container>
                    <div ref={catRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><LuSparkles size={14} /> Explore Categories</div>
                            <h2>Browse Jobs by <span className="text-gradient">Category</span></h2>
                            <p>Find jobs tailored to your sector – from central government to top MNCs.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4">
                            {JOB_CATEGORIES.map((cat, i) => (
                                <Col xs={6} sm={6} md={4} xl={2} key={cat.key}>
                                    <Card className={`category-card shadow-sm text-center ${cat.cls} delay-${i + 1}`} style={{ color: '#fff' }}>
                                        <Card.Body className="p-4">
                                            <div className={`cat-icon-wrap text-white`} style={{ background: 'rgba(255,255,255,0.15)' }}>
                                                {cat.icon}
                                            </div>
                                            <h6 className="fw-bold mb-1">{cat.label}</h6>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{cat.count}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{cat.desc}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                QUICK ACCESS (Admit Cards / Results)
            ════════════════════════════════════════ */}
            <section className="section-bg-white py-5">
                <Container>
                    <div ref={quickRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbCertificate size={14} /> Quick Access</div>
                            <h2>Admit Cards, Results <span className="text-gradient">& More</span></h2>
                            <p>One-click access to the most searched exam resources.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4">
                            {QUICK_ACCESS.map((q, i) => (
                                <Col xs={6} md={3} key={i}>
                                    <div className={`quick-card ${q.cls} delay-${i + 1}`}>
                                        <div className="mb-3">{q.icon}</div>
                                        <h5 className="fw-bold mb-1">{q.label}</h5>
                                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>{q.count}</div>
                                        <div className="mt-3">
                                            <button type="button" onClick={openAppModal} style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 50, padding: '3px 12px' }}>
                                                View All <TbChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                FEATURED JOBS
            ════════════════════════════════════════ */}
            <section className="section-bg-light py-5" id="jobs">
                <Container>
                    <div ref={featRef} className="reveal">
                        <div className="section-heading d-flex flex-column align-items-center">
                            <div className="badge-pill"><TbFlame size={14} /> Hot & Featured</div>
                            <h2>Featured <span className="text-gradient">Jobs</span></h2>
                            <p>Hand-picked opportunities from top employers across India.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-3">
                            {FEATURED_JOBS.map((job, i) => (
                                <Col md={6} lg={4} key={job.id}>
                                    <Card className={`job-card h-100 reveal delay-${(i % 3) + 1}`} style={{ opacity: 1, transform: 'none', transition: 'none' }}>
                                        <Card.Body className="p-3">
                                            <div className="d-flex align-items-start gap-3 mb-3">
                                                <div className="company-logo-placeholder flex-shrink-0">
                                                    {job.org.charAt(0)}
                                                </div>
                                                <div className="flex-grow-1 min-w-0">
                                                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                        <h6 className="fw-bold mb-0 text-truncate">{job.title}</h6>
                                                        {job.tag === 'hot' && <span className="job-tag badge-hot">🔥 HOT</span>}
                                                        {job.tag === 'new' && <span className="job-tag badge-new">✨ NEW</span>}
                                                    </div>
                                                    <div className="text-muted small">{job.org}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                <span className={`job-tag ${typeMap[job.type] || 'badge-govt'}`}><TbBuilding size={11} /> {job.type}</span>
                                                <span className="job-tag" style={{ background: '#f1f5f9', color: '#475569' }}><TbMail size={11} /> {job.location}</span>
                                                <span className="job-tag" style={{ background: '#f1f5f9', color: '#475569' }}><TbUsers size={11} /> {job.posts.toLocaleString()} Posts</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="small text-danger d-flex align-items-center gap-1">
                                                    <TbClock size={13} /> {job.deadline}
                                                </span>
                                                <button type="button" onClick={openAppModal} className="btn btn-primary btn-sm px-3" style={{ borderRadius: 50 }}>
                                                    Apply <TbArrowRight size={13} />
                                                </button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center mt-4">
                            <a href="#" className="btn btn-outline-primary px-5" onClick={openAppModal}>
                                View All Featured Jobs <TbArrowRight className="ms-1" />
                            </a>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                LATEST JOBS
            ════════════════════════════════════════ */}
            <section className="section-bg-white py-5">
                <Container>
                    <div ref={latestRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbNews size={14} /> Freshly Posted</div>
                            <h2>Latest <span className="text-gradient">Jobs</span></h2>
                            <p>Updated every hour – never miss a single opportunity.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-3">
                            {LATEST_JOBS.map((job, i) => (
                                <Col xs={12} md={6} key={job.id}>
                                    <div className={`enrolled-card p-3 d-flex align-items-center gap-3 reveal delay-${(i % 2) + 1}`} style={{ opacity: 1, transform: 'none', transition: 'none' }}>
                                        <div className="company-logo-placeholder flex-shrink-0" style={{ width: 44, height: 44, fontSize: '0.9rem' }}>
                                            {job.org.charAt(0)}
                                        </div>
                                        <div className="flex-grow-1 min-w-0">
                                            <div className="fw-semibold text-truncate">{job.title}</div>
                                            <div className="text-muted small">{job.org} &nbsp;·&nbsp; {job.posts.toLocaleString()} Posts</div>
                                        </div>
                                        <div className="text-end flex-shrink-0">
                                            <span className={`job-tag ${typeMap[job.type] || 'badge-govt'} d-block mb-1`}>{job.type}</span>
                                            <span className="small text-danger"><TbClock size={12} /> {job.deadline}</span>
                                        </div>
                                        <button type="button" onClick={openAppModal} className="btn btn-outline-primary btn-sm flex-shrink-0" style={{ borderRadius: 50, whiteSpace: 'nowrap' }}>
                                            Apply
                                        </button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center mt-4">
                            <a href="#" className="btn btn-outline-primary px-5" onClick={openAppModal}>
                                View All Latest Jobs <TbArrowRight className="ms-1" />
                            </a>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                ENROLLED / APPLIED JOBS
            ════════════════════════════════════════ */}
            <section className="section-bg-light py-5">
                <Container>
                    <div ref={enrolledRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbClipboardList size={14} /> Your Applications</div>
                            <h2>Enrolled <span className="text-gradient">Jobs</span></h2>
                            <p>Track the real-time status of every job you've applied to.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4 justify-content-center">
                            {ENROLLED_JOBS.map((job, i) => (
                                <Col md={4} key={i}>
                                    <Card className="enrolled-card border-0 shadow-sm h-100">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="company-logo-placeholder" style={{ background: `${job.color}20`, color: job.color }}>
                                                    {job.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{job.title}</div>
                                                    <div className="text-muted small">{job.org}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span className="text-muted">Stage: <strong style={{ color: job.color }}>{job.stage}</strong></span>
                                                <span style={{ color: job.color, fontWeight: 700 }}>{job.progress}%</span>
                                            </div>
                                            <ProgressBar now={job.progress} style={{ height: 6, borderRadius: 4 }} variant={job.color === '#0d6efd' ? 'primary' : job.color === '#7c3aed' ? 'secondary' : 'success'} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            <Col xs={12} className="text-center mt-2">
                                <p className="text-muted mb-3 small">Login to view and track all your applications in real time.</p>
                                <a href="#" className="btn btn-primary px-4 me-2" onClick={openAppModal}>Login to Continue</a>
                                <a href="#" className="btn btn-outline-secondary px-4" onClick={openAppModal}>View All Applications</a>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                APPLICATION PROCESS
            ════════════════════════════════════════ */}
            <section className="section-bg-white py-5" id="process">
                <Container>
                    <div ref={processRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbTarget size={14} /> How It Works</div>
                            <h2>Simple <span className="text-gradient">Application Process</span></h2>
                            <p>Apply for your dream job in just 6 easy steps – it's completely free.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4 position-relative">
                            {PROCESS_STEPS.map((step, i) => (
                                <Col md={4} lg={2} key={i}>
                                    <div className={`process-step reveal delay-${i + 1}`} style={{ opacity: 1, transform: 'none', transition: 'none' }}>
                                        {i < PROCESS_STEPS.length - 1 && (
                                            <div className="process-connector d-none d-lg-block" />
                                        )}
                                        <div className="process-icon-ring text-primary">
                                            {step.icon}
                                        </div>
                                        <div className="process-step-number">{i + 1}</div>
                                        <h6 className="fw-bold mt-2">{step.title}</h6>
                                        <p className="text-muted small mb-0">{step.desc}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                STUDY MATERIALS
            ════════════════════════════════════════ */}
            <section className="section-bg-light py-5" id="materials">
                <Container>
                    <div ref={materialRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbBook2 size={14} /> Learning Hub</div>
                            <h2>Study <span className="text-gradient">Materials</span></h2>
                            <p>Everything you need to crack your dream exam — all in one place.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4">
                            {STUDY_MATERIALS.map((mat, i) => (
                                <Col sm={6} lg={4} key={i}>
                                    <Card className={`material-card h-100 delay-${(i % 3) + 1}`}>
                                        <div className="material-thumb" style={{ background: `linear-gradient(90deg, ${mat.color}, ${mat.bg})` }} />
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="feature-icon-box flex-shrink-0" style={{ background: mat.bg, color: mat.color, width: 52, height: 52, borderRadius: 14 }}>
                                                    {mat.icon}
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">{mat.title}</h6>
                                                    <p className="text-muted small mb-2">{mat.desc}</p>
                                                    <span className="job-tag" style={{ background: mat.bg, color: mat.color }}>
                                                        <TbTag size={11} /> {mat.count}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="bg-transparent border-0 pt-0 pb-3 px-4">
                                            <a href="#" className="btn btn-sm btn-outline-primary w-100" style={{ borderRadius: 50 }} onClick={openAppModal}>
                                                <TbDownload className="me-1" size={14} />Explore Now
                                            </a>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                WHY CHOOSE US
            ════════════════════════════════════════ */}
            <section className="section-bg-white py-5">
                <Container>
                    <div ref={whyRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><LuBadgeCheck size={14} /> Our Advantages</div>
                            <h2>Why Choose <span className="text-gradient">{appName}?</span></h2>
                            <p>Trusted by over 12 lakh job seekers — here's what makes us different.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4">
                            {[
                                { icon: <TbBell size={26} />, color: '#0d6efd', bg: '#e8f0fe', title: 'Instant Alerts', desc: 'Get notified instantly via email & SMS whenever a new matching job is posted.' },
                                { icon: <TbShield size={26} />, color: '#065f46', bg: '#d1fae5', title: 'Verified Listings', desc: 'Every job is verified by our team — no fake jobs, ever. 100% safe to apply.' },
                                { icon: <TbTrendingUp size={26} />, color: '#7c3aed', bg: '#ede9fe', title: 'Career Growth Tools', desc: 'Resume builder, interview tips, salary insights and career path guidance.' },
                                { icon: <TbDownload size={26} />, color: '#dc2626', bg: '#fee2e2', title: 'Offline Study Mode', desc: 'Download PDFs, notes and videos for offline exam preparation anytime.' },
                                { icon: <LuGraduationCap size={26} />, color: '#b45309', bg: '#fef3c7', title: 'Free Mock Tests', desc: 'Unlimited free mock tests designed by toppers and subject experts.' },
                                { icon: <TbDeviceMobile size={26} />, color: '#0e7490', bg: '#cffafe', title: 'Mobile App', desc: 'Manage applications, tests and alerts on the go from our Android & iOS app.' },
                            ].map((f, i) => (
                                <Col sm={6} lg={4} key={i}>
                                    <div className={`feature-card reveal delay-${(i % 3) + 1}`} style={{ opacity: 1, transform: 'none', transition: 'none' }}>
                                        <div className="feature-icon-box" style={{ background: f.bg, color: f.color }}>
                                            {f.icon}
                                        </div>
                                        <h6 className="fw-bold mb-2">{f.title}</h6>
                                        <p className="text-muted small mb-0">{f.desc}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                TESTIMONIALS
            ════════════════════════════════════════ */}
            <section className="section-bg-light py-5">
                <Container>
                    <div ref={testimRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbStar size={14} /> Success Stories</div>
                            <h2>What Our <span className="text-gradient">Users Say</span></h2>
                            <p>Real stories from real people who found their dream jobs here.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-4">
                            {TESTIMONIALS.map((t, i) => (
                                <Col sm={6} xl={3} key={i}>
                                    <div className={`testimonial-card delay-${i + 1}`}>
                                        <div className="quote-icon">❝</div>
                                        <div className="star-rating mb-2">
                                            {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
                                        </div>
                                        <p className="small text-muted mb-3" style={{ lineHeight: 1.65 }}>"{t.text}"</p>
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0d6efd,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-semibold small">{t.name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                APP DOWNLOAD
            ════════════════════════════════════════ */}
            <section className="app-download-section py-5" id="download">
                <div className="bg-rings">
                    <div className="ring ring-1" /><div className="ring ring-2" /><div className="ring ring-3" />
                </div>
                <Container className="position-relative z-1">
                    <div ref={appRef} className="reveal">
                        <Row className="align-items-center gy-5">
                            <Col lg={6} className="text-white">
                                <div className="badge-pill" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', display: 'inline-flex', marginBottom: 16 }}>
                                    <TbDeviceMobile size={14} /> Download Our App
                                </div>
                                <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
                                    Apply for Jobs<br />
                                    <span className="text-gradient">Anywhere, Anytime!</span>
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 480 }}>
                                    Get instant job alerts, one-click apply, offline study material downloads, live mock tests and real-time application tracking — all in your pocket.
                                </p>
                                <ul className="list-unstyled mt-3 mb-4">
                                    {['Free to download & use', 'Available on Android & iOS', 'Offline study material access', 'Real-time push notifications', '4.8★ rating on App Stores'].map((f, i) => (
                                        <li key={i} className="d-flex align-items-center gap-2 mb-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                                            <TbMail size={18} style={{ color: '#4ade80', flexShrink: 0 }} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="d-flex gap-3 flex-wrap app-store-btns">
                                    <a href="#" className="app-store-btn">
                                        <div className="store-icon" style={{ background: '#222' }}>
                                            <TbBrandGooglePlay size={22} color="#4ade80" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>GET IT ON</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700 }}>Google Play</div>
                                        </div>
                                    </a>
                                    <a href="#" className="app-store-btn">
                                        <div className="store-icon" style={{ background: '#222' }}>
                                            <TbBrandApple size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>DOWNLOAD ON THE</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700 }}>App Store</div>
                                        </div>
                                    </a>
                                </div>
                            </Col>
                            <Col lg={6} className="text-center">
                                <div className="position-relative d-inline-block">
                                    {/* Stylized phone mockup */}
                                    <div style={{
                                        width: 240, height: 480,
                                        background: 'linear-gradient(180deg, #1a2540 0%, #0d1628 100%)',
                                        borderRadius: 40,
                                        border: '6px solid rgba(255,255,255,0.15)',
                                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                                        margin: '0 auto',
                                        animation: 'float 4s ease-in-out infinite',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Status bar */}
                                        <div style={{ height: 28, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
                                        </div>
                                        {/* App screenshot mockup */}
                                        <div style={{ padding: '12px 14px' }}>
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <TbBriefcase size={14} color="#fff" />
                                                </div>
                                                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{appName}</span>
                                            </div>
                                            {[1, 2, 3, 4].map(n => (
                                                <div key={n} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                                                    <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 4, marginBottom: 6 }} />
                                                    <div style={{ width: '60%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                                                </div>
                                            ))}
                                            <div style={{ background: '#0d6efd', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                                                <div style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>Apply Now →</div>
                                            </div>
                                        </div>
                                        {/* Bottom tab bar */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 44, background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px' }}>
                                            {[TbBriefcase, TbSearch, TbBook, TbUser].map((Icon, idx) => (
                                                <div key={idx} style={{ opacity: idx === 0 ? 1 : 0.4 }}>
                                                    <Icon size={18} color={idx === 0 ? '#0d6efd' : '#fff'} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                CTA BANNER
            ════════════════════════════════════════ */}
            <section className="section-bg-white py-5">
                <Container>
                    <div className="cta-banner">
                        <h2 className="fw-black mb-2" style={{ fontSize: 'clamp(1.5rem,3.5vw,2.4rem)' }}>
                            Ready to Launch Your Career?
                        </h2>
                        <p style={{ maxWidth: 500, margin: '0 auto 28px', color: 'rgba(255,255,255,0.8)' }}>
                            Join over 12 lakh job seekers. Register free in under 2 minutes and start applying to jobs today.
                        </p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <a href="#" className="btn btn-light btn-lg px-5 fw-semibold">
                                Register Free <TbArrowRight className="ms-1" />
                            </a>
                            <a href="#jobs" className="btn btn-outline-light btn-lg px-5" onClick={openAppModal}>
                                Browse Jobs
                            </a>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ════════════════════════════════════════
                CONTACT US
            ════════════════════════════════════════ */}
            <section id="contact" className="section-bg-light py-5">
                <Container>
                    <div ref={contactRef} className="reveal">
                        <div className="section-heading">
                            <div className="badge-pill"><TbSend size={14} /> Get In Touch</div>
                            <h2>Contact <span className="text-gradient">Us</span></h2>
                            <p>Have a question or feedback? We'd love to hear from you.</p>
                            <div className="section-divider" />
                        </div>
                        <Row className="align-items-center">
                            <Col lg={6} md={6} className="mb-4 mb-lg-0">
                                <div className="contact-info-left pe-lg-5">
                                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-svg-download-png-4097177.png?f=webp" alt="Contact Us" className="img-fluid rounded mb-4" style={{ maxHeight: 260, objectFit: 'cover' }} />
                                    <h4 className="fw-bold mb-2">We're here to help!</h4>
                                    <ul className="list-unstyled mb-3">
                                        <li className="mb-2"><TbMail className="me-2 text-primary" /> support@jobportal.com</li>
                                        <li className="mb-2"><TbPhone className="me-2 text-primary" /> +91 98765 43210</li>
                                        <li className="mb-2"><TbBuilding className="me-2 text-primary" /> 123, Sector 21, Noida, India</li>
                                    </ul>
                                    <p className="text-muted">Reach out for job queries, partnership, or technical support. Our team responds within 24 hours.</p>
                                </div>
                            </Col>
                            <Col lg={6} md={6}>
                                <Card className="contact-card shadow">
                                    <Card.Header className="d-flex align-items-center gap-2 py-3 bg-white" style={{ borderBottom: '1px dashed #dee2e6', borderRadius: '20px 20px 0 0' }}>
                                        <span className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style={{ width: 36, height: 36, minWidth: 36 }}>
                                            <TbSend size={18} />
                                        </span>
                                        <h5 className="mb-0 fw-semibold">Send Us a Message</h5>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Form onSubmit={handleSubmit}>
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold small">Full Name <span className="text-danger">*</span></Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><TbUser size={16} /></span>
                                                            <Form.Control type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required style={{ background: 'var(--inputField-bg)' }} />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold small">Email Address <span className="text-danger">*</span></Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><TbMail size={16} /></span>
                                                            <Form.Control type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required style={{ background: 'var(--inputField-bg)' }} />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold small">Phone Number</Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><TbPhone size={16} /></span>
                                                            <Form.Control type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} style={{ background: 'var(--inputField-bg)' }} />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold small">Message <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control as="textarea" rows={4} name="message" placeholder="Write your message here..." value={formData.message} onChange={handleChange} required style={{ background: 'var(--inputField-bg)' }} />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} className="text-end">
                                                    <Button type="submit" variant="primary" disabled={submitting} style={{ borderRadius: 50, paddingLeft: 32, paddingRight: 32 }}>
                                                        {submitting
                                                            ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                                                            : <><TbSend className="me-2" size={16} />Send Message</>}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            <Modal centered show={showAppModal} onHide={() => setShowAppModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Download App To Continue</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="text-muted mb-3">
                        Scan the QR code or open the app store to continue your application.
                    </p>
                    <img
                        src={APP_QR_IMAGE}
                        alt="App download QR"
                        width={220}
                        height={220}
                        className="img-fluid rounded border"
                    />
                    <div className="mt-4 d-grid gap-2">
                        <a href={APP_STORE_LINK} target="_blank" rel="noreferrer" className="btn btn-primary">
                            <TbBrandGooglePlay className="me-2" />Open Play Store
                        </a>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Home;