class App extends React.Component {
    constructor(props) {
        super(props);
        this.sendParamsToApp = this.sendParamsToApp.bind(this);
        this.sendCredentialsToApp = this.sendCredentialsToApp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.helpButtonAction = this.helpButtonAction.bind(this);

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
            helpShown: false,
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
                () => {console.log("bla");this.setState({state: "idle", msg: ""});}
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
                  } else {
                    this.setState({
                        state: "error",
                        msg: "SERVER ERROR " + xhr.status + ": " + xhr.response["msg"]
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
            <p class="version">version: ALPHA v0.0.0</p>
            <Login initState={{id: this.state.id, token: this.state.token}} sendCredentialsToApp={this.sendCredentialsToApp}/>
            <h1><a href="index.html" class="title">Adeptus Optimus</a></h1>
            <p class="title subscript">" Support wiser choices, on behalf of the Emperor."</p>
            <br/>
            <div style={{overflowX: "auto"}}>
                <WeaponsParamTable initState={this.initTableState} sendParamsToApp={this.sendParamsToApp}/>
            </div>
            <br/>
            <button class="w3-btn greeny-bg datasheet-header" onClick={this.handleSubmit}>COMPARE</button>
            <div class="w3-bar greeny-bg"><div class="w3-bar-item"></div></div>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" class="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <div class="w3-bar greeny-bg"><div class="w3-bar-item"></div></div>
            <Help shown={this.state.helpShown}/>
            <div class="w3-bar greeny-bg"><div class="w3-bar-item"></div></div>
            <button class="w3-btn greeny-bg datasheet-header" onClick={this.helpButtonAction}>HELP</button>
        </div>
    }

    sendParamsToApp(tableState) {
        console.log("called sendParamsToApp");
        this.setState({tableParamsAsString: this.stringifyRelevantTableState(tableState)});
    }

    sendCredentialsToApp(creds) {
        console.log("called sendCredentialsToApp");
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

    helpButtonAction() {
        this.setState({helpShown: !this.state.helpShown});
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
                   <br/>
                   <span class="nowrap">
                       <span class="login-label"> token: </span>
                       <input maxlength="128" id="token" type="text" class="input input-login" value={this.state.token} onChange={this.handleChange}></input>
                   </span>
               </div>
    }
}

class Help extends React.Component {
    render() {
        if (this.props.shown) {
            return <p class="shop">Help: TODO</p>
        } else {
            return <span></span>
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
    console.log(this.state);
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
          <Options />
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

class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
      return <tr class="datasheet-body">
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
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);