import { Container, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

export default function MainPage(){
    return (
        <Container>
            <div className='d-flex justify-content-center text-center m-5'>
                <div className='d-flex flex-column'>
                Hello, please click to log in
                <Stack direction='horizontal'>
                    <Link to={"/manager"}><Button className="m-3">Store Manager</Button></Link>
                    <Link to={"/user"}><Button className="m-3">Customer</Button></Link>
                    <Link to={"/member"}><Button className="m-3">Employee</Button></Link>
                </Stack>
                </div>
            </div>
        </Container>
    )
}