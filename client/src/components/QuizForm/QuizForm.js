import React from "react"
import "./QuizForm.css"

export function QuizForm(props) {
    return (
        <div className={props.specs}>
            <form 
                onSubmit={props.handleQuizSubmit}
            >
                {props.children}
            </form>
        </div>
    );
}

export function QuizFormItem(props) {
    return (
        <div className="form-group">
            <div className="label" >
                {props.name}
                <h3>{props.question}</h3>
            </div>
            {props.children}
        </div>
    );
}

export function RadioInput(props) {
    return (
        <div className="form-control chosen" answer-id={props.id} {...props}>
            <label className="radio">
                <input
                    type="radio"
                    name={props.name}
                    onChange={props.handleInputChange}
                    value={props.value0}
                />
                <h5 className="radioLabel">{props.value0}</h5>
            </label>
            <label className="radio">
                <input
                    type="radio"
                    name={props.name}
                    onChange={props.handleInputChange}
                    value={props.value1}
                />
                <h5 className="radioLabel">{props.value1}</h5>
            </label>
        </div>
    );
}

export function FormBtn(props) {
    return (
        <button {...props} style={{ float: "right", marginBottom: 10 }} className="btn btn-secondary">
            Submit
        </button>
    );
}
