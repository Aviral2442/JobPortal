import {
    Button,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    ProgressBar,
    Row
} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import ComponentCard from '@/components/ComponentCard'
import Flatpickr from 'react-flatpickr'
import {useWizard, Wizard} from 'react-use-wizard'
import {LuWandSparkles} from 'react-icons/lu'
import {TbBook, TbFolder, TbMapPin, TbUserCircle, TbUsers} from 'react-icons/tb'
import clsx from 'clsx'

const Header = ({className, withProgress}: { className?: string; withProgress?: boolean }) => {
    const {goToStep, activeStep, stepCount} = useWizard()

    return (
        <>
            {withProgress &&
                <ProgressBar now={(activeStep + 1) * (100 / stepCount)} className="mb-3" style={{height: '6px'}}/>}

            <ul className={clsx('nav nav-tabs wizard-tabs mb-3', className)}>
                <li className="nav-item">
                    <button
                        className={clsx('nav-link d-flex w-100 text-start border-0', activeStep === 0 && 'active', activeStep > 0 && 'wizard-item-done')}
                        onClick={() => goToStep(0)}>
            <span className="d-flex align-items-center">
              <TbUserCircle className="fs-32"/>
              <span className="flex-grow-1 ms-2 text-truncate">
                <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">Student Info</span>
                <span className="fs-xxs mb-0">Personal details</span>
              </span>
            </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={clsx('nav-link d-flex w-100 text-start border-0', activeStep === 1 && 'active', activeStep > 1 && 'wizard-item-done')}
                        onClick={() => goToStep(1)}>
            <span className="d-flex align-items-center">
              <TbMapPin className="fs-32"/>
              <span className="flex-grow-1 ms-2 text-truncate">
                <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">Address Info</span>
                <span className="fs-xxs mb-0">Where you live</span>
              </span>
            </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={clsx('nav-link d-flex w-100 text-start border-0', activeStep === 2 && 'active', activeStep > 2 && 'wizard-item-done')}
                        onClick={() => goToStep(2)}>
            <span className="d-flex align-items-center">
              <TbBook className="fs-32"/>
              <span className="flex-grow-1 ms-2 text-truncate">
                <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">Course Info</span>
                <span className="fs-xxs mb-0">Select your course</span>
              </span>
            </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={clsx('nav-link d-flex w-100 text-start border-0', activeStep === 3 && 'active', activeStep > 3 && 'wizard-item-done')}
                        onClick={() => goToStep(3)}>
            <span className="d-flex align-items-center">
              <TbUsers className="fs-32"/>
              <span className="flex-grow-1 ms-2 text-truncate">
                <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">Parent Info</span>
                <span className="fs-xxs mb-0">Guardian details</span>
              </span>
            </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={clsx('nav-link d-flex w-100 text-start border-0', activeStep === 4 && 'active', activeStep > 4 && 'wizard-item-done')}
                        onClick={() => goToStep(4)}>
            <span className="d-flex align-items-center">
              <TbFolder className="fs-32"/>
              <span className="flex-grow-1 ms-2 text-truncate">
                <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">Documents</span>
                <span className="fs-xxs mb-0">Upload certificates</span>
              </span>
            </span>
                    </button>
                </li>
            </ul>
        </>
    )
}

const Step1 = ({className}: { className?: string }) => {
    const {nextStep} = useWizard()

    return (
        <Form className={`${className}`}>
            <Row>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl type="text" placeholder="Enter your full name" name="fullname" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl type="email" placeholder="Enter your email" name="email" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl type="tel" placeholder="Enter your phone number" name="phone" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Date of Birth</FormLabel>
                        <Flatpickr className="form-control" placeholder="Select you DOB"
                                   options={{dateFormat: 'd M, Y'}} name="dob" required/>
                    </FormGroup>
                </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" onClick={nextStep}>
                    Next: Address Info →
                </Button>
            </div>
        </Form>
    )
}

const Step2 = ({className}: { className?: string }) => {
    const {previousStep, nextStep} = useWizard()

    return (
        <Form className={`${className}`}>
            <Row>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl type="text" placeholder="123 Main St" name="street" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>City</FormLabel>
                        <FormControl type="text" placeholder="e.g., New York" name="city" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>State</FormLabel>
                        <FormControl type="text" placeholder="e.g., California" name="state" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl type="text" placeholder="e.g., 10001" name="zip" required/>
                    </FormGroup>
                </Col>
            </Row>
            <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={previousStep}>
                    ← Back: Student Info
                </Button>
                <Button variant="primary" onClick={nextStep}>
                    Next: Course Info →
                </Button>
            </div>
        </Form>
    )
}

const Step3 = ({className}: { className?: string }) => {
    const {previousStep, nextStep} = useWizard()

    return (
        <Form className={`${className}`}>
            <Row>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Choose Course</FormLabel>
                        <FormSelect name="course" required>
                            <option value="">Select</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medical">Medical</option>
                            <option value="Business">Business</option>
                        </FormSelect>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Enrollment Type</FormLabel>
                        <FormSelect name="enrollment" required>
                            <option value="">Select</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                        </FormSelect>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Preferred Batch Time</FormLabel>
                        <FormSelect name="batch_time" required>
                            <option value="">Select Time</option>
                            <option value="Morning">Morning (8am – 12pm)</option>
                            <option value="Afternoon">Afternoon (1pm – 5pm)</option>
                            <option value="Evening">Evening (6pm – 9pm)</option>
                        </FormSelect>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Mode of Study</FormLabel>
                        <FormSelect name="mode" required>
                            <option value="">Select Mode</option>
                            <option value="Offline">Offline</option>
                            <option value="Online">Online</option>
                            <option value="Hybrid">Hybrid</option>
                        </FormSelect>
                    </FormGroup>
                </Col>
            </Row>
            <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={previousStep}>
                    ← Back: Address Info
                </Button>
                <Button variant="primary" onClick={nextStep}>
                    Next: Parent Info →
                </Button>
            </div>
        </Form>
    )
}

const Step4 = ({className}: { className?: string }) => {
    const {previousStep, nextStep} = useWizard()

    return (
        <Form className={`${className}`}>
            <Row>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Parent/Guardian Name</FormLabel>
                        <FormControl type="text" placeholder="e.g., John Doe" name="parent_name" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Relation</FormLabel>
                        <FormControl type="text" placeholder="e.g., Father, Mother" name="relation" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Parent Phone</FormLabel>
                        <FormControl type="tel" placeholder="e.g., +1 555 123 4567" name="parent_phone" required/>
                    </FormGroup>
                </Col>
                <Col xl={6}>
                    <FormGroup className="mb-3">
                        <FormLabel>Parent Email</FormLabel>
                        <FormControl type="email" placeholder="e.g., parent@example.com" name="parent_email" required/>
                    </FormGroup>
                </Col>
            </Row>
            <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={previousStep}>
                    ← Back: Course Info
                </Button>
                <Button variant="primary" onClick={nextStep}>
                    Next: Documents →
                </Button>
            </div>
        </Form>
    )
}

const Step5 = ({className}: { className?: string }) => {
    const {previousStep} = useWizard()

    return (
        <Form className={`${className}`}>
            <FormGroup className="mb-3">
                <FormLabel>Upload ID Proof</FormLabel>
                <FormControl type="file" name="id_proof" required/>
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>Upload Previous Marksheet</FormLabel>
                <FormControl type="file" name="marksheet" required/>
            </FormGroup>
            <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={previousStep}>
                    ← Back: Parent Info
                </Button>
                <Button variant="success">Submit Application</Button>
            </div>
        </Form>
    )
}

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Form Wizard"
                subtitle="Guide users through multi-step forms with clear navigation and progress tracking for improved user experience."
                badge={{
                    title: 'Multi-Step Forms',
                    icon: LuWandSparkles,
                }}
            />

            <Row>
                <Col cols={12}>
                    <ComponentCard title="Basic Wizard">
                        <Wizard header={<Header/>}>
                            <Step1/>
                            <Step2/>
                            <Step3/>
                            <Step4/>
                            <Step5/>
                        </Wizard>
                    </ComponentCard>

                    <ComponentCard title="Wizard with Progress">
                        <Wizard header={<Header withProgress/>}>
                            <Step1/>
                            <Step2/>
                            <Step3/>
                            <Step4/>
                            <Step5/>
                        </Wizard>
                    </ComponentCard>

                    <ComponentCard title="Vertical Wizard">
                        <div className="row">
                            <Wizard
                                header={
                                    <div className="col-md-4">
                                        <Header className="flex-column wizard-bordered wizard-tabs nav-pills"/>
                                    </div>
                                }>
                                <Step1 className="col-md-8 border border-dashed rounded p-4"/>
                                <Step2 className="col-md-8 border border-dashed rounded p-4"/>
                                <Step3 className="col-md-8 border border-dashed rounded p-4"/>
                                <Step4 className="col-md-8 border border-dashed rounded p-4"/>
                                <Step5 className="col-md-8 border border-dashed rounded p-4"/>
                            </Wizard>
                        </div>
                    </ComponentCard>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
