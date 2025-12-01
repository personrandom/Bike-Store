import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Badge, Col, Container, Form, Row } from "react-bootstrap";

export default function Customer() {

    function showBikes() {
        //call the querry
        console.log("HI")
    }
    return (
        <Container>
            <Row>
                <Col>
                    <Link to={"/"}><Button className="m-5 d-flex justify-content-start">Go Home</Button></Link>
                </Col>
                <Col>
                    <h2 className="d-flex justify-content-end"><Badge className="ms-5 mt-5" >Cart()</Badge></h2>
                </Col>
            </Row>
            <div className="text-center">
                Welcome Customer!!!
                Type in the fields below to begin!
            </div>
            <Row>
                <Form className="m-3">
                    <Form.Group className="mt-3">
                        <Form.Label>Search By Product Name</Form.Label>
                        <Form.Control placeholder="Haro Shift R3"/>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Search By Brand Name</Form.Label>
                        <Form.Control placeholder="Trek, Strider, etc."/>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Row>
                            <Col>
                                <Form.Label>Search By Category</Form.Label>
                                <Form.Control placeholder="Mountain Bikes"/>
                            </Col>
                            <Col>
                                <Form.Label>Search By Year</Form.Label>
                                {/* Include some checking to ensure format */}
                                <Form.Control placeholder="dd/mm/yyyy"/>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Search By Company</Form.Label>
                        {/* This needs to be dynamicly based on stores present */}
                        <Form.Select defaultValue={"Any"}>
                            <option>Any</option>
                            <option>Santa Cruz Bikes</option>
                            <option>Baldwin Bikes</option>
                            <option>Rowlett Bikes</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Row>
                            <Col>
                                <Button onClick={showBikes}>Search</Button>
                            </Col>
                            <Col>
                                <Button>Clear</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
    )
}