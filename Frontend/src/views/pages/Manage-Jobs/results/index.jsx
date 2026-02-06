import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import ResultsGovernmentList from './components/ResultsGovernmentList';
import ResultsPSUList from './components/ResultsPSUList';
import { useState } from 'react';


const Results = () => {
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
                        <h4 className="mb-0 ">{activeTab} Results</h4>
                    </div>
                } className="py-2"  isLink={<Link to="/admin/result/add"  >
                    + Add Result
                </Link>}>
                    <TabContent className="pt-2">
                        <TabPane eventKey="Government" >
                            <ResultsGovernmentList isActive={activeTab === "Government"} />
                        </TabPane>
                        <TabPane eventKey="PSU" >
                            <ResultsPSUList isActive={activeTab === "PSU"} />
                        </TabPane>
                    </TabContent>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Results;