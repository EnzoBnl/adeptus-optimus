class ProfileTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weaponsVisibility: [...Array(this.props.nWeapons).keys()]
          .map((i) => ('A' + this.props.letter + i) in this.props.params),
    };
    this.showWeapon = this.showWeapon.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  showWeapon() {
    // never called if all weapon slots used thanks to conditional button hiding
    for (var i = 0; i < this.state.weaponsVisibility.length; i++) {
      if (!this.state.weaponsVisibility[i]) {
        this.state.weaponsVisibility[i] = true;
        break;
      }
    }

    const id = this.props.letter + i;
    const params = {};
    params['name' + id] = 'Anonymous';
    params['A' + id] = '1';
    params['WSBS' + id] = '4';
    params['S' + id] = '4';
    params['AP' + id] = '0';
    params['D' + id] = '1';
    params['options' + id] = {...this.props.defaultOptions};

    this.props.onParamsChange(params, this.props.letter);
  }

  getWeaponRank(index) {
    let count = 0;
    let i = 0;
    while (i < index) {
      if (this.state.weaponsVisibility[i]) {
        count += 1;
      }
      i += 1;
    }
    return '#' + (count + 1);
  }

  getNumberOfActiveWeapons() {
    let count = 0;
    let i = 0;
    while (i < this.state.weaponsVisibility.length) {
      if (this.state.weaponsVisibility[i]) {
        count += 1;
      }
      i += 1;
    }
    return count;
  }

  onDelete(id) {
    const index = Number(id.slice(-1));
    this.state.weaponsVisibility[index] = false;
    Object.entries(this.props.params).forEach(([key, value]) => {
      if (key.includes(id)) {
        this.props.deleteParam(key, this.props.letter);
      }
    });
  }

  render() {
    for (let i = 0; i < this.state.weaponsVisibility.length; i++) {
      const id = this.props.letter + i;

      if (('options' + id) in this.props.params &&
        this.props.params['options' + id]['wounds_by_2D6'] == 'yes') {
        this.props.params['S' + id] = '*';
      }
    }

    return <table className="w3-table nowrap">
      <ProfileTableHeader
        lang={this.props.lang}
        bg={'profile-' + this.props.letter + '-bg'}
        letter={this.props.letter}
        name={this.props.params['name' + this.props.letter]}
        points={this.props.params['points' + this.props.letter]}
        onParamChange=
          {(k, v) => this.props.onParamChange(k, v, this.props.letter)}
      />
      {
        [...Array(this.state.weaponsVisibility.length).keys()].map((key) =>
          <WeaponRow
            key={key}
            lang={this.props.lang}
            rank={this.getWeaponRank(key)}
            visible={this.state.weaponsVisibility[key]}
            onDelete={this.onDelete}
            id={this.props.letter + key}
            params={this.props.params}
            onParamChange=
              {(k, v) => this.props.onParamChange(k, v, this.props.letter)}
            onOptionChange=
              {
                (optionsId, optionName, vOption) => this.props.onParamChange(
                    optionsId,
                    {
                      ...this.props.params[optionsId],
                      ...{[optionName]: vOption},
                    },
                    this.props.letter)
              }
          />,
        )
      }
      {this.getNumberOfActiveWeapons() == this.state.weaponsVisibility.length ?
        <tbody></tbody> :
        <tbody>
          <tr>
            <th>
              <button className="logo-btn" onClick={this.showWeapon}>
                <i className="fa"><b>+</b></i>
              </button>
            </th>
          </tr>
        </tbody>
      }
    </table>;
  }
}
