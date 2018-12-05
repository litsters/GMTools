import React, { Component } from "react";


class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = { };

        this.handleClose = this.handleClose.bind(this);
    }
    
    handleClose() {
        this.modal.style.animationDuration = 200;
        this.modal.classList.add("closing");
        setTimeout((() => {
            this.props.close();
        }).bind(this), 200)
       
    }

    render() {
        const {children, className, showActions} = this.props;
        if (showActions) {
            var actions = (
                <div className="modal-actions">
                    {typeof(close) === "function" ? <i className="fas fa-times action" onClick={this.handleClose}></i> : null}
                </div>
            );
        }

        return (
            <div className="modal" ref={modal => this.modal = modal}>
                <div className="modal-shade" onClick={this.handleClose}></div>
                <div className={"modal-dialog" + (className ? ` ${className}` : "")}>
                    {actions}
                    {children}
                </div>
            </div>
        );
    }
}


Modal.Header = ({ children }) => {

    return (
        <div className="header">
            {children}
        </div>
    )
}

Modal.Body = ({ children }) => {
    return (
        <div className="body">
            {children}
        </div>
    )
}

Modal.Footer = ({ children }) => {
    return (
        <div className="footer">
            {children}
        </div>
    )
}

export default Modal;