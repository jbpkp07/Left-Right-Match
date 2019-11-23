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
                <h5>{props.question}</h5>
            </div>
            {props.children}
        </div>
    );
}

export function RadioInput(props) {

    return (

        <div className="radio-toolbar" answer-id={props.id} {...props}>

            <input
                id={props.name + props.value0}
                type="radio"
                name={props.name}
                onChange={props.handleInputChange}
                value={props.value0}
            />
            <label htmlFor={props.name + props.value0}>{props.value0}</label>

            <input
                id={props.name + props.value1}
                type="radio"
                name={props.name}
                onChange={props.handleInputChange}
                value={props.value1}
            />
            <label htmlFor={props.name + props.value1}>{props.value1}</label>

        </div>
    );
}

export function FormBtn(props) {
    return (
        <button {...props} className="btn btn-primary">
            Submit
        </button>
    );
}
