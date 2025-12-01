import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useState } from "react";

export default function Employee() {
  const [shipStatus, setShipStatus] = useState<number>(1);
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");

  // table state (same idea as StoreManage)
  const [tableTitle, setTableTitle] = useState<string>("Orders");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  function updateTable(title: string, data: any[]) {
    console.log(`${title}:`, data);
    setTableTitle(title);
    setTableData(data);
    setTableColumns(data.length > 0 ? Object.keys(data[0]) : []);
  }

  async function handleSeeOrders() {
    console.log("Searching orders with filters:", {
      date,
      customerName,
      staffId,
      shipStatus,
    });

    // build query string from filters
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (customerName) params.append("customerName", customerName);
    if (staffId) params.append("staffId", staffId);
    if (shipStatus) params.append("status", shipStatus.toString());

    const query = params.toString();
    const url = `http://localhost:3001/orders/search${
      query ? `?${query}` : ""
    }`;

    const res = await fetch(url);
    const data = await res.json();

    updateTable("Filtered Orders", data);
  }

  return (
    <Container>
      <Link to={"/"}>
        <Button className="m-5">Go Home</Button>
      </Link>

      <div className="text-center">
        <h3>Hello my fellow employee!!!</h3>
        <p>Display order records and update payment statuses below</p>
      </div>

      <Row>
        {/* FILTERS */}
        <Col md={9}>
          <Form className="m-3">
            <Form.Group className="mb-3">
              <Form.Label>Filter By Date</Form.Label>
              {/* use type="date" so it’s easy */}
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Filter By Customer Name</Form.Label>
                  <Form.Control
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>Filter By Staff ID</Form.Label>
                  <Form.Control
                    placeholder="Enter staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="my-2">
                Filter By Payment / Shipping Status
              </Form.Label>
              <Row>
                <Col>
                  <Form.Check inline>
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="statusRadio"
                      checked={shipStatus === 1}
                      onChange={() => setShipStatus(1)}
                    />
                    <label className="form-check-label">Recently Bought</label>
                  </Form.Check>

                  <Form.Check inline>
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="statusRadio"
                      checked={shipStatus === 2}
                      onChange={() => setShipStatus(2)}
                    />
                    <label className="form-check-label">Processed</label>
                  </Form.Check>

                  <Form.Check inline>
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="statusRadio"
                      checked={shipStatus === 3}
                      onChange={() => setShipStatus(3)}
                    />
                    <label className="form-check-label">
                      Prepared to Ship
                    </label>
                  </Form.Check>

                  <Form.Check inline>
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="statusRadio"
                      checked={shipStatus === 4}
                      onChange={() => setShipStatus(4)}
                    />
                    <label className="form-check-label">Shipped</label>
                  </Form.Check>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>

        {/* BUTTON */}
        <Col
          md={3}
          className="d-flex align-items-center justify-content-center"
        >
          <Button size="lg" onClick={handleSeeOrders}>
            See Orders
          </Button>
        </Col>
      </Row>

      {/* RESULTS TABLE */}
      {tableData.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-3 text-center">{tableTitle}</h4>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {tableColumns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  {tableColumns.map((col) => (
                    <td key={col}>{String(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
