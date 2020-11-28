class ProfileTableHeader extends React.Component {
    render() {
        return  <tbody>
                  <tr className="datasheet-header">
                    <th className={"datasheet-header profile-flag " + this.props.bg}>
                        Attacking Profile {this.props.letter}<span className="w3-tooltip"><span className="w3-text w3-tag profile-tag tag">An attacking profile represents one<br/>or more models and their weapons,<br/>with a cost associated with the whole</span><sup className="fa fa-question-circle w3-medium"></sup></span>
                    </th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Name: <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-profile-name" value={this.props.name} onChange={(event) => {this.props.updateParam(event.target.id + this.props.letter, event.target.value)}} ></input></th>
                  </tr>
                  <tr className="datasheet-header">
                    <th>Points<span className=" w3-tooltip"><span className="w3-text w3-tag param-tag tag">Points cost of the whole attacking profile.<br/>Example: For 5 Nobz with klaws you can enter either <b>135</b> or <b>5*(17+10)</b></span><sup className="fa fa-question-circle w3-medium"></sup></span>: <input maxLength="32" id="points" value={this.props.points} type="text" className="white-bg datasheet-body input input-weapon-name align-left" onChange={(event) => {this.props.updateParam(event.target.id + this.props.letter, event.target.value)}}></input></th>
                  </tr>
                  <tr className="datasheet-header greeny-bg">
                    <th className="white-bg">Weapons used<span className=" w3-tooltip"><span className="w3-text w3-tag weapons-tag tag">Each different combination of characteristics and options must be declared as a separate weapon line</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>Attacks<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Total number of attacks or shots made using the given weapon<br/>during one phase, by the models of the attacking profile.<br/>Examples: <b>1</b>, <b>87</b>, <b>D3</b>, <b>3D6</b>...</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>WS|BS<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Ballistic Skill or Weapon Skill.<br/>Examples: <b>2</b>, <b>6</b>...</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>S<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Strength.<br/>Examples: <b>1</b>, <b>5</b>, <b>2D6</b>...</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>AP<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Armor Penetration.<br/>Examples: <b>0</b>, <b>1</b>, <b>D6</b>...</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>D<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Number of Damages.<br/>Examples: <b>1</b>, <b>2</b>, <b>D3</b>...</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                    <th>Options<span className="w3-tooltip"><span className="w3-text w3-tag param-tag tag">Click on the gears<br/>to open the menu</span><sup className="fa fa-question-circle w3-medium"></sup></span></th>
                  </tr>
                </tbody>;
    }
}
