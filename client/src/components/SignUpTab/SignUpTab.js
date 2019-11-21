import React from "react";
import "./SignUpTab.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function SignUpTab(props) {
  return (
    <span className="tab signUpTab" role="button" onClick={props.onChange}>Sign Up</span>
    // <span className="delete-btn" {...props} role="button" tabIndex="0">
    //   ✗
    // </span>
  );
}

export default SignUpTab;
