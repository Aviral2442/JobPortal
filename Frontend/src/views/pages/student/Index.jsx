import { useState } from 'react';
import {TabContainer, TabPane } from 'react-bootstrap';
import ComponentCard from '@/components/ComponentCard';
import { Link } from 'react-router-dom';
import StudentList from '@/views/tables/data-tables/student-data/';

const StudentManagement = () => {
  const [refreshFlag, _setRefreshFlag] = useState(0);

  return (
    <div className="mt-4 pb-3">
      <TabContainer defaultActiveKey="student-list">
        
        <ComponentCard 
          title="Students" 
          className="py-2"
          isLink={
            <Link to="/admin/students/add" className="btn btn-sm btn-primary">
              + Add Student
            </Link>
          }
        >
          <TabPane eventKey="student-list">
            <StudentList refreshFlag={refreshFlag} />
          </TabPane>
        </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default StudentManagement;