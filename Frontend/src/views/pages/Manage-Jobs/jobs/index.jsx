import { Link, useNavigate } from "react-router-dom";
import Government from "./components/GovernmentList"
import Private from "./components/PrivateList"
import PSUList from "./components/PSUList"
import { Nav, NavItem, NavLink, TabContainer, TabPane, TabContent } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("Private");


  return (
    <div className="mt-4 pb-3">
      <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem className="nav-tabs-nav d-flex">
            <NavLink eventKey="Private" id="0">Private Sector</NavLink>
            <NavLink eventKey="GovernMent" id="2">Government Sector</NavLink>
            <NavLink eventKey="PSU" id="3">PSU Sector</NavLink>
          </NavItem>
        </Nav>
        <ComponentCard
          title={
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 ">{activeTab} Jobs</h4>
            </div>
          }
          className="py-2"
          isLink={
            <Link to="/admin/jobs/add">
              + Add Job
            </Link>
          }
        >
        <TabContent className="pt-2">
          <TabPane eventKey="Private">
            <Private isActive={activeTab === "Private"} />
          </TabPane>

          <TabPane eventKey="GovernMent">
            <Government isActive={activeTab === "GovernMent"} />
          </TabPane>

          <TabPane eventKey="PSU">
            <PSUList isActive={activeTab === "PSU"} />
          </TabPane>
        </TabContent>
      </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default Page;
