class WeaponRow extends React.Component {
    constructor(props) {
        super(props);
        this.diceInputChars = "0123456789D";
        this.onParamChange = this.onParamChange.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
    }

    sanitizeDiceExpr(value) {
        var res = "";
        for (var char of value) {
            res += this.diceInputChars.includes(char) ? char : "";
        }
        return res;
    }

    onParamChange(event) {
        this.props.onParamChange(
            event.target.id + this.props.id,
            event.target.id == "name" ? event.target.value : this.sanitizeDiceExpr(event.target.value)
        );
    }

    onOptionChange(optionName, value) {
        // optionName example: "hit_modifier"
        this.props.onOptionChange("options" + this.props.id, optionName, value);
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
                        <th><button className="logo-btn" onClick={(event) => {this.props.onDelete(this.props.id)}}><i className="fa fa-trash"></i></button> {this.props.rank} <input maxLength="32" id="name" type="text" className="white-bg datasheet-body input input-weapon-name" value={this.props.params["name"+this.props.id]} onChange={this.onParamChange} ></input></th>
                        <th><input maxLength="4" id="A" value={this.props.params["A"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.onParamChange}></input></th>
                        <th><input maxLength="4" id="WSBS" value={this.props.params["WSBS"+this.props.id]} type="text" className="input input-dice align-right" onChange={this.onParamChange}></input>+</th>
                        <th><input maxLength="4" id="S" value={this.props.params["S"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.onParamChange}></input></th>
                        <th>-<input maxLength="4" id="AP" value={this.props.params["AP"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.onParamChange}></input></th>
                        <th><input maxLength="4" id="D" value={this.props.params["D"+this.props.id]} type="text" className="input input-dice align-left" onChange={this.onParamChange}></input></th>
                        <th>
                            <button className="logo-btn" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="block"}}><i className="fa fa-cogs"></i></button>
                            <i className={activeOptionsCount == 0 ? "option-inactive": "option-active"}> ({activeOptionsCount} {this.props.lang == "en" ? "active" : (activeOptionsCount > 1 ? "actives" : "active")})</i>
                        </th>
                      </tr>
                      <div id={"options-menu" + this.props.id} className="w3-modal">
                        <div className="w3-modal-content">
                          <header className="w3-container shop-bg datasheet-header">
                            {this.props.lang == "en" ? "Profile" : "Profil"} {this.props.id.substring(0, 1)} - {this.props.lang == "en" ? "weapon" : "arme"} {this.props.rank} - {this.props.params["name"+this.props.id]} - {activeOptionsCount} {activeOptionsCount <= 1 ? (this.props.lang == "en" ? "active option" : "option active") : (this.props.lang == "en" ? "active options" : "options actives")}
                          </header>
                          <div className="w3-container shop">
                              <h3>{this.props.lang == "en" ? "Attacks" : "Attaques"}</h3>
                              <IsBlastOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["is_blast"]}/>
                              <h3>{this.props.lang == "en" ? "Hits" : "Touches"}</h3>
                              <HitModifierOptionInput  lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["hit_modifier"]}/>
                              <RerollHitsOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["reroll_hits"]}/>
                              <AutoHitOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["auto_hit"]}/>
                              <Dakka3OptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["dakka3"]}/>
                              <HitExplodesOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["hit_explodes"]}/>
                              <AutoWoundsOnOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["auto_wounds_on"]}/>
                              <h3>{this.props.lang == "en" ? "Wounds" : "Blessures"}</h3>
                              <WoundModifierOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["wound_modifier"]}/>
                              <RerollWoundsOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["reroll_wounds"]}/>
                              <SnipeOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["snipe"]}/>
                              <WoundsBy2D6OptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["wounds_by_2D6"]}/>
                              <h3>{this.props.lang == "en" ? "Saves" : "Sauvegardes"}</h3>
                              <SaveModifierOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["save_modifier"]}/>
                              <h3>{this.props.lang == "en" ? "Damages" : "Dommages"}</h3>
                              <RerollDamagesOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["reroll_damages"]}/>
                              <RollDamagesTwiceOptionInput lang={this.props.lang} onOptionChange={this.onOptionChange} value={this.props.params["options"+this.props.id]["roll_damages_twice"]}/>
                          </div>
                          <br/>
                          <footer>
                            <button className="w3-btn w3-margin-bottom shop-mid-bg datasheet-header" onClick={(event) => {document.getElementById("options-menu" + this.props.id).style.display="none"}}><i className="fa fa-save"></i> {this.props.lang == "en" ? "Save & Close" : "Sauvegarder"}</button>
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
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Hit roll modifier" : "Modificateur des jets de touche"}: <select id="hit_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
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
                  <Check value={this.props.value}/> {this.props.lang == "en" ? "Wound roll modifier" : "Modificateur des jets de blessure"}: <select id="wound_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
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
                  <Check value={this.props.value}/> {this.props.lang == "en" ? "Save roll modifier" : "Modificateur des jets de sauvegarde"}: <select id="save_modifier" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
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
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Hit roll reroll" : "Relance des jets de touche"}: <select id="reroll_hits" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">{this.props.lang == "en" ? "full": "tous"}</option>
                   </select>
               </div>
    }
}

class RerollWoundsOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Wound roll reroll" : "Relance des jets de blessure"}: <select id="reroll_wounds" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="ones">1s</option>
                   <option value="onestwos">1s & 2s</option>
                   <option value="full">{this.props.lang == "en" ? "full": "tous"}</option>
                   </select>
               </div>
    }
}

class Dakka3OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "An unmodified hit roll of" : "Un jet de touche non modifié de"} <select id="dakka3" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select> {this.props.lang == "en" ? "triggers one additional hit roll" : "génère un jet de touche supplémentaire"} (<i>Dakka!<sup>3</sup></i>)
               </div>
    }
}

class AutoWoundsOnOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "An unmodified hit roll of" : "Un jet de touche non modifié de"} <select id="auto_wounds_on" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value=""></option>
                   <option value="6">6+</option>
                   <option value="5">5+</option>
                   </select> {this.props.lang == "en" ? "always hits and automatically wounds" : "touche toujours et blesse automatiquement."}
               </div>
    }
}

class IsBlastOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Is a blast weapon" : "Est une arme à déflagration"}: <select id="is_blast" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value="">{this.props.lang == "en" ? "No": "Non"}</option>
                   <option value="yes">{this.props.lang == "en" ? "Yes": "Oui"}</option>
                   </select>
               </div>
    }
}

class AutoHitOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Automatically hits" : "Touche automatiquement"}: <select id="auto_hit" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value="">{this.props.lang == "en" ? "No": "Non"}</option>
                   <option value="yes">{this.props.lang == "en" ? "Yes": "Oui"}</option>
                   </select>
               </div>
    }
}

class WoundsBy2D6OptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Wounds if the result of 2D6 is greater or equal to target’s Toughness" : "Blesse si le résultat de 2D6 est supérieur ou égal à l'Endurance de la cible"}: <select id="wounds_by_2D6" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value="">{this.props.lang == "en" ? "No": "Non"}</option>
                   <option value="yes">{this.props.lang == "en" ? "Yes": "Oui"}</option>
                   </select>
               </div>
    }
}

class RerollDamagesOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Damage roll reroll" : "Relance des jets de dommages"} : <select id="reroll_damages" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value="">{this.props.lang == "en" ? "No": "Non"}</option>
                   <option value="yes">{this.props.lang == "en" ? "Yes": "Oui"}</option>
                   </select>
               </div>
    }
}

class RollDamagesTwiceOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Roll random damages twice and discard the lowest result": "Jetez deux dés pour infliger les dégâts et défausser le résultat le plus bas"}: <select id="roll_damages_twice" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                   <option value="">{this.props.lang == "en" ? "No": "Non"}</option>
                   <option value="yes">{this.props.lang == "en" ? "Yes": "Oui"}</option>
                   </select>
               </div>
    }
}

class SnipeOptionInput extends React.Component {
    constructor(props) {
        super(props);
        this.onParamChange = this.onParamChange.bind(this);
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
    onParamChange(event) {
        this.state[event.target.id] = event.target.value;
        this.props.onOptionChange("snipe", this.collapseState());
    }
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "Each" : "Chaque jet de"} <select id="roll_type" className="w3-select option-select" name="option" value={this.state.roll_type} onChange={this.onParamChange}><option value=""></option><option value="wound">{this.props.lang == "en" ? "wound" : "blessure"}</option><option value="strength">{this.props.lang == "en" ? "Strength" : "Force"}</option></select> {this.props.lang == "en" ? "roll of" : "de"}
                    <select id="threshold" value={this.state.threshold} className="w3-select option-select" name="option" onChange={this.onParamChange}>
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
                   , {this.props.lang == "en" ? "inflicts" : "inflige"} <select id="n_mortals" value={this.state.n_mortals} className="w3-select option-select" name="option" onChange={this.onParamChange}>
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="D3">D3</option>
                    </select> {this.props.lang == "en" ? "mortal wound(s)" : "blessure(s) mortelle(s)"}
                </div>
    }
}

class HitExplodesOptionInput extends React.Component {
    render () {
        return <div className={"option-" + (this.props.value != "" ? "active" : "inactive")}>
                   <Check value={this.props.value}/> {this.props.lang == "en" ? "An unmodified hit roll of" : "Un jet de touche non modifié de"} <select id="hit_explodes" className="w3-select option-select" name="option" value={this.props.value} onChange={(event) => {this.props.onOptionChange(event.target.id, event.target.value)}}>
                    <option value=""></option>
                    <option value="6">6+</option>
                    <option value="5">5+</option>
                    </select> {this.props.lang == "en" ? "scores one additional hit" : "génère une touche supplémentaire"}.
               </div>
    }
}