class App extends React.Component {
    constructor(props) {
        super(props);
        this.syncAppParams = this.syncAppParams.bind(this);
        this.sendCredentialsToApp = this.sendCredentialsToApp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            state: "idle",  // state in: "idle", "processing","error";
            msg: "",
            id: "admin",
            token: "U2FsdGVkX197wfW/IY0sqa/Ckju8AeU3pRLPSra1aCxZeAHrWePPDPJlYTy5bwdU"
        };
        var queryStringParams = new URLSearchParams(window.location.search);
        this.params = {
            A: queryStringParams.has("params") ? JSON.parse(queryStringParams.get("params"))["A"] : getInitParams("A"),
            B: queryStringParams.has("params") ? JSON.parse(queryStringParams.get("params"))["B"] : getInitParams("B")
        }
        this.cache = {};
    }


    handleSubmit(event) {
        event.preventDefault();
        document.getElementById("chart").innerHTML = "";
        this.setState({state: "processing", msg: "Testing weapons..."/*"Firing on some captives Grots..."*/})
        var paramsAsString = this.stringifyRelevantParams(this.params);
        if (paramsAsString in this.cache) {
            const cachedResponse = this.cache[paramsAsString];
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
                      this.cache[paramsAsString] = { // ensures changing params during request is safe
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
                        msg: "SERVER ERROR 429: Too Many Requests: There is no Magos available for the supervision of the analysis you requested."
                    });
                  }
                  else if (xhr.status == 408) {
                    this.setState({
                      state: "error",
                      msg: "SERVER ERROR 408: Timeout: The Magos in charge of your request has passed out"
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
        console.log(this.params);
        return <div>
            <div className="shop-bg"><div className="v9">Ready for <img src="images/40klogo.png" height="20px"/> V9</div></div>
            <Login initState={{id: this.state.id, token: this.state.token}} sendCredentialsToApp={this.sendCredentialsToApp}/>
            <h1><a href="index.html" className="title">Adeptus <img src="images/logo.png" width="100px"/> Optimus</a></h1>
            <p className="title subscript">" Support wiser choices, on behalf of the Emperor."</p>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div style={{overflowX: "auto"}}>
                <ParamsTable syncAppParams={this.syncAppParams} params={this.params} letter="A"/>
            </div>
            <br/>
            <br/>
            <br/>
            <div style={{overflowX: "auto"}}>
                <ParamsTable syncAppParams={this.syncAppParams} params={this.params} letter="B"/>
            </div>
            <br/>
            <br/>
            <br/>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            <button className="w3-btn shop-mid-bg datasheet-header" onClick={this.handleSubmit}>▼ COMPARE ▼</button>
            <br/>
            <br/>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" className="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            <Help />
            <br/>
            <br/>
            <div className="w3-bar shop-mid-bg"><div className="w3-bar-item"></div></div>
        </div>
    }

    syncAppParams(params, letter) {
        this.params[letter] = params;
    }

    sendCredentialsToApp(creds) {
        this.setState(creds);
    }

    getRelevantParamsKeys() {
        var tableRelevantState = {
            ...this.params.A,
            ...this.params.B
        };
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
        this.sendCredentialsToApp(this.state);
    }
    render() {
        return <div className="login">
                   <span className="nowrap">
                       <span className="login-label">id: </span>
                       <input maxLength="10" id="id" type="text" className="input input-login" value={this.state.id} onChange={this.handleChange}></input>
                   </span>
                   <br/>
                   <span className="nowrap">
                       <span className="login-label"> token: </span>
                       <input maxLength="512" id="token" type="text" className="input input-login" value={this.state.token} onChange={this.handleChange}></input>
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
        this.state = {visible: false};
        this.helpButtonAction = this.helpButtonAction.bind(this);
    }

    helpButtonAction() {
        this.setState({visible: !this.state.visible});
    }

    render() {
        if (this.state.visible) {
             return <div>
                        <button className="w3-btn shop-mid-bg datasheet-header" onClick={this.helpButtonAction}>▲ ABOUT ▲</button>
                        <div className="w3-content">
                            <div className="w3-row-padding w3-center w3-margin-top w3-margin-bottom shop">
                                <InfoBox title="Adeptus Optimus" body={<p>The <i>Adeptus Optimus</i> is an analytics organization attached to the <i>Adeptus Mechanicus</i>. The <i>Adeptus Optimus Engine</i> has been built by an <i>Archmagos computus</i> to give to lords of war an <b>intuitive and rigorous tool</b> to guide their equipments choices.</p>}/>
                                <InfoBox title="Attacking profiles" body={<p>The engine performs a comparison between two attacking profiles. Each <b>profile represents one or more models and their weapons</b>, with a cost associated with the whole. Each different weapon used by the attacking profile has to be declared along with a total number of <i>Attacks</i> made with it during one phase, by the models of the profile.</p>}/>
                                <InfoBox title="Results" body={<p>The engine computes a precise <i>average number of target unit's models killed per profile point</i> for profiles A and B, against a <b>large variety of target units defense profiles</b>. The engine leverages advanced algorithmic to compute deterministic calculus leading to almost exact results.</p>}/>
                                <InfoBox title="Ultimate Accuracy" body={<p>The entire dice rolls sequences are theoretically modeled, making the <i>Adeptus Optimus Engine</i> the only tool correctly handling the <b>complex effects of random damages characteristics and <i>Feel No Pains</i></b> during the sequential damage allocation step, or the <b>threshold effects</b> introduced by a <b>random <i>Strength</i> characteristic</b>, among others.</p>}/>
                            </div>
                        </div>
                    </div>
        } else {
            return <span><button className="w3-btn shop-mid-bg datasheet-header" onClick={this.helpButtonAction}>▼ ABOUT ▼</button></span>
        }
    }
}

class ProgressLog extends React.Component {
    render() {
        if (this.props.state == "processing") {
            return <div>
                        <span className="w3-animate-fading-fast shop"> {this.props.msg} </span>
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
        this.state = {params: this.props.params[this.props.letter]};
        if (this.props.letter == "A") {
            this.weaponsVisibility = [true, true, true, false, false];
        } else {
            this.weaponsVisibility = [true, false, false, false, false];
        }
        this.showWeapon = this.showWeapon.bind(this);
        this.updateParam = this.updateParam.bind(this);
        this.updateOptionParam = this.updateOptionParam.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    showWeapon() {
        for (var i = 0; i < this.weaponsVisibility.length; i++) {
            if (!this.weaponsVisibility[i]) {
                this.weaponsVisibility[i] = true;
                break;
            }
        }
        if (i == this.weaponsVisibility.length) {
            alert("Maximum number of weapons by profile reached: " + i)
        } else {
            var id = this.props.letter + i
            this.state.params["name" + id] = ("name" + id) in this.state.params ? this.state.params["name" + id] : "Unnamed weapon"
            this.state.params["A" + id] = ("A" + id) in this.state.params ? this.state.params["A" + id] : "1"
            this.state.params["WSBS" + id] = ("WSBS" + id) in this.state.params ? this.state.params["WSBS" + id] : "4"
            this.state.params["S" + id] = ("S" + id) in this.state.params ? this.state.params["S" + id] : "4"
            this.state.params["AP" + id] = ("AP" + id) in this.state.params ? this.state.params["AP" + id] : "0"
            this.state.params["D" + id] = ("D" + id) in this.state.params ? this.state.params["D" + id] : "1"
            this.state.params["options" + id] = ("options" + id) in this.state.params ?
                this.state.params["options" + id] :
                {
                "hit_modifier": "",
                "wound_modifier": "",
                "reroll_hits": "",
                "reroll_wounds": "",
                "dakka3": "",
                "auto_wounds_on": "",
                "is_blast": "",
                "auto_hit": "",
                "wounds_by_2D6": "",
                "reroll_damages": ""
                };
            this.props.syncAppParams(this.state.params, this.props.letter);
            this.setState({})
        }
    }



    onDelete(id) {
        var index = Number(id.slice(-1))
        this.weaponsVisibility[index] = false;
        Object.entries(this.state.params).forEach(([key, value]) => {
            if (key.includes(id)) {
                delete this.state.params[key] // triggers deletion in app params
            }
        });
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }
    
    updateParam(k, v) {
        this.state.params[k] = v;
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }

    updateOptionParam(optionsId, optionName, v) {
        this.state.params[optionsId][optionName] = v;
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }

    render() {
        for (var i = 0; i < 5; i++) {
            var id = this.props.letter + i;
            if (("options" + id) in this.state.params && this.state.params["options" + id]["wounds_by_2D6"] == "yes") {
                this.state.params["S" + id] = "*";
            }
        }

        return <table className="w3-table nowrap">
                <ProfileHeader bg={"profile-" + this.props.letter + "-bg"} letter={this.props.letter} name={this.state.params["name" + this.props.letter]} points={this.state.params["points" + this.props.letter]} updateParam={this.updateParam}/>
                <WeaponRow visible={this.weaponsVisibility[0]} onDelete={this.onDelete} id={this.props.letter + "0"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow visible={this.weaponsVisibility[1]} onDelete={this.onDelete} id={this.props.letter + "1"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow visible={this.weaponsVisibility[2]} onDelete={this.onDelete} id={this.props.letter + "2"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow visible={this.weaponsVisibility[3]} onDelete={this.onDelete} id={this.props.letter + "3"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow visible={this.weaponsVisibility[4]} onDelete={this.onDelete} id={this.props.letter + "4"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <tbody>
                  <tr>
                    <th><button className="logo-btn" onClick={this.showWeapon}><i className="fa"><b>+</b></i></button></th>
                  </tr>
                </tbody>
            </table>;
    }
}

class ProfileHeader extends React.Component {
    render() {
        return  <tbody>
                  <tr className="datasheet-body">
                    <th className={"w3-tooltip datasheet-header profile-flag " + this.props.bg}>
                        <span className="w3-text w3-tag profile-tag tag">An attacking profile represents one<br/>or more models and their weapons,<br/>with a cost associated with the whole</span>Attacking Profile {this.props.letter}
                    </th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Name: <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-profile-name" value={this.props.name} onChange={(event) => {this.props.updateParam(event.target.id + this.props.letter, event.target.value)}} ></input></th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Points: <input maxLength="4" id="points" value={this.props.points} type="text" className="white-bg datasheet-body input input-dice align-left" onChange={(event) => {this.props.updateParam(event.target.id + this.props.letter, event.target.value)}}></input></th>
                  </tr>
                  <tr className="datasheet-header greeny-bg">
                    <th className="white-bg w3-tooltip"><span className="w3-text w3-tag weapons-tag tag">Each different combination of characteristics and<br/>options must be declared in a separate weapon line</span> ▼ Weapons used</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Total number of attacks or shots made using the given weapon,<br/>by the models of the attacking profile during one phase</span>Attacks</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Ballistic Skill or Weapon Skill</span>WS|BS</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Strength</span>S</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Armor Penetration</span>AP</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">n° of Damages</span>D</th>
                    <th className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Click on the<br/>gears to open<br/>the menu</span>Options</th>
                  </tr>
                </tbody>;
    }
}

class WeaponRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleChange(event) {
        this.props.updateParam(event.target.id + this.props.id, event.target.value);
    }

    handleOptionChange(optionName, value) {
        // optionName example: "hit_modifier"
        this.props.updateOptionParam("options" + this.props.id, optionName, value);
    }

    countActiveOptions() {
        var count = 0;
        Object.entries(this.props.params["options"+this.props.id]).forEach(([key, value]) => {
            if (value != "") {
                count += 1;
            }
        });
        return count;
    }

    render() {
        if(this.props.visible) {
            var activeOptionsCount = this.countActiveOptions();
            return <tbody>
                      <tr className="datasheet-body">
                        <th><button className="logo-btn" onClick={(event) => {this.props.onDelete(this.props.id)}}><i className="fa fa-trash"></i></button> <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-weapon-name" value={this.props.params["name"+this.props.id]} onChange={this.handleChange} ></input></th>
                        <th><input maxLength="4" id="A" value={this.props.params["A"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="WSBS" value={this.props.params["WSBS"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.handleChange}></input>+</th>
                        <th><input maxLength="4" id="S" value={this.props.params["S"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>-<input maxLength="4" id="AP" value={this.props.params["AP"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="D" value={this.props.params["D"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>
                            <div id={"options-menu" + this.props.id} className="w3-modal">
                              <div className="w3-modal-content">
                                <header className="w3-container greeny-bg datasheet-header">
                                  Options of weapon: {this.props.params["name"+this.props.id]}
                                </header>
                                <div className="w3-container shop">
                                    <h3>Attacks</h3>
                                    <IsBlastOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["is_blast"]}/>
                                    <Dakka3OptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["dakka3"]}/>
                                    <h3>Hits</h3>
                                    <HitModifierOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["hit_modifier"]}/>
                                    <RerollHitsOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_hits"]}/>
                                    <AutoHitOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["auto_hit"]}/>
                                    <h3>Wounds</h3>
                                    <WoundModifierOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["wound_modifier"]}/>
                                    <RerollWoundsOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_wounds"]}/>
                                    <AutoWoundsOnOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["auto_wounds_on"]}/>
                                    <WoundsBy2D6OptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["wounds_by_2D6"]}/>
                                    <h3>Damages</h3>
                                    <RerollDamagesOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_damages"]}/>
                                </div>
                                <span className="w3-button w3-margin-bottom greeny-bg shop" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="none"}}>Save and close</span>
                              </div>
                            </div>
                            <button className="logo-btn" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="block"}}><i className="fa fa-cogs"></i></button>
                            <i className={activeOptionsCount == 0 ? "option-inactive": "option-active"}> ({activeOptionsCount} active)</i>
                        </th>
                      </tr>
                   </tbody>;
        } else {
            return <tbody></tbody>
        }
    }
}


class HitModifierOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Hit roll modifier: <select id="hit_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="-1">-1</option>
                   <option value=""></option>
                   <option value="1">+1</option>
                   </select>
               </div>
    }
}

class WoundModifierOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                  Wound roll modifier: <select id="wound_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                  <option value="-1">-1</option>
                  <option value=""></option>
                  <option value="1">+1</option>
                  </select>
                </div>
    }
}

class RerollHitsOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Hit rolls reroll: <select id="reroll_hits" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">full</option>
                   </select>
               </div>
    }
}

class RerollWoundsOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Wound rolls reroll: <select id="reroll_wounds" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">full</option>
                   </select>
               </div>
    }
}

class Dakka3OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <i>Dakka Dakka Dakka</i> on <select id="dakka3" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select>
               </div>
    }
}

class AutoWoundsOnOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   An unmodified hit roll of <select id="auto_wounds_on" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select> automatically wounds the target
               </div>
    }
}

class IsBlastOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Is a blast weapon: <select id="is_blast" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class AutoHitOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   This weapon automatically hits its target: <select id="auto_hit" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class WoundsBy2D6OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Wounds if 2D6 roll >= target’s Toughness: <select id="wounds_by_2D6" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class RerollDamagesOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   Damage rolls reroll: <select id="reroll_damages" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);