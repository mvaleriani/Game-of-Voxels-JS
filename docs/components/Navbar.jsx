import React from 'react';

class Navbar extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            navStyle: { 
                
                backgroundColor: '#494949',
                width: '75px',
                height: '100%',

                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start'
            },
        };
    }

    render(){
        debugger;
        return(<nav style={this.state.navStyle}>
            <div>

            </div>


        </nav>)
    }
}

export default Navbar;