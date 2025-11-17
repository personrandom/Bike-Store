import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function MainPage(){
    return (
        <>
            <div className="text-center p-5 m-5">
                Hello, please click to log in
                <div className="p-5">
                    <Link to={"/manager"}><Button className="m-3">Store Manager</Button></Link>
                    <Link to={"/user"}><Button className="m-3">Customer</Button></Link>
                    <Link to={"/member"}><Button className="m-3">Employee</Button></Link>
                </div>
            </div>
        </>
    )
}