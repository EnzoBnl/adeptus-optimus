class WeaponRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.diceInputChars = "0123456789D";
    }

    handleChange(event) {
        if (event.target.id == "name") {
            var value = event.target.value
        } else {
            var value = ""
            for (var i = 0; i < event.target.value.length; i++) {
                value += this.diceInputChars.includes(event.target.value[i]) ? event.target.value[i] : ""
            }
        }
        this.props.updateParam(event.target.id + this.props.id, value);
    }

    handleOptionChange(optionName, value) {
        // optionName example: "hit_modifier"
        this.props.updateOptionParam("options" + this.props.id, optionName, value);
    }

    countActiveOptions() {
        var count = 0;
        Object.entries(this.props.params["options"+this.props.id]).forEach(([key, value]) => {
            if (value != "") {
                count += 1;
            }
        });
        return count;
    }

    render() {
        if(this.props.visible) {
            var activeOptionsCount = this.countActiveOptions();
            return <tbody>
                      <tr className="datasheet-body">
                        <th><button className="logo-btn" onClick={(event) => {this.props.onDelete(this.props.id)}}><i className="fa fa-trash"></i></button> {this.props.rank} <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-weapon-name" value={this.props.params["name"+this.props.id]} onChange={this.handleChange} ></input></th>
                        <th><input maxLength="4" id="A" value={this.props.params["A"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="WSBS" value={this.props.params["WSBS"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.handleChange}></input>+</th>
                        <th><input maxLength="4" id="S" value={this.props.params["S"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>-<input maxLength="4" id="AP" value={this.props.params["AP"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th><input maxLength="4" id="D" value={this.props.params["D"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.handleChange}></input></th>
                        <th>
                            <button className="logo-btn" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="block"}}><i className="fa fa-cogs"></i></button>
                            <i className={activeOptionsCount == 0 ? "option-inactive": "option-active"}> ({activeOptionsCount} active)</i>
                        </th>
                      </tr>
                      <div id={"options-menu" + this.props.id} className="w3-modal">
                        <div className="w3-modal-content">
                          <header className="w3-container shop-bg datasheet-header">
                            Profile {this.props.id.substring(0, 1)} - weapon {this.props.rank} - {this.props.params["name"+this.props.id]} - {activeOptionsCount} {activeOptionsCount <= 1 ? "active option" : "active options"}
                          </header>
                          <div className="w3-container shop">
                              <h3>Attacks</h3>
                              <IsBlastOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["is_blast"]}/>
                              <h3>Hits</h3>
                              <HitModifierOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["hit_modifier"]}/>
                              <RerollHitsOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_hits"]}/>
                              <AutoHitOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["auto_hit"]}/>
                              <Dakka3OptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["dakka3"]}/>
                              <HitExplodesOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["hit_explodes"]}/>
                              <AutoWoundsOnOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["auto_wounds_on"]}/>
                              <h3>Wounds</h3>
                              <WoundModifierOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["wound_modifier"]}/>
                              <RerollWoundsOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_wounds"]}/>
                              <SnipeOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["snipe"]}/>
                              <WoundsBy2D6OptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["wounds_by_2D6"]}/>
                              <h3>Saves</h3>
                              <SaveModifierOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["save_modifier"]}/>
                              <h3>Damages</h3>
                              <RerollDamagesOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["reroll_damages"]}/>
                              <RollDamagesTwiceOptionInput handleOptionChange={this.handleOptionChange} value={this.props.params["options"+this.props.id]["roll_damages_twice"]}/>
                          </div>
                          <br/>
                          <footer>
                            <button className="w3-btn w3-margin-bottom shop-mid-bg datasheet-header" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="none"}}><i className="fa fa-save"></i> Save & Close</button>
                          </footer>
                        </div>
                      </div>
                   </tbody>;
        } else {
            return <tbody></tbody>
        }
    }
}


class Check extends React.Component {
    render() {
        return <i className="fa fa-check" style={this.props.value != "" ? {} : {visibility : "hidden"}}></i>
    }
}

class HitModifierOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Hit roll modifier: <select id="hit_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="-1">-1</option>
                   <option value=""></option>
                   <option value="1">+1</option>
                   </select>
               </div>
    }
}

class WoundModifierOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                  <Check value={this.props.value}/> Wound roll modifier: <select id="wound_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                  <option value="-1">-1</option>
                  <option value=""></option>
                  <option value="1">+1</option>
                  </select>
                </div>
    }
}

class SaveModifierOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                  <Check value={this.props.value}/> Save roll modifier: <select id="save_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                  <option value="-3">-3</option>
                  <option value="-2">-2</option>
                  <option value="-1">-1</option>
                  <option value=""></option>
                  <option value="1">+1</option>
                  <option value="2">+2</option>
                  <option value="3">+3</option>
                  </select>
                </div>
    }
}

class RerollHitsOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Hit roll reroll: <select id="reroll_hits" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">full</option>
                   </select>
               </div>
    }
}

class RerollWoundsOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Wound roll reroll: <select id="reroll_wounds" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">full</option>
                   </select>
               </div>
    }
}

class Dakka3OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> An unmodified hit roll of <select id="dakka3" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select> triggers one additional hit roll (<i>Dakka!<sup>3</sup></i>)
               </div>
    }
}

class AutoWoundsOnOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> An unmodified hit roll of <select id="auto_wounds_on" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select> always hits and automatically wounds
               </div>
    }
}

class IsBlastOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Is a blast weapon: <select id="is_blast" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class AutoHitOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Automatically hits: <select id="auto_hit" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class WoundsBy2D6OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Wounds if the result of 2D6 is greater or equal to target’s Toughness: <select id="wounds_by_2D6" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class RerollDamagesOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Damage roll reroll: <select id="reroll_damages" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class RollDamagesTwiceOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Roll random damages twice and discard the lowest result: <select id="roll_damages_twice" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                   <option value="">No</option>
                   <option value="yes">Yes</option>
                   </select>
               </div>
    }
}

class SnipeOptionInput extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        if (this.props.value == "") {
            this.state = {
                roll_type: "",
                threshold: "",
                n_mortals: ""
            }
        } else {
            var valueArray = this.props.value.split(",");
            this.state = {
                roll_type: valueArray[0],
                threshold: valueArray[1],
                n_mortals: valueArray[2]
            }
        }

    }
    collapseState() {
        if (this.state.roll_type == "" || this.state.threshold == "" || this.state.n_mortals == "") {
            // Each param has to be entered to activate option
            return "";
        } else {
            return this.state.roll_type + "," + this.state.threshold + "," + this.state.n_mortals;
        }
    }
    onChange(event) {
        this.state[event.target.id] = event.target.value;
        this.props.handleOptionChange("snipe", this.collapseState());
    }
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> Each <select id="roll_type" className="w3-select option-select" name="option" value={this.state.roll_type} onChange={this.onChange}><option value=""></option><option value="wound">wound</option><option value="strength">strength</option></select> roll
                    of <select id="threshold" value={this.state.threshold} className="w3-select option-select" name="option" onChange={this.onChange}>
                        <option value=""></option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                        <option value="6">6+</option>
                        <option value="7">7+</option>
                        <option value="8">8+</option>
                        <option value="9">9+</option>
                        <option value="10">10+</option>
                        <option value="11">11+</option>
                        <option value="12">12+</option>
                    </select>
                   , inflicts <select id="n_mortals" value={this.state.n_mortals} className="w3-select option-select" name="option" onChange={this.onChange}>
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="D3">D3</option>
                    </select> mortal wound(s)
                </div>
    }
}

class HitExplodesOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> An unmodified hit roll of <select id="hit_explodes" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.handleOptionChange(event.target.id, event.target.value)}}>
                    <option value=""></option>
                    <option value="6">6+</option>
                    <option value="5">5+</option>
                    </select> scores one additional hit.
               </div>
    }
}