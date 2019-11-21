import React from "react";

// This file exports both the List and ListItem components

export function List(props) {
  return (
    <div className={props.specs} >
      <ul className="list-group list-unstyled">
        {props.children}
        </ul>
    </div>
  );
}

export function ListItem(props) {
  return <li className="list-group-item candidates"
    data-id={props.id}
    // name={props.id}
    onClick={props.handleThisClick}
  >
    {props.children}
  </li>;
}
