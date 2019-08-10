import React from 'react'
import Menu from './Menu'
import MenuButton from '../component/MenuButton'

class MenuContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuOpen: false
        }
    }

    buttonOnClick = () => {
        this.setState((prevState) => ({
            menuOpen: (prevState.menuOpen?false:true)
        }));
    }

    render(){
        return (
            <React.Fragment>
                {this.state.menuOpen && <Menu></Menu>}
                <MenuButton onClick={this.buttonOnClick}></MenuButton>
            </React.Fragment>
        )
    }
}

export default MenuContainer;