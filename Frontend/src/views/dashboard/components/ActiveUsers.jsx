import { Card, CardBody, CardFooter, ProgressBar } from 'react-bootstrap';
import { LuUsers } from 'react-icons/lu';
import CountUp from "react-countup";
const ActiveUsers = () => {
  return <Card className="card-h-100">
            <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="text-uppercase mb-3">Active Users</h5>
                        <h3 className="mb-0 fw-normal">
                        <span>
                          <CountUp end={342} duration={2} enableScrollSpy scrollSpyOnce />
                        </span>
                        </h3>
                        <p className="text-muted mb-2">In the last hour</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10" />
                    </div>
                </div>

                <ProgressBar now={68} className="progress-lg mb-3" />

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">Avg. Session Time Counts Total </span>
                        <h5 className="mb-0">4m 12s</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Returning Users</span>
                        <h5 className="mb-0">54.9%</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">52 new users joined today</CardFooter>
        </Card>;
};
export default ActiveUsers;