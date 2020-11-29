class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initState;
        this.handleChange=this.handleChange.bind(this);
        this.sendCredentialsToApp = props.sendCredentialsToApp;
        this.visible = false;
    }
    handleChange(event) {
        this.state[event.target.id] = event.target.value;
        this.sendCredentialsToApp(this.state);
    }
    render() {
        if (this.visible) {
            return <div className="login">
                       <span className="nowrap">
                           <span className="login-label">id: </span>
                           <input maxLength="10" id="id" type="text" className="input input-login" value={this.state.id} onChange={this.handleChange}></input>
                       </span>
                       <span className="nowrap">
                           <span className="login-label"> token: </span>
                           <input maxLength="1024" id="token" type="text" className="input input-login" value={this.state.token} onChange={this.handleChange}></input>
                       </span>
                       <br/>
                   </div>
        } else {
            return <span></span>
        }
    }
}
