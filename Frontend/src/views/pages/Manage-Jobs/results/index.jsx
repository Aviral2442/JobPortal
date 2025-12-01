import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';
import ResultsList from './components/ResultsList';


const Results = () => {
    return <>
        <div className="mt-4 pb-3 ">
           
            <TabContainer defaultActiveKey="Results-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Results-List" id='1'>
                            Results
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="Results List" className="py-2"  isLink={<Link to="/admin/result/add"  >
                    + Add Result
                </Link>}>
                    <TabPane eventKey="Results-List" >
                        <ResultsList />
                        {/* <SnowEditor/> */}
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Results;