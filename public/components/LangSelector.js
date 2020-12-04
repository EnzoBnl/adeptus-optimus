class LangSelector extends React.Component {
  render() {
    return (
      <div className="lang-selector">
        <img
          className="country-flag"
          src="components/002-france.svg"
          onClick={(event) => this.props.notify('fr')}>
        </img>
        &nbsp;
        <img
          className="country-flag"
          src="components/029-united kingdom.svg"
          onClick={(event) => this.props.notify('en')}>
        </img>
      </div>
    );
  }
}
