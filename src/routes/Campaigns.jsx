import { Route } from "react-router";

export function ViewAll({ ...props }){

    return (
        <div className="">
            <div>Character will go here</div>
            <div>Character will go here</div>
            <div>Character will go here</div>
            <div>Character will go here</div>
            <div>Character will go here</div>
            <div>Character will go here</div>
        </div>
    )

}

export default (<>
    <Route path="/campaigns" element={ <ViewAll/> } />
</>)