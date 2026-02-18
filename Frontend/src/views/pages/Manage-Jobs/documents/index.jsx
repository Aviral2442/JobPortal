import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Nav, NavItem, NavLink, TabContainer, TabPane } from 'react-bootstrap';
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
                <ComponentCard title="Document List" className="py-2"  isLink={<Link to="/admin/documents/add"  >
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