class App extends React.Component {
    constructor(props) {
        super(props);
        this.sendParamChange = this.sendParamChange.bind(this);
        this.sendCredentialsToApp = this.sendCredentialsToApp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.initParams = getInitParams();

        this.state = {
            state: "idle",  // state in: "idle", "processing","error";
            msg: "",
            params: this.initParams,
            cache: {},
            id: "admin",
            token: "U2FsdGVkX197wfW/IY0sqa/Ckju8AeU3pRLPSra1aCxZeAHrWePPDPJlYTy5bwdU"
        };
        this.state.cache[this.stringifyRelevantParams(this.state.params)] = getSample();
    }


    handleSubmit(event) {
        event.preventDefault();
        document.getElementById("chart").innerHTML = "";
        this.setState({state: "processing", msg: "Testing weapons..."/*"Firing on some captives Grots..."*/})
        var paramsAsString = this.stringifyRelevantParams(this.state.params);
        if (paramsAsString in this.state.cache) {
            const cachedResponse = this.state.cache[paramsAsString];
            plotComparatorChart(
                cachedResponse["x"],
                cachedResponse["y"],
                cachedResponse["z"],
                cachedResponse["ratios"],
                cachedResponse["scores"],
                () => {this.setState({state: "idle", msg: ""});}
                )
        } else {
            var serverIp = getServerIp(this.state.id, this.state.token);
            if (serverIp == "") {
                this.setState({
                    state: "error",
                    msg: "Invalid id/token: id:'" + this.state.id + "', token='" + this.state.token + "'."
                });
            } else {
                var xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                // get a callback when the server responds
                xhr.onload = () => {
                  console.log("console.log(xhr.responseText):");
                  console.log(xhr.response);
                  if (xhr.status == 200) {
                      this.state.cache[paramsAsString] = { // ensures changing params during request is safe
                          x: xhr.response["x"],
                          y: xhr.response["y"],
                          z: xhr.response["z"],
                          ratios: xhr.response["ratios"],
                          scores: xhr.response["scores"]
                      }
                      plotComparatorChart(
                          xhr.response["x"],
                          xhr.response["y"],
                          xhr.response["z"],
                          xhr.response["ratios"],
                          xhr.response["scores"],
                          () => {this.setState({state: "idle", msg: ""});});
                  } else if (xhr.status == 422 || xhr.status == 500) {
                    this.setState({
                        state: "error",
                        msg: "SERVER ERROR " + xhr.status + ": " + xhr.response["msg"]
                    });
                  } else if (xhr.status == 429) {
                    this.setState({
                        state: "error",
                        msg: "SERVER ERROR 429: Too Many Requests: There is no magus available for the supervision of the analysis you requested."
                    });
                  }
                  else if (xhr.status == 408) {
                    this.setState({
                      state: "error",
                      msg: "SERVER ERROR 408: Timeout: The magus in charge of your request has passed out"
                    });
                    }
                  else {
                    this.setState({
                        state: "error",
                        msg: "SERVER ERROR " + xhr.status
                    });
                  }
                };
                // get a callback when net::ERR_CONNECTION_REFUSED
                xhr.onerror = () => {
                    console.log("console.log(xhr.responseText):");
                    console.log(xhr.response);
                    this.setState({
                        state: "error",
                        msg: "SERVER DOWN: The Forge World of the Adeptus Optimus must be facing an onslaught of heretics."
                    });
                };
                xhr.open("GET", serverIp + "?params=" + paramsAsString);
                // send the request
                xhr.send();
            }
        }
    }

    render() {
        console.log("App render() called")
        console.log(this.state);
        return <div>
            <Login initState={{id: this.state.id, token: this.state.token}} sendCredentialsToApp={this.sendCredentialsToApp}/>
            <h1><a href="index.html" className="title">Adeptus <img src="images/logo.png" width="100px"/> Optimus</a></h1>
            <p className="title subscript">" Support wiser choices, on behalf of the Emperor."</p>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div style={{overflowX: "auto"}}>
                <ParamsTable initParams={this.initParams} sendParamChange={this.sendParamChange} letter="A"/>
                <br/>
                <br/>
                <br/>
                <ParamsTable initParams={this.initParams} sendParamChange={this.sendParamChange} letter="B"/>
            </div>
            <br/>
            <br/>
            <br/>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            <button className="w3-btn shop-mid-bg datasheet-header" onClick={this.handleSubmit}>COMPARE</button>
            <br/>
            <br/>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" className="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <br/>
            <br/>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            <Help />
            <p className="version">v1.0</p>
        </div>
    }

    sendParamChange(k, v) {
        if (v == null) {
            delete this.state.params[k];
        } else {
            this.state.params[k] = v;
        }
        this.setState({});
    }

    sendCredentialsToApp(creds) {
        this.setState(creds);
    }

    getRelevantParamsKeys(Params) {
        var tableRelevantState = {...Params};
        Object.entries(tableRelevantState).forEach(([key, value]) => {
            if (key.includes("name")) {
                delete tableRelevantState[key];
            }
        });
        return tableRelevantState;
    }

    stringifyRelevantParams(Params) {
        return JSON.stringify(this.getRelevantParamsKeys(Params))
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initState;  // TODO remove
        this.handleChange=this.handleChange.bind(this);
        this.sendCredentialsToApp = props.sendCredentialsToApp;
    }
    handleChange(event) {
        this.state[event.target.id] = event.target.value;
        this.setState({});  // re render
        this.sendCredentialsToApp(this.state);
    }
    render() {
        return <div className="login">
                   <span className="nowrap">
                       <span className="login-label">id: </span>
                       <input maxLength="10" id="id" type="text" className="input input-login" value={this.state.id} onChange={this.handleChange}></input>
                   </span>
                   <span className="nowrap">
                       <span className="login-label"> token: </span>
                       <input maxLength="128" id="token" type="text" className="input input-login" value={this.state.token} onChange={this.handleChange}></input>
                   </span>
               </div>
    }
}

class InfoBox extends React.Component {
    render() {
        return <div className="w3-quarter w3-margin-top">
                 <div className="w3-card w3-container">
                 <h3>{this.props.title}</h3>
                 {this.props.body}
                 </div>
               </div>

    }
}

class Help extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: true};
        this.helpButtonAction = this.helpButtonAction.bind(this);
        this.button = <button className="w3-btn shop-mid-bg datasheet-header" onClick={this.helpButtonAction}>ABOUT</button>;
    }

    helpButtonAction() {
        this.setState({visible: !this.state.visible});
    }

    render() {
        if (this.state.visible) {
             return <div>
                        {this.button}
                        <div className="w3-content">
                            <div className="w3-row-padding w3-center w3-margin-top w3-margin-bottom shop">
                                <InfoBox title="Adeptus Optimus" body={<p>The <i>Adeptus Optimus</i> is an analytics organization attached to the <i>Adeptus Mechanicus</i>. The <i>Adeptus Optimus Engine</i> has been built by an <i>Archimagus computus mathematica</i> to give to lords of war an <b>intuitive and rigorous tool</b> to guide their equipments choices.</p>}/>
                                <InfoBox title="Attacking profiles" body={<p>The engine performs a comparison between two attacking profiles. Each <b>profile represents one or more models and their weapons</b>, with a cost associated with the whole. Each different weapon used by the attacking profile has to be declared along with a total number of <i>Attacks</i> made with it during one phase, by the models of the profile.</p>}/>
                                <InfoBox title="Results" body={<p>The engine computes a precise <i>average number of target unit's models killed per profile point</i> for profiles A and B, against a <b>large variety of target units defense profiles</b>. The engine leverages advanced algorithmic to compute deterministic calculus leading to almost exact results.</p>}/>
                                <InfoBox title="Ultimate Accuracy" body={<p>The entire dice rolls sequences are theoretically modeled, making the <i>Adeptus Optimus Engine</i> the only tool correctly handling the <b>complex effects of random damages characteristics and <i>Feel No Pains</i></b> during the sequential damage allocation step, or the <b>threshold effects</b> introduced by a <b>random <i>Strength</i> characteristic</b>, among others.</p>}/>
                            </div>
                        </div>
                        <div className="w3-bar shop-mid-bg"><div className="w3-bar-item"></div></div>

                    </div>
        } else {
            return <span>{this.button}</span>
        }
    }
}

class ProgressLog extends React.Component {
    render() {
        if (this.props.state == "processing") {
            return <div>
                        <img className="w3-animate-fading-fast" src="images/skull.png" width="32px"></img>
                        <span className="shop"> {this.props.msg} </span>
                        <img className="w3-animate-fading-fast" src="images/skull.png" width="32px"></img>

                        <p><img src="images/testing.gif" width="auto"></img></p>
                   </div>
        } else if (this.props.state == "error") {
            return <div>
                        <img src="images/chaos.png" width="50px"></img>
                        <div className="datasheet-body"> {this.props.msg}</div>
                   </div>
        } else {
            return <span></span>;
        };
    }
}


class ParamsTable extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.letter == "A") {
            this.weaponsVisibility = [true, true, true, false, false];
        } else {
            this.weaponsVisibility = [true, false, false, false, false];
        }
        this.addWeapon = this.addWeapon.bind(this);
        this.removeWeapon = this.removeWeapon.bind(this);
    }

    addWeapon() {
        for (var i = 0; i < this.weaponsVisibility.length; i++) {
            if (!this.weaponsVisibility[i]) {
                this.weaponsVisibility[i] = true;
                this.setState({})
                break;
            }
        }
        if (i == this.weaponsVisibility.length) {
            alert("Maximum number of weapons by profile reached: " + i)
        }
        this.setState({})
    }

    removeWeapon(index) {
        this.weaponsVisibility[index] = false;
        this.setState({});
    }

    render() {
        return <table className="w3-table nowrap">
                <ProfileHeader bg={"profile-" + this.props.letter + "-bg"} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[0]} removeWeapon={this.removeWeapon} index={0} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[1]} removeWeapon={this.removeWeapon} index={1} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[2]} removeWeapon={this.removeWeapon} index={2} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[3]} removeWeapon={this.removeWeapon} index={3} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[4]} removeWeapon={this.removeWeapon} index={4} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <WeaponRow visible={this.weaponsVisibility[5]} removeWeapon={this.removeWeapon} index={5} letter={this.props.letter} initParams={this.props.initParams} sendParamChange={this.props.sendParamChange}/>
                <tbody>
                  <tr>
                    <th><button className="logo-btn" onClick={this.addWeapon}><i className="fa"><b>+</b></i></button></th>
                  </tr>
                </tbody>
            </table>;
    }
}

class ProfileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.name = this.props.initParams["name" + this.props.letter];
        this.state.points = this.props.initParams["points" + this.props.letter];

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.state[event.target.id] = event.target.value;
        this.props.sendParamChange(event.target.id + this.props.letter, event.target.value);
    }

    render() {
        return  <tbody>
                  <tr className="datasheet-body">
                    <th className={"datasheet-header profile-flag " + this.props.bg}>Attacking Profile {this.props.letter}</th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Name: <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-profile-name" value={this.state.name} onChange={this.handleChange} ></input></th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Points: <input maxLength="4" id="points" value={this.state.points} type="text" className="white-bg datasheet-body input input-dice align-left" onChange={this.handleChange}></input></th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Weapons used ▼</th>
                    <th className="greeny-bg">Attacks</th>
                    <th className="greeny-bg">WS|BS</th>
                    <th className="greeny-bg">S</th>
                    <th className="greeny-bg">AP</th>
                    <th className="greeny-bg">D</th>
                    <th className="greeny-bg">Options</th>
                  </tr>
                </tbody>;
    }
}

class WeaponRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = this.props.letter + this.props.index;
        this.state.name = this.props.initParams["name" + this.id];
        this.state.A = this.props.initParams["A" + this.id];
        this.state.WSBS = this.props.initParams["WSBS" + this.id];
        this.state.S = this.props.initParams["S" + this.id];
        this.state.AP = this.props.initParams["AP" + this.id];
        this.state.D = this.props.initParams["D" + this.id];
        // options do never initialize to undefined, pass a default initState as fallback
        if (("options" + this.id) in this.props.initParams) {
            this.state.options = this.props.initParams["options" + this.id];
        } else {
            this.state.options = {"hit_modifier": "0", "wound_modifier": "0"};
        }

        this.onDelete = this.onDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateOption = this.updateOption.bind(this);
        this.openOptionsMenu = this.openOptionsMenu.bind(this);
        this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
    }

    handleChange(event) {
        this.state[event.target.id] = event.target.value;
        this.props.sendParamChange(event.target.id + this.id, event.target.value);
        // send options to cover at least the case where option remains default
        this.props.sendParamChange("options" + this.id, this.state.options);
    }

    updateOption(optionName, value) {
        // optionName example: "hit_modifier"
        this.state.options[optionName] = value;
        this.props.sendParamChange("options" + this.id, this.state.options);
    }
    
    onDelete () {
        this.props.removeWeapon(this.props.index);
        Object.entries(this.state).forEach(([key, value]) => {
           this.props.sendParamChange(key + this.id, null);
        });
        this.setState({});
    }

    openOptionsMenu () {
        document.getElementById("options-menu" + this.id).style.display="block";
    }

    closeOptionsMenu () {
        document.getElementById("options-menu" + this.id).style.display="none";
    }

    render() {
        if(this.props.visible) {
            return <tbody>
                      <tr className="datasheet-body">
                        <th><button className="logo-btn" onClick={this.onDelete}><i className="fa fa-trash"></i></button> <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-weapon-name" value={this.state.name} onChange={this.handleChange} ></input></th>
                        <th><input maxLength="4" id="A" value={this.state.A} type="text" className="input input-dice align-right" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="WSBS" value={this.state.WSBS} type="text" className="input input-dice align-right" onChange={this.handleChange}></input>+</th>
                        <th><input maxLength="4" id="S" value={this.state.S} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>-<input maxLength="4" id="AP" value={this.state.AP} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="D" value={this.state.D} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>
                            <div id={"options-menu" + this.id} className="w3-modal">
                              <div className="w3-modal-content">
                                <header className="w3-container greeny-bg datasheet-header">
                                  Options of weapon: {this.state.name}
                                </header>
                                <div className="w3-container shop">
                                    <HitModifierOptionInput updateOption={this.updateOption} initValue={this.state.options["hit_modifier"]}/>
                                    <WoundModifierOptionInput updateOption={this.updateOption} initValue={this.state.options["wound_modifier"]}/>
                                </div>
                                <span className="w3-button w3-margin-bottom greeny-bg shop" onClick={this.closeOptionsMenu}>Save and close</span>
                              </div>
                            </div>
                            <button className="logo-btn" onClick={this.openOptionsMenu}><i className="fa fa-cogs"></i></button>
                        </th>
                      </tr>
                   </tbody>;
        } else {
            return <tbody></tbody>
        }
    }
}

class SimpleValueOptionInput extends React.Component {
    constructor (props) {
        super(props);
        this.value = this.props.initValue;
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }
    handleOptionChange(event) {
        this.value = event.target.value;
        this.props.updateOption(event.target.id, event.target.value)
        this.setState({});
    }
}

class HitModifierOptionInput extends SimpleValueOptionInput {
    render () {
        return <p>
                   Hit roll modifier: <select id="hit_modifier" className="w3-select option-select" name="option" value={this.value} onChange={this.handleOptionChange}>
                   <option value="-1">-1</option>
                   <option value="0"></option>
                   <option value="1">+1</option>
                   </select>
               </p>
    }
}

class WoundModifierOptionInput extends SimpleValueOptionInput {
    render () {
        return <p>
                  Wound roll modifier: <select id="wound_modifier" className="w3-select option-select" name="option" value={this.value} onChange={this.handleOptionChange}>
                  <option value="-1">-1</option>
                  <option value="0"></option>
                  <option value="1">+1</option>
                  </select>
                </p>
    }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);