class Login extends React.Component {
    render() {
        const visible = false;
        if (visible) {
            return <div className="login">
                       <span className="nowrap">
                           <span className="login-label">id: </span>
                           <input maxLength="32" id="id" type="text" className="input input-login" value={this.props.id} onChange={(event) => this.props.onChange({[event.target.id]: event.target.value})}></input>
                       </span>
                       <span className="nowrap">
                           <span className="login-label"> token: </span>
                           <input maxLength="1024" id="token" type="text" className="input input-login" value={this.props.token} onChange={(event) => this.props.onChange({[event.target.id]: event.target.value})}></input>
                       </span>
                       <br/>
                   </div>
        } else {
            return <span></span>
        }
    }
}
