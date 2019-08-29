import React from 'react';
import '../App.css'

class Homepage extends React.Component{
    render(){
        return (
            <React.Fragment>
                <div className="h-100 flex justify-center">
                    <div>
                        <img className="" alt="" src="/images/logo.png"></img>
                    </div>
                </div>
                <div className="h-100 flex flex-column justify-start items-center bg-self-green">
                    <div className="pt4">
                        <img alt="" className="shadow-5" src="/images/activity.png"></img>
                    </div>
                    <h1 className="f1 white text-shadow">社博實境解謎</h1>
                    <h2 className="f3 white ma0 text-shadow">現正進行中</h2>
                    <h3 className="f6 white text-shadow">2019.9.20~2019.9.27</h3>
                    <button onClick={()=>window.location="/messenger"} className="br3 w-50 h3 mv5 bg-yellow f3 shadow-3">立刻參加</button>
                </div>
            </React.Fragment>
        )
    }
}

export default Homepage