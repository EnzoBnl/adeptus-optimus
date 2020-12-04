class ProfileTableHeader extends React.Component {
  render() {
    return <tbody>
      <tr className="datasheet-header">
        <th className={'datasheet-header profile-flag ' + this.props.bg}>
          {this.props.lang == 'en' ? 'Attacking Profile' : 'Profil Attaquant'}
          &nbsp;
          {this.props.letter}
          <span className="w3-tooltip">
            <span className="w3-text w3-tag profile-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  An attacking profile represents one<br/>or several models and
                  their weapons,<br/>with a cost associated with the whole
                </span> :
                <span>
                  Un profil attaquant représente une<br/>ou plusieurs figurines
                  ainsi que leurs armes,<br/>plus un coût associé à l'ensemble
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
      </tr>
      <tr className="datasheet-header">
        <th>{this.props.lang == 'en' ? 'Name': 'Nom'}:&nbsp;
          <input
            maxLength="32"
            id="name"
            type="text"
            className="white-bg datasheet-body input input-profile-name"
            value={this.props.name}
            onChange={(event) => this.props.onParamChange(
                event.target.id + this.props.letter,
                event.target.value,
            )}>
          </input>
        </th>
      </tr>
      <tr className="datasheet-header">
        <th>Points
          <span className=" w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Points cost of the whole attacking profile.<br/>
                  Example: For 5 Nobz with klaws you can enter
                  either <b>135</b> or <b>5*(17+10)</b>
                </span> :
                <span>
                  Coût en points de l'ensemble du profil attaquant.<br/>
                  Exemple: Pour 5 Nobz avec des pinces on peut
                  entrer <b>135</b> ou bien <b>5*(17+10)</b>
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>:&nbsp;
          <input
            maxLength="32"
            id="points"
            value={this.props.points}
            type="text"
            className=
              "white-bg datasheet-body input input-weapon-name align-left"
            onChange={(event) => this.props.onParamChange(
                event.target.id + this.props.letter,
                event.target.value,
            )}>
          </input>
        </th>
      </tr>
      <tr className="datasheet-header greeny-bg">
        <th className="white-bg">
          {this.props.lang == 'en' ? 'Weapons used' : 'Armes utilisées'}
          <span className=" w3-tooltip">
            <span className="w3-text w3-tag weapons-tag tag">
              {this.props.lang == 'en' ?
                'Each different combination of characteristics and options' +
                ' must be declared as a separate weapon line' :
                'Une nouvelle ligne doit être ajoutée pour chaque combinaison' +
                ' de paramètres et d\'options utilisée'
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>{this.props.lang == 'en' ? 'Attacks' : 'Attaques'}
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Total number of attacks or shots made using the given
                  weapon<br/>during one phase, by the models of the attacking
                  profile.<br/>
                  Examples: <b>24</b>, <b>3D3</b>, <b>2D6</b>...
                </span> :
                <span>
                  Nombre total d'attaques ou de tir effectués avec l'arme en
                  question<br/>durant une phase, par les figurines du profil
                  attaquant.<br/>Exemples: <b>24</b>, <b>3D3</b>, <b>2D6</b>...
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>{this.props.lang == 'en' ? 'WS|BS' : 'CC|CT'}
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Weapon Skill or Ballistic Skill.<br/>
                  Examples: <b>2</b>, <b>6</b>...
                </span> :
                <span>
                  Capacité de Combat ou Capacité de Tir.<br/>
                  Exemples: <b>2</b>, <b>6</b>...
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>{this.props.lang == 'en' ? 'S' : 'F'}
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Strength.<br/>Examples: <b>5</b>, <b>5</b>, <b>2D6</b>...
                </span> :
                <span>
                  Force.<br/>Exemples: <b>4</b>, <b>5</b>, <b>2D6</b>...
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>{this.props.lang == 'en' ? 'AP' : 'PA'}
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Armor Penetration.<br/>
                  Examples: <b>0</b>, <b>1</b>, <b>D6</b>...
                </span> :
                <span>
                  Pénétration d'Armure.<br/>
                  Exemples: <b>0</b>, <b>1</b>, <b>D6</b>...
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>D
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Number of Damages.<br/>
                  Examples: <b>1</b>, <b>2</b>, <b>D3</b>...
                </span> :
                <span>
                  Nombre de Domages.<br/>
                  Examples: <b>1</b>, <b>2</b>, <b>D3</b>...
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
        <th>Options
          <span className="w3-tooltip">
            <span className="w3-text w3-tag param-tag tag">
              {this.props.lang == 'en' ?
                <span>
                  Click on the gears<br/>to open the menu
                </span> :
                <span>
                  Cliquer pour<br/>ouvrir le menu
                </span>
              }
            </span>
            <sup className="fa fa-question-circle w3-medium"></sup>
          </span>
        </th>
      </tr>
    </tbody>;
  }
}
