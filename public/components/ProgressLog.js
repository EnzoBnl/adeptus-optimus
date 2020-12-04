// TODO: merge it with plot in a HeatMap.js
class ProgressLog extends React.Component {
  render() {
    if (this.props.state == 'processing') {
      return <div>
        <div className="w3-animate-fading-fast shop">{this.props.msg}</div>
        <p className="fa fa-gear w3-xxxlarge w3-spin"></p>
        <br/>
      </div>;
    } else if (this.props.state == 'error') {
      return (
        <div>
          <div className="fa fa-server w3-xxlarge"></div>
          <p className="datasheet-body">{this.props.msg}</p>
          <br/>
          <div className="opt-inactive">
            If blocked, please contact adeptus.optimus@gmail.com with:
            <ul>
              <li>a copy of the above error message</li>
              <li>
                a link to current profiles (generate
                it using the <i>Share Profiles</i> button)
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return <span></span>;
    }
  }
}
