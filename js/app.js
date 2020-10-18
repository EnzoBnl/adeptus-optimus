class App extends React.Component {
    constructor(props) {
        super(props);
        this.sendParamsToApp = this.sendParamsToApp.bind(this);
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
            helpShown: false
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
                () => {console.log("bla");this.setState({state: "idle", msg: ""});}
                )
        } else {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            // get a callback when the server responds
            xhr.onload = () => {
              console.log("console.log(xhr.responseText):");
              console.log(xhr.response);
              if (xhr.status == 200) {
                  this.state.cache[this.state.tableParamsAsString] = {
                      x: xhr.response["x"],
                      y: xhr.response["y"],
                      z: xhr.response["z"]
                  }
                  plotComparatorChart(
                      xhr.response["x"],
                      xhr.response["y"],
                      xhr.response["z"],
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
            var params = "?params=" + this.state.tableParamsAsString;
            xhr.open('GET', 'http://127.0.0.1:5000/engine/' + params);
            // send the request
            xhr.send();
        }


        
    }

    render() {
        console.log("App render() called")
        console.log(this.state);
        return <div>
            <h1><a href="index.html" class="ancient">Adeptus Optimus</a></h1>
            <p class="ancientSub">"Support wiser choices, on behalf of the Emperor."</p>
            <br/>
            <div style={{overflowX: "auto"}}>
                <WeaponsParamTable initState={this.initTableState} sendParamsToApp={this.sendParamsToApp}/>
            </div>
            <br/>
            <button class="w3-btn datasheet-header" style={{background: "#b4bbb4", width: "110px"}} onClick={this.handleSubmit}>COMPARE</button>
            <div class="w3-bar datasheet-bg"><div class="w3-bar-item"></div></div>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" class="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <div class="w3-bar datasheet-bg"><div class="w3-bar-item"></div></div>
            <Help shown={this.state.helpShown}/>
            <div class="w3-bar datasheet-bg"><div class="w3-bar-item"></div></div>
            <button class="w3-btn datasheet-header" style={{background: "#b4bbb4", width: "110px"}} onClick={this.helpButtonAction}>HELP</button>
        </div>
    }

    sendParamsToApp(tableState) {
        console.log("called sendParamsToApp");
        this.setState({tableParamsAsString: this.stringifyRelevantTableState(tableState)});
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
                        <div class="datasheet"> {this.props.msg}</div>
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
      <table class="w3-table w3-bordered" style={{"max-width": "700px", "margin-left": "auto", "margin-right": "auto"}}>
          <tr class="datasheet-bg">
            <th></th>
            <th class="datasheet-header">NAME</th>
            <th class="datasheet-header">A</th>
            <th class="datasheet-header">WS/BS</th>
            <th class="datasheet-header">S</th>
            <th class="datasheet-header">AP</th>
            <th class="datasheet-header">D</th>
            <th class="datasheet-header">POINTS</th>
          </tr>
          <tr>
            <th  class="datasheet-header" style={{background: "#5555ff", color: "black", "text-align": "center"}}>Weapon A</th>
            <th class="datasheet">
                <input maxlength="32"
                    id="nameA"
                    type="text"
                    class="input input-name"
                    value={this.state.nameA}
                    onChange={this.handleWeaponParamsChange}
                    ></input>
            </th>
            <th class="datasheet"><input maxlength="4" id="AA" value={this.state.AA} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="WSBSA" value={this.state.WSBSA} type="text" class="datasheet input input-dice-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th class="datasheet"><input maxlength="4" id="SA" value={this.state.SA} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet">-<input maxlength="4" id="APA" value={this.state.APA} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="DA" value={this.state.DA} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="pointsA" value={this.state.pointsA} type="text" class="datasheet input input-dice-right" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
          <tr>
            <th class="datasheet-header" style={{background: "#ff3333", color: "black", "text-align": "center"}}>Weapon B</th>
            <th class="datasheet">
                <input maxlength="32"
                    id="nameB"
                    type="text"
                    class="input input-name"
                    value={this.state.nameB}
                    onChange={this.handleWeaponParamsChange}></input>
            </th>
            <th class="datasheet"><input maxlength="4" id="AB" value={this.state.AB} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="WSBSB" value={this.state.WSBSB} type="text" class="datasheet input input-dice-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th class="datasheet"><input maxlength="4" id="SB" value={this.state.SB} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet">-<input maxlength="4" id="APB" value={this.state.APB} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="DB" value={this.state.DB} type="text" class="datasheet input input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th class="datasheet"><input maxlength="4" id="pointsB" value={this.state.pointsB} type="text" class="datasheet input input-dice-right" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
      </table>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);