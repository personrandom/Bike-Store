import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Container, Form } from "react-bootstrap";
import { useState } from "react";

// NEW: imports from Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StoreManage() {
  const [orderId, setOrderId] = useState("");

  // Generic table state (works for categories, orders, brands, etc.)
  const [tableTitle, setTableTitle] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  // For the graph specifically
  const [bestCustomers, setBestCustomers] = useState<any[]>([]);

  // Helper to update table from any fetch
  function updateTable(title: string, data: any[]) {
    console.log(`${title}:`, data);
    setTableTitle(title);
    setTableData(data);
    setTableColumns(data.length > 0 ? Object.keys(data[0]) : []);
  }

  async function showCats() {
    console.log("Show Categories");
    const res = await fetch("http://localhost:3001/categories");
    const data = await res.json();
    updateTable("Categories", data);
    setBestCustomers([]); // clear graph
  }

  async function showOrders() {
    console.log("Show Orders");
    const res = await fetch("http://localhost:3001/orders");
    const data = await res.json();
    updateTable("Orders", data);
    setBestCustomers([]); // clear graph
  }

  async function showBrands() {
    console.log("Show Brands");
    const res = await fetch("http://localhost:3001/brands");
    const data = await res.json();
    updateTable("Brands", data);
    setBestCustomers([]); // clear graph
  }

  async function showStores() {
    console.log("Show Stores");
    const res = await fetch("http://localhost:3001/stores");
    const data = await res.json();
    updateTable("Stores", data);
    setBestCustomers([]); // clear graph
  }

  async function showStaff() {
    console.log("Show Staff");
    const res = await fetch("http://localhost:3001/staffs");
    const data = await res.json();
    updateTable("Staff", data);
    setBestCustomers([]); // clear graph
  }

  async function showBestCustomers() {
    console.log("Show Best Customers");
    const res = await fetch("http://localhost:3001/analytics/top-customers");
    const data = await res.json();

    // Add a "name" field for the chart (First Last)
    const mapped = data.map((c: any) => ({
      ...c,
      name: `${c.first_name} ${c.last_name}`,
    }));

    updateTable("Best Customers", mapped);
    setBestCustomers(mapped);
  }

  async function showOrderDetails(orderId: string) {
    console.log("Fetching order:", orderId);

    if (!orderId) {
      console.error("No orderId entered!");
      return;
    }

    const res = await fetch(
      `http://localhost:3001/orders/${orderId}/details`
    );
    const data = await res.json();

    updateTable(`Order ${orderId} Details`, data);
    setBestCustomers([]); // clear graph
  }

  return (
    <Container>
      <Link to={"/"}>
        <Button className="m-5">Go Home</Button>
      </Link>

      <div className="text-center">
        Hello Big Boss!!!
        <br />
        Display all orders placed by customers to track sales performance below
      </div>

      {/* Buttons to load data */}
      <div className="mt-4 d-flex flex-wrap gap-2">
        <Button onClick={showCats}>Show Categories</Button>
        <Button onClick={showOrders}>Show Orders</Button>
        <Button onClick={showBrands}>Show Brands</Button>
        <Button onClick={showStores}>Show Stores</Button>
        <Button onClick={showStaff}>Show Staff</Button>
        <Button onClick={showBestCustomers}>Show Best Customers</Button>
      </div>

      {/* Order ID input + button */}
      <div className="mt-4">
        <Form.Label>Enter Order ID:</Form.Label>
        <Form.Control
          type="number"
          placeholder="e.g. 5"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button className="mt-2" onClick={() => showOrderDetails(orderId)}>
          Show Order From ID
        </Button>
      </div>

      {/* Shared table display */}
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

      {/* Best Customers bar chart */}
      {bestCustomers.length > 0 && (
        <div className="mt-4">
          <h5 className="text-center">Top Customers by Total Spent</h5>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestCustomers} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Container>
  );
}
