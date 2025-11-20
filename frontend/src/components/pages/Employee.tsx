import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

export default function Employee() {
    return (
        <Container>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Hello my fellow employee!!!
                Display order records and update payment statuses
            </div>
        </Container>
    )
}