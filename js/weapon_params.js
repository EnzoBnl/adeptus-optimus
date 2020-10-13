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

    var yValues = ['W', 'X', 'Y', 'Z'];

    var zValues = [
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.00, 0.00, 0.75, 0.75, 0.00],
      [0.75, 0.75, 0.75, 0.75, 0.75],
      [0.00, 0.00, 0.00, 0.75, 0.00]
    ];
    plotComparatorChart(weaponAName, weaponBName, xValues, yValues, zValues)
  }

  handleWeaponANameChange(event) {    this.setState({weaponAName: event.target.value});  }
  handleWeaponBNameChange(event) {    this.setState({weaponBName: event.target.value});  }



  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <table class="w3-table">
          <tr style={{background: "#aaa", color: "black"}}>
            <th>Weapon's name</th>
            <th>WS/BS</th>
            <th>A</th>
            <th>S</th>
            <th>AP</th>
            <th>D</th>
            <th>points</th>
          </tr>
          <tr>
            <th style={{background: "#7dae3e", color: "white"}}>
                <input
                    type="text"
                    style={{width: "100px"}}
                    value={this.state.weaponAName}
                    onChange={this.handleWeaponANameChange}></input>
            </th>
            <th><input type="text" class="inputDice"></input>+</th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
            <th><input type="text" class="inputDice"></input></th>
          </tr>
          <tr>
            <th style={{background: "#0d407f", color: "white"}}>
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
      <input type="submit" value="COMPARE WEAPONS" class="w3-btn" style={{background: "#aaa", color: "black"}}/>
      </form>
    );
  }
}


ReactDOM.render(
  <WeaponParamTable />,
  document.getElementById('weaponsParams')
);