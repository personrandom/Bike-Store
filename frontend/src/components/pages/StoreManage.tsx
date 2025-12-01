import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

export default function StoreManage() {

    async function showCats() {
        //call the querry
        console.log("Show Categories")

        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        console.log("Categories:", data);
   }

   async function showOrders() {
    //call the querry
    console.log("Show Orders")

    const res = await fetch("http://localhost:3001/products");
    const data = await res.json();
    console.log("Orders:", data);
    }

    async function showBrands() {
        //call the querry
        console.log("Show Brands")
    
        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        console.log("Brands:", data);
    }

    async function showStores() {
        //call the querry
        console.log("Show Stores")
    
        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        console.log("Stores:", data);
    }

    async function showStaff() {
        //call the querry
        console.log("Show Staff")
    
        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        console.log("Staff:", data);
    }



    return (
        <Container>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Hello Big Boss!!!
                Display all orders placed by customers to track sales performance below
            </div>

            <Button onClick={showCats}>Show Categories</Button>
            <Button onClick={showOrders}>Show Orders</Button>
            <Button onClick={showBrands}>Show Brands</Button>
            <Button onClick={showStores}>Show Stores</Button>
            <Button onClick={showStaff}>Show Staff</Button>

        </Container>
    )

    
}