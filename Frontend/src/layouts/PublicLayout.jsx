import { Outlet } from 'react-router';
import { Container, Navbar } from 'react-bootstrap';
import { appName, currentYear } from '@/helpers';
import logoSm from '@/assets/images/logo-sm.png';
import { Link } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            {/* ─── Header ─── */}
            <Navbar
                expand="lg"
                className="shadow-sm px-3 px-md-4 py-2"
                style={{ background: '#fff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 1030 }}
            >
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 text-decoration-none">
                        <img src={logoSm} alt={appName} height={36} />
                        <span className="fw-bold fs-5">{appName}</span>
                    </Navbar.Brand>
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/about-us" className="btn btn-outline-primary btn-sm">About Us</Link>
                        <Link to="/terms-and-conditions" className="btn btn-outline-primary btn-sm">Terms & Conditions</Link>
                        <Link to="/privacy-policy" className="btn btn-outline-primary btn-sm">Privacy Policy</Link>
                        <Link to="/admin/login" className="btn btn-primary btn-sm">Admin Login</Link>
                    </div>
                </Container>
            </Navbar>

            {/* ─── Page Content ─── */}
            <div className="flex-grow-1">
                <Outlet />
            </div>

            {/* ─── Footer ─── */}
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

export default PublicLayout;
