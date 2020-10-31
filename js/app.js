class App extends React.Component {
    constructor(props) {
        super(props);
        this.sendParamsToApp = this.sendParamsToApp.bind(this);
        this.sendCredentialsToApp = this.sendCredentialsToApp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.initTableState = {
            AB: "2",
            AA: "D6",
            APB: "1",
            APA: "5",
            DB: "1",
            DA: "D6",
            SB: "4",
            SA: "2D6",
            WSBSB: "3",
            WSBSA: "5",
            nameB: 'Bolt Rifle (15") on Intercessor',
            nameA: "SAG on Big Mek",
            pointsB: "20",
            pointsA: "120",
        };

        this.state = {
            state: "idle",  // state in: "idle", "processing","error";
            msg: "",
            tableParamsAsString: this.stringifyRelevantTableState(this.initTableState),
            cache: {},
            id: "admin",
            token: "U2FsdGVkX197wfW/IY0sqa/Ckju8AeU3pRLPSra1aCxZeAHrWePPDPJlYTy5bwdU"
        };
        this.state.cache[this.state.tableParamsAsString] = getSample();
    }


    handleSubmit(event) {
        event.preventDefault();
        document.getElementById('chart').innerHTML = "";
        this.setState({state: "processing", msg: "Testing weapons..."/*"Firing on some captives Grots..."*/})

        if (this.state.tableParamsAsString in this.state.cache) {
            const cachedResponse = this.state.cache[this.state.tableParamsAsString];
            plotComparatorChart(
                cachedResponse["x"],
                cachedResponse["y"],
                cachedResponse["z"],
                cachedResponse["ratios"],
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
                var params = this.state.tableParamsAsString;
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'json';
                // get a callback when the server responds
                xhr.onload = () => {
                  console.log("console.log(xhr.responseText):");
                  console.log(xhr.response);
                  if (xhr.status == 200) {
                      this.state.cache[params] = { // ensures changing params during request is safe
                          x: xhr.response["x"],
                          y: xhr.response["y"],
                          z: xhr.response["z"],
                          ratios: xhr.response["ratios"]
                      }
                      plotComparatorChart(
                          xhr.response["x"],
                          xhr.response["y"],
                          xhr.response["z"],
                          xhr.response["ratios"],
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
                xhr.open('GET', serverIp + "?params=" + params);
                // send the request
                xhr.send();
            }
        }
    }

    render() {
        console.log("App render() called")
        console.log(this.state);
        return <div>
            <h1><a href="index.html" class="title">Adeptus Optimus</a></h1>
            <p class="title subscript">" Support wiser choices, on behalf of the Emperor."</p>
            <Login initState={{id: this.state.id, token: this.state.token}} sendCredentialsToApp={this.sendCredentialsToApp}/>
            <br/>
            <div style={{overflowX: "auto"}}>
                <WeaponsParamTable initState={this.initTableState} sendParamsToApp={this.sendParamsToApp}/>
            </div>
            <br/>
            <button class="w3-btn greeny-bg datasheet-header" onClick={this.handleSubmit}>COMPARE</button>
            <br/>
            <br/>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" class="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <br/>
            <br/>
            <div class="w3-bar greeny-bg"><div class="w3-bar-item"></div></div>
            <div class="w3-bar greeny-bg"><div class="w3-bar-item"></div></div>
            <Help />
            <p class="version">engine ALPHA v0.0.0</p>
        </div>
    }

    sendParamsToApp(tableState) {
        this.setState({tableParamsAsString: this.stringifyRelevantTableState(tableState)});
    }

    sendCredentialsToApp(creds) {
        this.setState(creds);
    }

    getRelevantTableStateKeys(tableState) {
        var tableRelevantState = {...tableState};
        delete tableRelevantState["nameA"];
        delete tableRelevantState["nameB"];
        return tableRelevantState
    }

    stringifyRelevantTableState(tableState) {
        return JSON.stringify(this.getRelevantTableStateKeys(tableState))
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initState;  // TODO remove
        this.handleChange=this.handleChange.bind(this);
        this.sendCredentialsToApp = props.sendCredentialsToApp;
    }
    handleChange(state) {
        this.state[event.target.id] = event.target.value;
        this.setState({});  // re render
        this.sendCredentialsToApp(this.state);
    }
    render() {
        return <div style={{"text-align": "right", "margin-right":"25px", "margin-top":"25px"}}>
                   <span class="nowrap">
                       <span class="login-label">id: </span>
                       <input maxlength="10" id="id" type="text" class="input input-login" value={this.state.id} onChange={this.handleChange}></input>
                   </span>
                   <span class="nowrap">
                       <span class="login-label"> token: </span>
                       <input maxlength="128" id="token" type="text" class="input input-login" value={this.state.token} onChange={this.handleChange}></input>
                   </span>
               </div>
    }
}

class InfoBox extends React.Component {
    render() {
        return <div class="w3-quarter info-box">
                 <div class="w3-card w3-container">
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
        this.button = <button class="w3-btn greeny-bg datasheet-header" onClick={this.helpButtonAction}>ABOUT</button>;
    }

    helpButtonAction() {
        this.setState({visible: !this.state.visible});
    }

    render() {
        if (this.state.visible) {
             return <div>
                        {this.button}
                        <div class="w3-row-padding w3-center w3-margin-top shop help">
                            <InfoBox title="Adeptus Optimus" body={<p>The <i>Adeptus Optimus</i> is an analytics organization attached to the <i>Adeptus Mechanicus</i>. The <i>Adeptus Optimus Engine</i> has been built by an <i>Archimagus computus mathematica</i> to give to lords of war an <b>intuitive and rigorous tool</b> to guide their weapons choices.</p>}/>
                            <InfoBox title="Attacking profiles" body={<p>The engine performs a comparison between two attacking profiles. Each <b>profile represents one or more models and their weapons</b> and has a cost for the whole. Each weapon used by the models of a the profile has to be declared and assigned a number of <i>Shots</i> made with it during a phase.</p>}/>
                            <InfoBox title="Results" body={<p>The engine computes a precise <i>average number of target unit's models killed per profile point</i> for profiles A and B, against a <b>large variety of target units defense profiles</b>. The engine leverages advanced algorithmic to compute deterministic calculus leading to almost exact results.</p>}/>
                            <InfoBox title="The ultimate engine" body={<p>The entire dice rolls sequences are theoretically modeled, making the <i>Adeptus Optimus Engine</i> the only tool handling <b>complex effects of random damages characteristics and <i>Feel No Pains</i></b> during the sequential damage allocation step, or the <b>threshold effects introduced by a random <i>Strength</i> characteristic</b>, among others.</p>}/>
                        </div>
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
                        <img class="w3-animate-fading-fast" src="public/images/skull.png" width="32px"></img>
                        <span class="shop"> {this.props.msg} </span>
                        <img class="w3-animate-fading-fast" src="public/images/skull.png" width="32px"></img>

                        <p><img src="public/images/testing.gif" width="auto"></img></p>
                   </div>
        } else if (this.props.state == "error") {
            return <div>
                        <img src="public/images/chaos.png" width="50px"></img>
                        <div class="datasheet-body"> {this.props.msg}</div>
                   </div>
        } else {
            return <span></span>;
        };
    }
}

class WeaponsParamTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initState;
    this.sendParamsToApp = props.sendParamsToApp;
    this.handleWeaponParamsChange = this.handleWeaponParamsChange.bind(this);
  }

  handleWeaponParamsChange(event) {
    this.state[event.target.id] = event.target.value;
    this.setState({});  // re render
    this.sendParamsToApp(this.state);
  }

  render() {
    return (
      <table class="w3-table w3-bordered nowrap">
          <tr class="greeny-bg datasheet-header">
            <th style={{background: "#fff"}}></th>
            <th>NAME</th>
            <th>A</th>
            <th>WS/BS</th>
            <th>S</th>
            <th>AP</th>
            <th>D</th>
            <th>POINTS</th>
          </tr>
          <tr class="datasheet-body">
            <th  class="datasheet-header weapon-flag weapon-a-bg">Weapon A</th>
            <th><input maxlength="32" id="nameA" type="text" class="input input-name" value={this.state.nameA} onChange={this.handleWeaponParamsChange} ></input>
            </th>
            <th><input maxlength="4" id="AA" value={this.state.AA} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="WSBSA" value={this.state.WSBSA} type="text" class="input input-dice align-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th><input maxlength="4" id="SA" value={this.state.SA} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th>-<input maxlength="4" id="APA" value={this.state.APA} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="DA" value={this.state.DA} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="pointsA" value={this.state.pointsA} type="text" class="input input-dice align-right" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
          <tr class="datasheet-body">
            <th class="datasheet-header weapon-flag weapon-b-bg">Weapon B</th>
            <th><input maxlength="32" id="nameB" type="text" class="input input-name" value={this.state.nameB} onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="AB" value={this.state.AB} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="WSBSB" value={this.state.WSBSB} type="text" class="input input-dice align-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th><input maxlength="4" id="SB" value={this.state.SB} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th>-<input maxlength="4" id="APB" value={this.state.APB} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="DB" value={this.state.DB} type="text" class="input input-dice align-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="pointsB" value={this.state.pointsB} type="text" class="input input-dice align-right" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
      </table>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);