import React from 'react'

const Modal = props => {
    style = `
        border: 1px solid black;
        border-radius: 2px;
        margin: 1em;
    `
    return <div {...props} draggable={true} resizable={true}>
        {props.children}
    </div>
}

export default Modal;