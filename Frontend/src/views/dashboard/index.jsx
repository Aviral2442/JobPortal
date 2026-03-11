import { Col, Container, Row } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import { LuSparkles } from 'react-icons/lu';
import PromptsUsage from '@/views/dashboard/components/PromptsUsage';
import ActiveUsers from '@/views/dashboard/components/ActiveUsers';
import ResponseAccuracy from '@/views/dashboard/components/ResponseAccuracy';
import TokenUsage from '@/views/dashboard/components/TokenUsage';
import RequestStatistics from '@/views/dashboard/components/RequestStatistics';
import RecentSessions from '@/views/dashboard/components/RecentSessions';
import ModelUsageSummary from '@/views/dashboard/components/ModelUsageSummary';
import APIPerformanceMetrics from '@/views/dashboard/components/APIPerformanceMetrics';
const Page = () => {
  return <Container fluid>
            <PageTitle title="Job Portal" subtitle="A premium collection of elegant, accessible components and a powerful codebase. Built for modern frameworks. Developer Friendly. Production Ready." badge={{
      title: 'Medium and Large Business',
      icon: LuSparkles
    }} />

            <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
                <Col>
                    <PromptsUsage />
                </Col>

                <Col>
                    <ActiveUsers />
                </Col>

                <Col>
                    <ResponseAccuracy />
                </Col>

                <Col>
                    <TokenUsage />
                </Col>
            </Row>

            <Row>
                <Col cols={12}>
                    <RequestStatistics />
                </Col>
            </Row>

            <Row>
                <Col xxl={6}>
                    <RecentSessions />
                </Col>

                <Col xxl={6}>
                    <ModelUsageSummary />

                    <APIPerformanceMetrics />
                </Col>
            </Row>
        </Container>;
};
export default Page;