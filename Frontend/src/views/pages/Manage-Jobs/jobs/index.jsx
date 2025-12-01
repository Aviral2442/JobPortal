import { Link, useNavigate } from "react-router-dom";
import JobList from "./components/JobList";
import { Nav, NavItem, NavLink, TabContainer, TabPane } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);


  return (
    <div className="mt-4 pb-3">
      <TabContainer defaultActiveKey="Job-List">
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem>
            <NavLink eventKey="Job-List" id="1">Job List</NavLink>
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
          <TabPane eventKey="Job-List">
            <JobList />
          </TabPane>
        </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default Page;
