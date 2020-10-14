class WeaponParamTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        weaponAName: 'Bolt Rifle',
        weaponBName: 'SAG',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWeaponANameChange = this.handleWeaponANameChange.bind(this);
    this.handleWeaponBNameChange = this.handleWeaponBNameChange.bind(this);

  }
  handleSubmit(event) {
    event.preventDefault();
    var weaponAName = "Bolt Rifle"
    var weaponBName = "SAG"

    var xValues = ['A', 'B', 'C', 'D', 'E'];

    var yValues = ["(1, 1)", "(2, 1)", "(3, 1)", "(4, 1)", "(5, 1)", "(6, 1)", "(7, 1)", "(8, 1)", "(9, 1)", "(10, 1)"];

    var zValues = [
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.75, 0.75, 0.75, 0.75, 0.75],
      [0.00, 0.00, 0.00, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.75, 0.75, 0.75, 0.75, 0.75],
      [0.00, 0.00, 0.00, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00]
    ];
    document.getElementById("chart-title").innerHTML = "<i>" + weaponAName + "</i> vs <i>" + weaponBName + "</i>:\nAverage number of figurines destroyed by each weapon, divided by respective costs.";
    plotComparatorChart(weaponAName, weaponBName, xValues, yValues, zValues)
  }

  handleWeaponANameChange(event) {    this.setState({weaponAName: event.target.value});  }
  handleWeaponBNameChange(event) {    this.setState({weaponBName: event.target.value});  }



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
            <th>
                <input
                    type="text"
                    style={{width: "100px"}}
                    value={this.state.weaponAName}
                    onChange={this.handleWeaponANameChange}
                    ></input>
            </th>
            <th><input type="text" class="inputDice"></input>+</th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
          </tr>
          <tr>
            <th style={{background: "#0d407f", color: "white"}}>Weapon B</th>
            <th>
                <input
                    type="text"
                    style={{width: "100px"}}
                    value={this.state.weaponBName}
                    onChange={this.handleWeaponBNameChange}></input>
            </th>
            <th><input type="text" class="inputDice"></input>+</th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
          </tr>
      </table>
      <br/>
      <input type="submit" value="Compare" class="w3-btn datasheet" style={{background: "#b4bbb4", color: "black"}}/>
      </form>
    );
  }
}


ReactDOM.render(
  <WeaponParamTable />,
  document.getElementById('weaponsParams')
);