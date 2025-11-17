import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

export default function Customer() {
    return (
        <Container>
            <div className="d-flex justify-content-end">
                <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            </div>

            
            <div className="text-center">
                Welcome Customer!!!
                Display bike options below
            </div>
        </Container>
    )
}