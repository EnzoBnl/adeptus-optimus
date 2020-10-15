class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {state: "idle", msg: ""};  // state in: "idle", "processing","error";
        this.setAppState = this.setAppState.bind(this);
    }
    render() {
        console.log(this.state);
        return <div style={{overflowX: "auto"}}>
            <h1><a href="index.html" class="ancient">Adeptus Optimus</a></h1>
            <p class="ancientSub">"Support wiser choices, on behalf of the Emperor."</p>
            <br/>
            <WeaponsParamTable setAppState={this.setAppState}/>
            <div class="w3-bar shop-bg"><div class="w3-bar-item"></div></div>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div id="chart-title" class="chart-title"></div>
            <div id="chart" class="chart"></div>
            <div class="w3-bar shop-bg"><div class="w3-bar-item"></div></div>
        </div>
    }
    setAppState(props) {
        this.setState(props);
    }
}

class ProgressLog extends React.Component {
    render() {
        if (this.props.state == "processing") {
            return <div>
                        <img class="w3-animate-fading-fast" src="static/skull.png" width="32px"></img>
                        <span class="shop"> {this.props.msg} </span>
                        <img class="w3-animate-fading-fast" src="static/skull.png" width="32px"></img>

                        <p><img src="static/testing.gif" width="256px"></img></p>
                   </div>
        } else if (this.props.state == "error") {
            return <div>
                        <img src="static/chaos.png" width="50px"></img>
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
    this.state = {
        AA: "2",
        AB: "D6",
        APA: "1",
        APB: "5",
        DA: "1",
        DB: "D6",
        SA: "4",
        SB: "2D6",
        WSBSA: "3",
        WSBSB: "5",
        nameA: 'Bolt Rifle (15") on Intercessor',
        nameB: "SAG on Big Mek",
        pointsA: "20",
        pointsB: "120",
    };
    this.setAppState = props.setAppState;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWeaponParamsChange = this.handleWeaponParamsChange.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    document.getElementById('chart').innerHTML = "";
    document.getElementById('chart-title').innerHTML = "";
    this.setAppState({state: "processing", msg: "Testing weapons..."/*"Firing on some captives Grots..."*/});

    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // get a callback when the server responds
    xhr.onload = () => {
      console.log("console.log(xhr.responseText):");
      console.log(xhr.response);
      if (xhr.status == 200) {
         plotComparatorChart(this.state["nameA"], this.state["nameB"], xhr.response["x"], xhr.response["y"], xhr.response["z"], () => {this.setAppState({state: "idle", msg: ""});});
      } else {
        this.setAppState({
            state: "error",
            msg: "ERROR " + xhr.status + ": " + xhr.response["msg"]
        });
      }
    };
    // get a callback when net::ERR_CONNECTION_REFUSED
    xhr.onerror = () => {
        console.log("console.log(xhr.responseText):");
        console.log(xhr.response);
        this.setAppState({
            state: "error",
            msg: "SERVER DOWN: The Forge World of the Adeptus Optimus must be facing an onslaught of heretics."
        });
    };
    // open the request with the verb and the url
    var params = "?params=" + JSON.stringify(this.state);
    xhr.open('GET', 'http://127.0.0.1:5000/engine/' + params);
    // send the request
    xhr.send();
  }

  handleWeaponParamsChange(event) {
    console.log(this.state);
    this.state[event.target.id] = event.target.value;
    this.setState({});  // re render
  }



  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <table class="w3-table w3-bordered">
          <tr class="shop-bg">
            <th></th>
            <th class="datasheet-header">NAME</th>
            <th class="datasheet-header">WS/BS</th>
            <th class="datasheet-header">A</th>
            <th class="datasheet-header">S</th>
            <th class="datasheet-header">AP</th>
            <th class="datasheet-header">D</th>
            <th class="datasheet-header">POINTS</th>
          </tr>
          <tr>
            <th  class="datasheet-header" style={{background: "#6d9e2e", color: "white"}}>Weapon A</th>
            <th class="datasheet">
                <input maxlength="32"
                    id="nameA"
                    type="text"
                    style={{width: "125px"}}
                    value={this.state.nameA}
                    onChange={this.handleWeaponParamsChange}
                    ></input>
            </th>
            <th><input maxlength="4" id="WSBSA" value={this.state.WSBSA} type="text" class="datasheet input-dice-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th><input maxlength="4" id="AA" value={this.state.AA} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="SA" value={this.state.SA} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th>-<input maxlength="4" id="APA" value={this.state.APA} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="DA" value={this.state.DA} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="pointsA" value={this.state.pointsA} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
          <tr>
            <th class="datasheet-header" style={{background: "#0d407f", color: "white"}}>Weapon B</th>
            <th class="datasheet">
                <input maxlength="32"
                    id="nameB"
                    type="text"
                    style={{width: "125px"}}
                    value={this.state.nameB}
                    onChange={this.handleWeaponParamsChange}></input>
            </th>
            <th><input maxlength="4" id="WSBSB" value={this.state.WSBSB} type="text" class="datasheet input-dice-right" onChange={this.handleWeaponParamsChange}></input>+</th>
            <th><input maxlength="4" id="AB" value={this.state.AB} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="SB" value={this.state.SB} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th>-<input maxlength="4" id="APB" value={this.state.APB} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="DB" value={this.state.DB} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
            <th><input maxlength="4" id="pointsB" value={this.state.pointsB} type="text" class="datasheet input-dice-left" onChange={this.handleWeaponParamsChange}></input></th>
          </tr>
      </table>
      <br/>
      <input maxlength="4" type="submit" value="Compare" class="w3-btn shop shop-bg"/>
      </form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);