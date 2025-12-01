import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Badge, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";

export default function Customer() {

    interface Product {
    product_id: number;
    product_name: string;
    brand_id: number;
    category_id: number;
    model_year: number;
    list_price: number;
    }

    const [productName, setProductName] = useState("")
    const [brandName, setBrandName] = useState("")
    const [category, setCategory] = useState("")
    const [year, setYear] = useState("")
    const [company, setCompany] = useState("Any")
    const [bikes, setBikes] = useState<Product[]>([]);


    async function showBikes() {
         //call the querry
         console.log(productName)
         const res = await fetch("http://localhost:3001/products");
         const data = await res.json();
         console.log("First 50 bikes:", data);
         setBikes(data)
         
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
                        <Form.Control placeholder="Haro Shift R3" onChange={e => setProductName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Search By Brand Name</Form.Label>
                        <Form.Control placeholder="Trek, Strider, etc." onChange={e => setBrandName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Row>
                            <Col>
                                <Form.Label>Search By Category</Form.Label>
                                <Form.Control placeholder="Mountain Bikes" onChange={e => setCategory(e.target.value)}/>
                            </Col>
                            <Col>
                                <Form.Label>Search By Year</Form.Label>
                                {/* Include some checking to ensure format */}
                                <Form.Control placeholder="dd/mm/yyyy" onChange={e => setYear(e.target.value)}/>
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
            { bikes.length != 0 ? <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Year</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {bikes.map((bike) => (
                        <tr key={bike.product_id}>
                            <td>{bike.product_id}</td>
                            <td>{bike.product_name}</td>
                            <td>{bike.brand_id}</td>
                            <td>{bike.category_id}</td>
                            <td>{bike.model_year}</td>
                            <td>${bike.list_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table> : <></>}
        </Container>
    )
}