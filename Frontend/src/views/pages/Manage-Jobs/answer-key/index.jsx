import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';
import AnswerKeyList from './components/AnswerKeyList';

const Results = () => {
    return <>
        <div className="mt-4 pb-3 ">
           
            <TabContainer defaultActiveKey="Answer-Key-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Answer-Key-List" id='1'>
                            Results
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="Answer Key List" className="py-2"  isLink={<Link to="/admin/answer-key/add"  >
                    + Add Answer Key 
                </Link>}>
                    <TabPane eventKey="Answer-Key-List" >
                        <AnswerKeyList />
                        {/* <SnowEditor/> */}
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Results;