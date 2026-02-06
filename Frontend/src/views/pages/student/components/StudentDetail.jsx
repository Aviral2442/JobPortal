import { Link, useNavigate } from "react-router-dom";
import Profile from "@/components/Student/WizardStudentDetail"
import JobAppliedOn from "@/components/Student/JobAppliedOn";
import { Nav, NavItem, NavLink, TabContainer, TabPane, TabContent } from "react-bootstrap";
import { useState } from "react";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");


  return (
    <div className="mt-4">
      <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem className="nav-tabs-nav d-flex">
            <NavLink eventKey="Profile" id="0">Profile</NavLink>
            <NavLink eventKey="Job-Applied" id="2">Job Applied On</NavLink>
          </NavItem>
        </Nav>
        <TabContent className="">
          <TabPane eventKey="Profile">
            <Profile isActive={activeTab === "Profile"} />
          </TabPane>

          <TabPane eventKey="Job-Applied">
            <JobAppliedOn isActive={activeTab === "Job-Applied"} />
          </TabPane>
        </TabContent>
      {/* </ComponentCard> */}
      </TabContainer>
    </div>
  );
};

export default Page;
