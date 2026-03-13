import { useState } from "react";
import { TabContainer, TabPane } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import ContactUsList from "@/views/tables/data-tables/contact-us-data";

const ContactUsSubmissions = () => {
  const [refreshFlag, _setRefreshFlag] = useState(0);

  return (
    <div className="mt-4 pb-3">
      <TabContainer defaultActiveKey="contact-us-list">
        <ComponentCard title="Contact Us Submissions" className="py-2">
          <TabPane eventKey="contact-us-list">
            <ContactUsList refreshFlag={refreshFlag} />
          </TabPane>
        </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default ContactUsSubmissions;