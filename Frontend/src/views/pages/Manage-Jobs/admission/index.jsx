import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';
import AdmissionList from './components/AdmissionList';

const Results = () => {
    return <>
        <div className="mt-4 pb-3 ">
           
            <TabContainer defaultActiveKey="Admission-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Admission-List" id='1'>
                            Results
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="Admission List" className="py-2"  isLink={<Link to="/"  >
                    + Add Admissions
                </Link>}>
                    <TabPane eventKey="Admission-List" >
                        <AdmissionList />
                        {/* <SnowEditor/> */}
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Results;