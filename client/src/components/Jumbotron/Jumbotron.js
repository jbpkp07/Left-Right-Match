import React from "react"
import "./Jumbotron.css"

// passing any props & children inherited from parent 
function Jumbotron({ specs, children }) {
    return <div className={`jumbotron${specs ? " " + specs : ""}`}>{children}</div>;
}
export default Jumbotron;