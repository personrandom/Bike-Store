import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
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
    // from JOINs in /products route
    brand_name?: string;
    category_name?: string;
    store_name?: string;
  }

  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [store, setStore] = useState("Any");
  const [bikes, setBikes] = useState<Product[]>([]);

  async function showBikes() {
    const params = new URLSearchParams();
    if (productName.trim()) params.append("productName", productName.trim());
    if (brandName.trim()) params.append("brandName", brandName.trim());
    if (category.trim()) params.append("category", category.trim());
    if (year.trim()) params.append("year", year.trim());
    if (store !== "Any") params.append("storeName", store);

    const query = params.toString();
    const url = `http://localhost:3001/products${query ? `?${query}` : ""}`;

    console.log("Searching bikes with filters:", {
      productName,
      brandName,
      category,
      year,
      store,
    });

    const res = await fetch(url);
    const data = await res.json();
    console.log("Bike search results:", data);

    setBikes(data);
  }

  function clearFilters() {
    setProductName("");
    setBrandName("");
    setCategory("");
    setYear("");
    setStore("Any");
    setBikes([]);
  }

  return (
    <Container>
      <Row>
        <Col>
          <Link to={"/"}>
            <Button className="m-5 d-flex justify-content-start">
              Go Home
            </Button>
          </Link>
        </Col>
        <Col>
          <h2 className="d-flex justify-content-end">
            <Badge className="ms-5 mt-5">Cart()</Badge>
          </h2>
        </Col>
      </Row>

      <div className="text-center">
        Welcome Customer!!!
        <br />
        Type in the fields below to begin!
      </div>

      <Row>
        <Form className="m-3">
          <Form.Group className="mt-3">
            <Form.Label>Search By Product Name</Form.Label>
            <Form.Control
              placeholder="Haro Shift R3"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Search By Brand Name</Form.Label>
            <Form.Control
              placeholder="Trek, Strider, etc."
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Row>
              <Col>
                <Form.Label>Search By Category</Form.Label>
                <Form.Control
                  placeholder="Mountain Bikes"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label>Search By Year</Form.Label>
                <Form.Control
                  placeholder="2018"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Search By Store</Form.Label>
            {/* These labels must match your stores.store_name values */}
            <Form.Select
              value={store}
              onChange={(e) => setStore(e.target.value)}
            >
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
                <Button variant="secondary" onClick={clearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Row>

      {bikes.length !== 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Year</th>
              <th>Price</th>
              {/* <th>Store</th>  // you can show this if you want */}
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.product_id}>
                <td>{bike.product_id}</td>
                <td>{bike.product_name}</td>
                <td>{bike.brand_name ?? bike.brand_id}</td>
                <td>{bike.category_name ?? bike.category_id}</td>
                <td>{bike.model_year}</td>
                <td>${bike.list_price}</td>
                {/* <td>{bike.store_name}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}
