import { Link, useNavigate } from "react-router-dom";
import Government from "./components/GovernmentList"
import Private from "./components/PrivateList"
import PSUList from "./components/PSUList"
import { Nav, NavItem, NavLink, TabContainer, TabPane } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);


  return (
    <div className="mt-4 pb-3">
      <TabContainer defaultActiveKey="Private">
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem className="nav-tabs-nav d-flex">
            <NavLink eventKey="Private" id="0">Private Sector</NavLink>
            <NavLink eventKey="GovernMent" id="2">Government Sector</NavLink>
            <NavLink eventKey="PSU" id="3">PSU Sector</NavLink>
          </NavItem>
        </Nav>
        <ComponentCard
          title="Jobs"
          className="py-2"
          isLink={
            <Link to="/admin/jobs/add">
              + Add Job
            </Link>
          }
        >
          <TabPane eventKey="Private">
            <Private />
          </TabPane>
          <TabPane eventKey="GovernMent">
            <Government />
          </TabPane>
          <TabPane eventKey="PSU">
            <PSUList />
          </TabPane>
        </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default Page;
