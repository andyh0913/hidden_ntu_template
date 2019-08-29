import React from 'react'

class Loginpage extends React.Component {
    render(){
        return (
            <div className="flex flex-column justify-center items-center w-100 h-100 bg-light-gray">
                <div className="w4 h4">
                    <img alt="" className="br-100" src="/images/logo.png"></img>
                </div>
                <h1 className="black">帳號登入</h1>
                <form id="login-form" action="/auth/login" method="POST">
                    <input type="text" name="account" placeholder="帳號" required={true} className="ma3 bt-0 br-0 bl-0 bb bw1 bg-light-gray f4 b--black ph-gray"/><br />
                    <input type="password" name="pwd" placeholder="密碼" required={true} className="ma3 bt-0 br-0 bl-0 bb bw1 bg-light-gray f4 b--black ph-gray"/><br />
                </form>
                <input type="submit" form="login-form" value="登入" className="bn bg-transparent f3 b grow"/>
            </div>
        )
    }
}

export default Loginpage;