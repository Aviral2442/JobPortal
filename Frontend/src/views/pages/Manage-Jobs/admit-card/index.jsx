import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";
import AdmitCardList from './components/AdmitCardList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';


const Page = () => {
    return <>
        <div className="mt-4 pb-3 ">
           
            <TabContainer defaultActiveKey="Admit-Card-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Admit-Card-List" id='1'>
                           Admit Cards List
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="Admit Card" className="py-2"  isLink={<Link to="/admin/admit-card/add"  >
                    + Add Admit Card
                </Link>}>
                    <TabPane eventKey="Admit-Card-List" >
                        <AdmitCardList />
                        {/* <SnowEditor/> */}
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Page;