import { Route } from "react-router";

export function ViewAll({ ...props }){

    return (
        <div className="">
            
        </div>
    )

}

export default function Campaigns({ ...props }){

    return (
        <>
            <Route path="/campaigns" element={ <ViewAll/> } />
        </>
    )

}