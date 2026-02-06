import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";
import AdmitCardGovernmentList from './components/AdmitCardGovernmentList';
import AdmitCardPSUList from './components/AdmitCardPSUList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { useState } from 'react';


const Page = () => {
    const [activeTab, setActiveTab] = useState("Government");

    return <>
        <div className="mt-4 pb-3 ">

            <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem className="nav-tabs-nav d-flex">
                        <NavLink eventKey="Government" id='1'>
                            Government Sector
                        </NavLink>
                        <NavLink eventKey="PSU" id='2'>
                            PSU Sector
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title={
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 ">{activeTab} Admit Cards</h4>
                    </div>
                } className="py-2" isLink={<Link to="/admin/admit-card/add"  >
                    + Add Admit Card
                </Link>}>
                    <TabContent className="pt-2">
                        <TabPane eventKey="Government" >
                            <AdmitCardGovernmentList isActive={activeTab === "Government"} />
                        </TabPane>
                        <TabPane eventKey="PSU" >
                            <AdmitCardPSUList isActive={activeTab === "PSU"} />
                        </TabPane>
                    </TabContent>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Page;