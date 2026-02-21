import ComponentCard from '@/components/ComponentCard';
import { Link } from "react-router-dom";
import StudyMaterialList from './components/StudyMaterialList';
import { useState } from 'react';

const Page = () => {
    const [activeTab] = useState("StudyMaterial");

    return (
        <div className="mt-4 pb-3">
            <ComponentCard
                title={
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 py-0 fs-4 fw-light">Study Materials</h4>
                    </div>
                }
                className="py-2"
                isLink={
                    <Link to="/admin/study-material/add">
                        + Add Study Material
                    </Link>
                }
            >
                <StudyMaterialList isActive={true} />
            </ComponentCard>
        </div>
    );
};

export default Page;