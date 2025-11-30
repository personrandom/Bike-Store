import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Col, Container, Row, Form } from "react-bootstrap";
import { useState } from "react";

export default function Employee() {

    const [shipStatus, setShipStatus] = useState(1)

    return (
        <Container>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Hello my fellow employee!!!
                Display order records and update payment statuses below
                <Row>
                    {/* Employee needs to sort orders by 1. status 2. date 3. if shipped 4. Customer 5. staff_id */}
                    <Form className="m-3">
                        <Form.Group>
                            <Form.Label>Filter By Date</Form.Label>
                            <Form.Control/>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col>
                                    <Form.Label>Filter By Customer Name</Form.Label>
                                    <Form.Control/>
                                </Col>
                                <Col>
                                    <Form.Label>Filter By Staff_ID</Form.Label>
                                    <Form.Control placeholder="Enter staff ID"/>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Label className="my-2">Filter By Payment Status</Form.Label>
                                <Col>
                                    <Form.Check>
                                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" checked={shipStatus == 1} onChange={() => setShipStatus(1)}/>
                                        <label className="form-check-label me-4">Recently Bought</label>
                                        
                                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" checked={shipStatus == 2} onChange={() => setShipStatus(2)}/>
                                        <label className="form-check-label me-4">Procesed</label>

                                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" checked={shipStatus == 3} onChange={() => setShipStatus(3)}/>
                                        <label className="form-check-label me-4">Prepared to Ship</label>

                                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" checked={shipStatus == 4} onChange={() => setShipStatus(4)}/>
                                        <label className="form-check-label me-4">Shipped</label>
                                    </Form.Check>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                    <Col>
                        <Button>
                            See Orders
                        </Button>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}