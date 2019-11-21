import React from "react"
import "./Image.css"

function Image(props) {
    return (
        <div >
        <img className="logo-img" src={props.image} alt={props.name} />
        {props.children}
        </div>
    );
}

export default Image;