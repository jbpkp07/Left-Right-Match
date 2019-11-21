import React from "react";
import "./LoginTab.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function LoginTab(props) {
  return (
    <span className="tab LoginTab" role="button" onClick={props.onChange} >Login</span>
    // <span className="delete-btn" {...props} role="button" tabIndex="0">
    //   ✗
    // </span>
  );
}

export default SignUpTab;
