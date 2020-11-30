class Share extends AbstractCloudFunctionClient {
    constructor(props) {
        super(props);

        this.state.id = this.props.id;
        this.state.token = this.props.token;
        this.state.processingMsg = <i className="fa fa-gear w3-xxlarge w3-spin"></i>;


    }

    displayLink = () => {
        this.buildAndRunXHR(
            this.props.queryString,
            (response) => {  // on200
                this.setState({
                    state: "displaying",
                    msg: response["link"]
                });
            }
        );
    }

    render() {
        this.state.id = this.props.id;
        this.state.token = this.props.token;
        return <div className="share">
                    <div id="link-modal" className="w3-modal" style={{display: this.state.state != "idle" ? "block" : "none"}}>
                        <div className="w3-modal-content link-modal">
                          <header className="w3-container datasheet-header">{this.props.lang == "en" ? "Link to current settings" : "Lien vers les paramètres actuels"}:</header>
                          <span className="w3-btn w3-display-topright close" onClick={(event) => {this.setState({state: "idle"})}}><i className="fa fa-close"></i></span>
                          <div className="w3-container shop">
                          <i>{this.state.msg}</i>
                          </div>
                        </div>
                    </div>
                   <button className="w3-btn shop-mid-bg datasheet-header" style={this.props.lang == "fr" ? {"font-size": "17px"}: {}} onClick={this.displayLink}><i className="fa fa-link"></i> {this.props.lang == "en" ? "Share Profiles": "Partager ces Profils"}</button>
               </div>;
    }
}
