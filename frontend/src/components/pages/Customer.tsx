import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Customer() {
    return (
        <>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Welcome Customer!!!
                Display bike options below
            </div>
        </>
    )
}