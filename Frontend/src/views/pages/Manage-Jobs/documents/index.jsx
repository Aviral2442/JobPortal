import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';
import DocumentList from './Components/DocumentList';

const Results = () => {
    return <>
        <div className="mt-4 pb-3 ">
           
            <TabContainer defaultActiveKey="Document-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Document-List" id='1'>
                            Documents   
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="Document List" className="py-2"  isLink={<Link to="/"  >
                    + Add Documents
                </Link>}>
                    <TabPane eventKey="Document-List" >
                        <DocumentList />
                        {/* <SnowEditor/> */}
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Results;