import React from 'react'
import '../App.css'
import MenuRow from '../component/MenuRow'

const Menu = (props) => {
    return(
        <div className="fixed flex flex-column bg-near-white w-100 h-100 fadein-1 pa3 z-1">
            <div className="flex flex-column items-center justify-end bb b--silver">
                <div className="h4 w4">
                    <img alt="" className="br-100" src="/images/logo.png"></img>
                </div>
                <h1 className="black f2">台大躲貓貓社</h1>
            </div>
            <div className="flex flex-column">
                <MenuRow name="首頁" url="/"></MenuRow>
                {props.name===null?<MenuRow name="登入" url="/login"></MenuRow>:<MenuRow name={props.name} url="/"></MenuRow>}
                {props.name===null?null:<MenuRow name="登出" url="/auth/logout"></MenuRow>}
            </div>
        </div>
    )
}

export default Menu;