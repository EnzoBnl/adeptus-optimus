class App extends AbstractCloudFunctionClient {
    constructor(props) {
        super(props);
        this.syncAppParams = this.syncAppParams.bind(this);
        this.sendCredentialsToApp = this.sendCredentialsToApp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // dev query string:  id=admin&token=U2FsdGVkX197wfW/IY0sqa/Ckju8AeU3pRLPSra1aCxZeAHrWePPDPJlYTy5bwdU
        var queryString = new URLSearchParams(window.location.search);

        if (queryString.has("id")) {
            this.state.id = queryString.get("id");
        } else {
            this.state.id = "standard_user";
        }
        if (queryString.has("token")) {
            this.state.token = queryString.get("token");
        } else {
            this.state.token = "U2FsdGVkX18wtnoUOJJmr+GIeN2B08X1eu5+oV0/Cx1TZYBFhO/9L7mM1MBwtSMS19uZ6yXRKb/D8eu8oeOwBYVi4Irfvrlip0EKZ0y/gse8KnFz1Rq7HIsdeYXEXiZ9";
        }

        this.state.processingMsg = "Firing on some captive Grots...";
        var defaultProfileAState = {"nameA":"Anonymous Profile","pointsA":"10","nameA0":"Anonymous Weapon","AA0":"1","WSBSA0":"4","SA0":"4","APA0":"0","DA0":"1","optionsA0":{}};
        var defaultProfileBState = {"nameB":"Anonymous Profile","pointsB":"10","nameB0":"Anonymous Weapon","AB0":"1","WSBSB0":"4","SB0":"4","APB0":"0","DB0":"1","optionsB0":{}};
        this.params = {
            A: queryString.has("share_settings") ? JSON.parse(queryString.get("share_settings"))["A"] : defaultProfileAState,
            B: queryString.has("share_settings") ? JSON.parse(queryString.get("share_settings"))["B"] : defaultProfileBState
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        // ensure not to run if already running thanks to 'compare' button hiding
        document.getElementById("chart").innerHTML = "";

        this.buildAndRunXHR(
            "params=" + encodeURIComponent(this.stringifyRelevantParams(this.params)),
            (response) => {
                plotHeatMap(
                    response["x"],
                    response["y"],
                    response["z"],
                    response["ratios"],
                    response["scores"]);
                this.setState({state: "idle", msg: ""});
            }
        );

    }

    render() {
        console.log("App render() called")
        console.log(this.state);
        console.log(this.params);
        return <div>
            <div className="shop-bg"><div className="v9">Ready for 40K v9</div></div>
            <h1><a href="index.html" className="title">Adeptus <img src="components/logo.png" width="100px"/> Optimus</a></h1>
            <p className="title subscript">" Support wiser choices, on behalf of the Emperor."</p>
            <div className="tipeee"><a href="https://en.tipeee.com/adeptus-optimus"><img src="components/tipeee.svg" width="250px"></img></a></div>
            <br/>
            <br/>
            <br/>
            <Share queryString={"share_settings=" + encodeURIComponent(JSON.stringify(this.withoutEmptyOptions(this.params)))} id={this.state.id} token={this.state.token}/>
            <div style={{overflowX: "auto"}}>
                <ProfileTable syncAppParams={this.syncAppParams} params={this.params} letter="A"/>
            </div>
            <br/>
            <br/>
            <br/>
            <div style={{overflowX: "auto"}}>
                <ProfileTable syncAppParams={this.syncAppParams} params={this.params} letter="B"/>
            </div>
            <br/>
            <br/>
            <br/>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            {this.state.state == "processing" ? "" : <button className="w3-btn shop-mid-bg datasheet-header" onClick={this.handleSubmit}><i className="fa fa-play-circle w3-xlarge"></i> Compare</button>}
            <br/>
            <br/>
            <ProgressLog state={this.state.state} msg={this.state.msg}/>
            <div style={{overflowX: "auto", overflowY: "hidden",  "transform": "rotateX(180deg)"}}>
                <div id="chart" className="chart" style={{"transform": "rotateX(180deg)"}}></div>
            </div>
            <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
            <About />
            <br/>
            <br/>
            <div className="w3-bar shop-mid-bg"><div className="w3-bar-item"></div></div>
            <Login initState={{id: this.state.id, token: this.state.token}} sendCredentialsToApp={this.sendCredentialsToApp}/>
        </div>
    }

    syncAppParams(params, letter) {
        this.params[letter] = params;
        this.setState({});
    }

    sendCredentialsToApp(creds) {
        this.setState(creds);
    }

    getRelevantParamsKeys() {
        var tableRelevantState = {
            ...this.params.A,
            ...this.params.B
        };
        Object.entries(tableRelevantState).forEach(([key, value]) => {
            if (key.includes("name")) {
                delete tableRelevantState[key];
            } else if (key.includes("option")) {
                tableRelevantState[key] = this.withoutEntryHavingEmptyValues(value);
            }
        });
        return tableRelevantState;
    }

    stringifyRelevantParams(Params) {
        return JSON.stringify(this.getRelevantParamsKeys(Params));
    }

    withoutEntryHavingEmptyValues(dict) {
        var res = {};
        Object.entries(dict).forEach(([key, value]) => {
            if (value != "") {
                res[key] = value;
            }
        });
        return res;
    }

    withoutEmptyOptions(params) {
        var res = {};
        for(var letter of "AB"){
           var paramsCopy = {...this.params[letter]};
           Object.entries(paramsCopy).forEach(([key, value]) => {
               if (key.includes("option")) {
                   paramsCopy[key] = this.withoutEntryHavingEmptyValues(value);
               }
           });
           res = {...res, ...{[letter]: paramsCopy}};
        }

        return res;
    }
}


ReactDOM.render(
  <App />,
  document.getElementById("app")
);