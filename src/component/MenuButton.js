import React from 'react'
import '../App.css'

const MenuButton = (props) => {
    return (
        <div id="menubar-button"
        className="fixed flex flex-column items-center justify-center br-100 w3 h3 bg-white shadow-1 right-1 top-1 grow"
        onClick={props.onClick}>
            <div className="bg-silver w-50 h0 mv1"></div>
            <div className="bg-silver w-50 h0 mv1"></div>
            <div className="bg-silver w-50 h0 mv1"></div>
        </div>
    )
}

export default MenuButton;