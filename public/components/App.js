class App extends AbstractCloudFunctionClient {
  constructor(props) {
    super(props);
    const queryString = new URLSearchParams(window.location.search);
    const initLang = 'en';
    this.state = {
      ...this.state,
      lang: initLang,
      processingMsg: this.getProcessingMsg(initLang),
      // init to query string provided state or default one
      params: {
        A: queryString.has('share_settings') ?
          JSON.parse(queryString.get('share_settings'))['A'] :
          {
            'nameA': 'Anonymous',
            'pointsA': '10',
            'nameA0': 'Anonymous',
            'AA0': '1',
            'WSBSA0': '4',
            'SA0': '4',
            'APA0': '0',
            'DA0': '1',
            'optionsA0': {},
          },
        B: queryString.has('share_settings') ?
          JSON.parse(queryString.get('share_settings'))['B'] :
          {
            'nameB': 'Anonymous',
            'pointsB': '10',
            'nameB0': 'Anonymous',
            'AB0': '1',
            'WSBSB0': '4',
            'SB0': '4',
            'APB0': '0',
            'DB0': '1',
            'optionsB0': {},
          },
      },
      id: queryString.has('id') ? queryString.get('id') : 'standard_user',
      token: queryString.has('token') ?
        queryString.get('token') :
        'U2FsdGVkX18wtnoUOJJmr+GIeN2B08X1eu5+oV0/Cx1TZYBFhO/9L7mM1MBwtSMS19uZ' +
        '6yXRKb/D8eu8oeOwBYVi4Irfvrlip0EKZ0y/gse8KnFz1Rq7HIsdeYXEXiZ9',
    };

    this.nWeapons = 8;
    this.defaultOptions = {
      'hit_modifier': '',
      'wound_modifier': '',
      'save_modifier': '',
      'reroll_hits': '',
      'reroll_wounds': '',
      'dakka3': '',
      'auto_wounds_on': '',
      'is_blast': '',
      'auto_hit': '',
      'wounds_by_2D6': '',
      'reroll_damages': '',
      'roll_damages_twice': '',
      'snipe': '',
      'hit_explodes': '',
    };

    // fill empty options
    for (const letter of 'AB') {
      for (let i = 0; i < this.nWeapons; i++) {
        const id = letter + i;
        // ony existing weapon lines
        if (('A' + id) in this.state.params[letter]) {
          this.state.params[letter]['options' + id] = {
            ...this.defaultOptions,
            ...this.state.params[letter]['options' + id],
          };
        }
      }
    }
    this.runComparison = this.runComparison.bind(this);
    this.notifyLangSelection = this.notifyLangSelection.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onParamChange = this.onParamChange.bind(this);
    this.onParamsChange = this.onParamsChange.bind(this);
    this.deleteParam = this.deleteParam.bind(this);
  }

  getProcessingMsg(selectedLang) {
    return (selectedLang == 'en' ?
      'Firing on some captive Grots...' :
      'Canardage de quelques Gretchins'
    );
  }

  runComparison(event) {
    event.preventDefault();
    // ensure not to run if already running thanks to 'compare' button hiding
    document.getElementById('chart').innerHTML = '';

    this.buildAndRunXHR(
        'params=' +
        encodeURIComponent(this.stringifyRelevantParams(this.state.params)),
        (response) => {
          plotHeatMap(
              response['x'],
              response['y'],
              response['z'],
              response['ratios'],
              response['scores'],
              this.state.lang);
          this.setState({state: 'idle', msg: ''});
        },
    );
  }

  notifyLangSelection(selectedLang) {
    this.setState({
      lang: selectedLang,
      processingMsg: this.getProcessingMsg(selectedLang),
    });
  }

  render() {
    //    console.log('App render() called');
    //    console.log(this.state);
    //    console.log(this.state.params);
    return <div>
      <div className="shop-bg">
        <div className="v9">
          {this.state.lang == 'en' ?
            'Up to date with v9':
            'À jour avec la v9'
          }
        </div>
      </div>
      <LangSelector notify={this.notifyLangSelection} />
      <h1>
        <a href="index.html" className="title">
          Adeptus <img src="components/logo.png" width="100px"/> Optimus
        </a>
      </h1>
      <p className="title subscript">"
        {this.state.lang == 'en' ?
          ' Support your choices, on behalf of the Emperor.':
          ' Soutenir vos choix, au nom de l\'Empereur.'
        }"
      </p>
      <br/>
      <br/>
      <br/>
      <Share
        lang={this.state.lang}
        queryString={
          'share_settings=' +
          encodeURIComponent(
              JSON.stringify(this.withoutEmptyOptions(this.state.params)),
          )
        }
        id={this.state.id}
        token={this.state.token}
      />
      <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
        <ProfileTable
          nWeapons={this.nWeapons}
          lang={this.state.lang}
          deleteParam={this.deleteParam}
          onParamChange={this.onParamChange}
          onParamsChange={this.onParamsChange}
          params={this.state.params['A']}
          letter="A"
          defaultOptions={this.defaultOptions}
        />
      </div>
      <br/>
      <br/>
      <br/>
      <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
        <ProfileTable
          nWeapons={this.nWeapons}
          lang={this.state.lang}
          deleteParam={this.deleteParam}
          onParamChange={this.onParamChange}
          onParamsChange={this.onParamsChange}
          params={this.state.params['B']}
          letter="B"
          defaultOptions={this.defaultOptions}
        />
      </div>
      <br/>
      <br/>
      <br/>
      <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
      {this.state.state == 'processing' ?
          '' :
          <button
            className="w3-btn shop-mid-bg datasheet-header"
            onClick={this.runComparison}>
            <i className="fa fa-play-circle w3-xlarge"></i>
                &nbsp;{this.state.lang == 'en' ? 'Compare' : 'Comparer'}
          </button>
      }
      <br/>
      <br/>
      <ProgressLog state={this.state.state} msg={this.state.msg}/>
      <div style={{
        'overflowX': 'auto',
        'overflowY': 'hidden',
        'transform': 'rotateX(180deg)'}}>
        <div
          id="chart"
          className="chart"
          style={{'transform': 'rotateX(180deg)'}}>
        </div>
      </div>
      <div className="w3-bar shop-bg"><div className="w3-bar-item"></div></div>
      <About />
      <br/>
      <br/>
      <div className="w3-bar shop-mid-bg">
        <div className="w3-bar-item"></div>
      </div>
      <a
        className="tipeee"
        href="https://en.tipeee.com/adeptus-optimus">
        <img src="components/tipeee.svg" width="300px"></img>
      </a>
      <Login
        id={this.state.id}
        token={this.state.token}
        onChange={this.onChange}
      />
    </div>;
  }

  onParamChange(k, v, letter) {
    this.state.params[letter][k] = v;
    this.setState({});
  }

  onParamsChange(params, letter) {
    this.state.params[letter] = {...this.state.params[letter], ...params};
    this.setState({});
  }

  onChange(mapping) {
    this.setState(mapping);
  }

  deleteParam(key, letter) {
    delete this.state.params[letter][key];
    this.setState({});
  }

  getRelevantParamsKeys() {
    const tableRelevantState = {
      ...this.state.params.A,
      ...this.state.params.B,
    };
    Object.entries(tableRelevantState).forEach(([key, value]) => {
      if (key.includes('name')) {
        delete tableRelevantState[key];
      } else if (key.includes('option')) {
        tableRelevantState[key] = this.withoutEntryHavingEmptyValues(value);
      }
    });
    return tableRelevantState;
  }

  stringifyRelevantParams(params) {
    return JSON.stringify(this.getRelevantParamsKeys(params));
  }

  withoutEntryHavingEmptyValues(obj) {
    const res = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value != '') {
        res[key] = value;
      }
    });
    return res;
  }

  withoutEmptyOptions(params) {
    let res = {};
    for (const letter of 'AB') {
      var paramsCopy = {...this.state.params[letter]};
      Object.entries(paramsCopy).forEach(([key, value]) => {
        if (key.includes('option')) {
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
    document.getElementById('app'),
);
