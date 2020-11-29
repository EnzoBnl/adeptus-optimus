class ProfileTable extends React.Component {
    constructor(props) {
        super(props);
        this.defaultOptions = {
            "hit_modifier": "",
            "wound_modifier": "",
            "save_modifier": "",
            "reroll_hits": "",
            "reroll_wounds": "",
            "dakka3": "",
            "auto_wounds_on": "",
            "is_blast": "",
            "auto_hit": "",
            "wounds_by_2D6": "",
            "reroll_damages": "",
            "roll_damages_twice": "",
            "snipe": "",
            "hit_explodes": ""
        }

        this.state = {params: this.props.params[this.props.letter]};
        this.weaponsVisibility = [];
        for (var i = 0; i < 5; i++) {
            var id = this.props.letter + i;
            if (("A" + id) in this.state.params) {
                this.weaponsVisibility.push(true);
                this.state.params["options" + id] = {...this.defaultOptions, ...this.state.params["options" + id]};
            } else {
                this.weaponsVisibility.push(false);
            }
        }

        this.showWeapon = this.showWeapon.bind(this);
        this.updateParam = this.updateParam.bind(this);
        this.updateOptionParam = this.updateOptionParam.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    showWeapon() {
        // never called if all weapon slots used thanks to conditional button hiding
        for (var i = 0; i < this.weaponsVisibility.length; i++) {
            if (!this.weaponsVisibility[i]) {
                this.weaponsVisibility[i] = true;
                break;
            }
        }

        var id = this.props.letter + i

        this.state.params["name" + id] = "Anonymous";
        this.state.params["A" + id] = "1";
        this.state.params["WSBS" + id] = "4";
        this.state.params["S" + id] = "4";
        this.state.params["AP" + id] = "0";
        this.state.params["D" + id] =  "1";
        this.state.params["options" + id] = {...this.defaultOptions};
        this.props.syncAppParams(this.state.params, this.props.letter);

        this.setState({})
    }

    getWeaponRank(index) {
        var count = 0;
        var i = 0;
        while (i < index){
            if (this.weaponsVisibility[i]) {
                count += 1
            }
            i += 1 ;
        }
        return "#" + (count + 1);
    }

    getNumberOfActiveWeapons() {
        var count = 0;
        var i = 0;
        while (i < this.weaponsVisibility.length){
            if (this.weaponsVisibility[i]) {
                count += 1
            }
            i += 1 ;
        }
        return count;
    }

    onDelete(id) {
        var index = Number(id.slice(-1))
        this.weaponsVisibility[index] = false;
        Object.entries(this.state.params).forEach(([key, value]) => {
            if (key.includes(id)) {
                delete this.state.params[key] // triggers deletion in app params
            }
        });
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }

    updateParam(k, v) {
        this.state.params[k] = v;
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }

    updateOptionParam(optionsId, optionName, v) {
        this.state.params[optionsId][optionName] = v;
        this.props.syncAppParams(this.state.params, this.props.letter);
        this.setState({})
    }

    render() {
        for (var i = 0; i < this.weaponsVisibility.length; i++) {
            var id = this.props.letter + i;
            if (("options" + id) in this.state.params && this.state.params["options" + id]["wounds_by_2D6"] == "yes") {
                this.state.params["S" + id] = "*";
            }
        }

        return <table className="w3-table nowrap">
                <ProfileTableHeader lang={this.props.lang} bg={"profile-" + this.props.letter + "-bg"} letter={this.props.letter} name={this.state.params["name" + this.props.letter]} points={this.state.params["points" + this.props.letter]} updateParam={this.updateParam}/>
                <WeaponRow lang={this.props.lang} rank={this.getWeaponRank(0)} visible={this.weaponsVisibility[0]} onDelete={this.onDelete} id={this.props.letter + "0"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow lang={this.props.lang} rank={this.getWeaponRank(1)} visible={this.weaponsVisibility[1]} onDelete={this.onDelete} id={this.props.letter + "1"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow lang={this.props.lang} rank={this.getWeaponRank(2)} visible={this.weaponsVisibility[2]} onDelete={this.onDelete} id={this.props.letter + "2"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow lang={this.props.lang} rank={this.getWeaponRank(3)} visible={this.weaponsVisibility[3]} onDelete={this.onDelete} id={this.props.letter + "3"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                <WeaponRow lang={this.props.lang} rank={this.getWeaponRank(4)} visible={this.weaponsVisibility[4]} onDelete={this.onDelete} id={this.props.letter + "4"} params={this.state.params} updateParam={this.updateParam} updateOptionParam={this.updateOptionParam}/>
                {this.getNumberOfActiveWeapons() == this.weaponsVisibility.length ? <tbody></tbody>: <tbody>
                  <tr>
                    <th><button className="logo-btn" onClick={this.showWeapon}><i className="fa"><b>+</b></i></button></th>
                  </tr>
                </tbody>}
            </table>;
    }
}
