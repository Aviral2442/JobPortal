import { useLayoutContext } from '@/context/useLayoutContext';
import CustomizerToggler from '@/layouts/components/topbar/components/CustomizerToggler';
import LanguageDropdown from '@/layouts/components/topbar/components/LanguageDropdown';
import MegaMenu from '@/layouts/components/topbar/components/MegaMenu';
import NotificationDropdown from '@/layouts/components/topbar/components/NotificationDropdown';
import ThemeToggler from '@/layouts/components/topbar/components/ThemeToggler';
import UserProfile from '@/layouts/components/topbar/components/UserProfile';
import { Link } from 'react-router';
import { Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormControl } from 'react-bootstrap';
import { LuMenu, LuSearch, LuSparkles } from 'react-icons/lu';
import logoSm from '@/assets/images/logo-sm.png';
import { TbActivity, TbChevronDown, TbSettings, TbUserPlus } from 'react-icons/tb';
import SkinDropdown from '@/layouts/components/topbar/components/SkinDropdown';
import MonochromeModeToggler from '@/layouts/components/topbar/components/MonochromeModeToggler';
import { appName } from '@/helpers';
const Topbar = () => {
  const {
    changeSideNavSize,
    showBackdrop
  } = useLayoutContext();
  const toggleSideNav = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-sidenav-size');
    if (currentSize === 'offcanvas') {
      html.classList.toggle('sidebar-enable');
      showBackdrop();
    } else {
      changeSideNavSize(currentSize === 'collapse' ? 'default' : 'collapse');
    }
  };
  return <header className="app-topbar">
            <Container fluid className="topbar-menu">
                <div className="d-flex align-items-center align-items-center gap-2">
                    <div className="logo-topbar">
                        <Link to="/" className="logo-dark">
              <span className="d-flex align-items-center gap-1">
                <span className="avatar avatar-xs rounded-circle text-bg-dark">
                  <span className="avatar-title">
                    <LuSparkles className="fs-md" />
                  </span>
                </span>
                <span className="logo-text text-body fw-bold fs-xl">{appName}</span>
              </span>
                        </Link>
                        <Link to="/" className="logo-light">
              <span className="d-flex align-items-center gap-1">
                <span className="avatar avatar-xs rounded-circle text-bg-dark">
                  <span className="avatar-title">
                    <LuSparkles className="fs-md" />
                  </span>
                </span>
                <span className="logo-text text-white fw-bold fs-xl">{appName}</span>
              </span>
                        </Link>
                    </div>

                    <div className="d-lg-none d-flex mx-1">
                        <Link to="/">
                            <img src={logoSm} width={28} height={28} alt="Logo" />
                        </Link>
                    </div>

                    <button onClick={toggleSideNav} className="button-collapse-toggle d-xl-none">
                        <LuMenu className="fs-22 align-middle" />
                    </button>

                    {/* <div className="topbar-item d-none d-lg-flex">
                        <Link to="" className="topbar-link btn shadow-none btn-link px-2 disabled">
                            {' '}
                            v1.0.0
                        </Link>
                    </div>

                    <div className="topbar-item d-none d-lg-flex">
                        <Link to="" className="topbar-link btn shadow-none btn-link px-2">
                            {' '}
                            Home
                        </Link>
                    </div>
                    
                    <div className="topbar-item d-none d-lg-flex">
                        <Link to="" className="topbar-link btn shadow-none btn-link px-2">
                            {' '}
                            Contact
                        </Link>
                    </div> */}
                    {/* <div className="topbar-item d-none d-md-flex">
                        <Dropdown>
                            <DropdownToggle className="topbar-link btn shadow-none btn-link dropdown-toggle drop-arrow-none px-2">
                                Contact <TbChevronDown className="ms-1" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <TbUserPlus className="fs-15 me-1" /> Add Project Member
                                </DropdownItem>
                                <DropdownItem>
                                    <TbActivity className="fs-15 me-1" /> View Activity
                                </DropdownItem>
                                <DropdownItem>
                                    <TbSettings className="fs-15 me-1" /> Settings
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}

                    {/* <MegaMenu /> */}
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="app-search d-none d-xl-flex me-xl-2">
                        <FormControl type="search" className="topbar-search" name="search" placeholder="Search for something..." />
                        <LuSearch className="app-search-icon text-muted" />
                    </div>

                    <SkinDropdown />

                    {/* <LanguageDropdown /> */}

                    {/* <NotificationDropdown /> */}

                    {/* <CustomizerToggler /> */}

                    <ThemeToggler />

                    {/* <MonochromeModeToggler /> */}

                    <UserProfile />
                </div>
            </Container>
        </header>;
};
export default Topbar;