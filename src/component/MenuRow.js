import React from 'react'

const MenuRow = (props) => {
    // name, url
    return (
        <div onClick={()=>window.location=props.url}
        className="black f3 pv4 bb b--silver link no-focus-outline">
        {props.name}
        </div>
    )
}

export default MenuRow;