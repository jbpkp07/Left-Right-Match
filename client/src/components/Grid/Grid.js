import React from "react";
import "./Grid.css"

// Exporting the Container, Row, and Col components 

// This Container component allows us to use a bootstrap container without worrying about class names
export function Container({ fluid, specs, children }) {

// export function Container({ fluid, specs, children }) {
  // return <div className={`container${fluid ? "-fluid" : " " + specs}`}>{children}</div>;
  return <div className={`container${fluid ? "-fluid" : " " + specs}`}>{children}</div>;
}

// This Row component lets us use a bootstrap row without having to think about class names
export function Row({ fluid, children }) {
  return <div className={`row${fluid ? "-fluid" : ""}`}>{children}</div>;
}

// This Col component lets us size bootstrap columns with less syntax
// e.g. <Col size="md-12"> instead of <div className="col-md-12">
export function Col({ size, children }) {
  return (
    <div
    className={size}
      // className={size
      //   .split(" ")
      //   .map(size => "col-" + size)
      //   .join(" ")}
    >
      {children}
    </div>
  );
}
