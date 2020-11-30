class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    render() {
        const angle = <i className={"fa fa-angle-double-" + (this.state.visible ? "up" : "down") + " w3-xlarge"}></i>;
        return (
                <div>
                    <button className="w3-btn shop-mid-bg datasheet-header" onClick={(event) => this.setState({visible: !this.state.visible})}>{angle} About {angle}</button>
                    {this.state.visible ?
                    <div className="w3-content">
                        <div className="w3-row-padding w3-center w3-margin-top w3-margin-bottom shop">
                            <InfoBox title="Adeptus Optimus" body={<p>The Adeptus Optimus is an analytics organization attached to the Adeptus Mechanicus. The Adeptus Optimus Engine has been built by an Archmagos computus to give to lords of war an <b>intuitive and rigorous tool</b> to guide their equipment choices.</p>}/>
                            <InfoBox title="Attacking Profiles" body={<p>The engine performs a comparison between two attacking profiles. Each <b>profile represents one or more models and their weapons</b>, with a cost associated with the whole. Each different weapon used by the attacking profile has to be declared along with a total number of Attacks made with it during one phase, by the models of the profile.</p>}/>
                            <InfoBox title="Results" body={<p>The engine computes a precise average number of target unit's models killed per profile point for profiles A and B, against a <b>large variety of target units defense profiles</b>. The engine leverages advanced algorithmics to compute deterministic calculus leading to almost exact results.</p>}/>
                            <InfoBox title="Accuracy" body={<p>Thanks to our rigorous approach, we are the only tool to accurately handle complex events such as: the <b>interaction of random damage characteristics + additional mortal wounds + Feel No Pains</b> during the damage allocation step, or the threshold effect of <b>random Strength characteristics</b>, and many other mixes of optional effects...</p>}/>
                        </div>
                    </div>
                    :
                    <span></span>
                    }
                </div>
        )
    }
}