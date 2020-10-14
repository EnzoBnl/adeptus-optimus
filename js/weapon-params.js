function Processing(props) {
    return <div><div class="w3-animate-fading-fast"><img src="static/logo.png" width="50px"></img></div><span class="datasheet"> {props.msg}</span></div>
}

class WeaponsParamTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        nameA: 'Bolt Rifle',
        nameB: 'SAG',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWeaponParamsChange = this.handleWeaponParamsChange.bind(this);

  }
  handleSubmit(event) {
    event.preventDefault();

    ReactDOM.render(
      <Processing msg="processing..." />,
      document.getElementById('chart')
    );


    var weaponAName = "Bolt Rifle"
    var weaponBName = "SAG"

    var xValues = ['A', 'B', 'C', 'D', 'E'];

    var yValues = ["(1, 1)", "(2, 1)", "(3, 1)", "(4, 1)", "(5, 1)", "(6, 1)", "(7, 1)", "(8, 1)", "(9, 1)", "(10, 1)"];

    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'json';
    // get a callback when the server responds
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log("console.log(xhr.responseText):");
      console.log(xhr.response);
      var zValues = xhr.response["matrix"];
      plotComparatorChart(weaponAName, weaponBName, xValues, yValues, zValues);
    })
    // open the request with the verb and the url
    var params = "?params=" + JSON.stringify({weaponA:[""], weaponB:[]});
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
      <table class="w3-table w3-bordered datasheet">
          <tr style={{background: "#b4bbb4", color: "black"}}>
            <th></th>
            <th>NAME</th>
            <th>WS/BS</th>
            <th>A</th>
            <th>S</th>
            <th>AP</th>
            <th>D</th>
            <th>POINTS</th>
          </tr>
          <tr>
            <th style={{background: "#7dae3e", color: "white"}}>Weapon A</th>
            <th class="datasheet">
                <input
                    id="nameA"
                    type="text"
                    style={{width: "100px"}}
                    value={this.state.nameA}
                    onChange={this.handleWeaponParamsChange}
                    ></input>
            </th>
            <th><input type="text" class="datasheet input-dice"></input>+</th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
          </tr>
          <tr>
            <th style={{background: "#0d407f", color: "white"}}>Weapon B</th>
            <th class="datasheet">
                <input
                    id="nameB"
                    type="text"
                    style={{width: "100px"}}
                    value={this.state.nameB}
                    onChange={this.handleWeaponParamsChange}></input>
            </th>
            <th><input type="text" class="datasheet input-dice"></input>+</th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
            <th><input type="text" class="datasheet input-dice"></input></th>
          </tr>
      </table>
      <br/>
      <input type="submit" value="Compare" class="w3-btn datasheet" style={{background: "#b4bbb4", color: "black"}}/>
      </form>
    );
  }
}


ReactDOM.render(
  <WeaponsParamTable />,
  document.getElementById('weaponsParams')
);