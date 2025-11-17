import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

export default function StoreManage() {
    return (
        <Container>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Hello Big Boss!!!
                Display all orders placed by customers to track sales performance below
            </div>
        </Container>
    )
}