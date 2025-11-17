import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function StoreManage() {
    return (
        <>
            <Link to={"/"}><Button className="m-5">Go Home</Button></Link>
            <div className="text-center">
                Hello Big Boss!!!
                Display all orders placed by customers to track sales performance below
            </div>
        </>
    )
}