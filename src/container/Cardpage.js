import React from 'react'

class Cardpage extends React.Component {
    render(){
        return (
            <div className="flex flex-column justify-center items-center w-100 h-100 bg-light-gray">
                <div className="w4 h4">
                    <img alt="" className="br-100" src="/images/logo.png"></img>
                </div>
                <h1 className="black">第一次登入請輸入卡號</h1>
                <form id="card-form" action="/auth/card" method="POST">
                    <input type="text" name="card" placeholder="卡號" required={true} className="ma3 bt-0 br-0 bl-0 bb bw1 bg-light-gray f4 b--black ph-gray"/><br />
                </form>
                <input type="submit" form="card-form" value="確認" className="bn bg-transparent f3 b grow"/>
            </div>
        )
    }
}

export default Cardpage;