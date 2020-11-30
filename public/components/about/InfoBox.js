class InfoBox extends React.Component {
    render() {
        return (
            <div className="w3-quarter w3-margin-top">
                <div className="w3-card w3-container">
                <h3>{this.props.title}</h3>
                {this.props.body}
                </div>
            </div>
        )
    }
}
