class AbstractCloudFunctionClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'idle', // state among "idle", "processing", "error"...;
      msg: '',
      id: undefined,
      token: undefined,
      cache: {},
      processingMsg: 'Processing...',
    };
  }


  getServerIp() {
    console.log("getServerIp(), id='" + this.state.id + "', token='" + this.state.token + "'")
    const decrypted = CryptoJS.AES.decrypt(this.state.token, this.state.id);
    try {
      var res = decrypted.toString(CryptoJS.enc.Utf8);
      console.log("decrypted:" + res);
    } catch (err) {/* malformed URL */
      return '';
    }
    if (!res.includes('http')) {
      return '';
    } else {
      return res;
    }
  }

  getErrorLog(xhr) {
    if (xhr.status == 422 /* bad input*/ || xhr.status == 500) {
      return 'Error ' + xhr.status + ': ' + xhr.response['msg'];
    } else if (xhr.status == 429) {
      return 'Error 429: There is no Magos available now. ' +
        (xhr.response == null ? "" : xhr.response['msg']);
    } else if (xhr.status == 408) {
      return 'Error 408: Timeout: ' +
        'The Magos in charge of your request has passed out';
    } else {
      this.setState({
        state: 'error',
        msg: 'Error ' + xhr.status,
      });
    }
  }

  buildAndRunXHR(queryString, on200) {
    if (this.state.state != 'processing') {
      this.setState(
          {
            state: 'processing',
            msg: this.state.processingMsg,
          },
          () => {
            if (queryString in this.state.cache) {
              on200(this.state.cache[queryString]);
            } else {
              const serverIp = this.getServerIp();
              if (serverIp == '') {
                this.setState({
                  state: 'error',
                  msg: 'Invalid id-token pair: id=\'' +
                    this.state.id + '\', token=\'' +
                    this.state.token + '\'',
                });
              } else {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'json';
                xhr.onload = () => {
                  if (xhr.status == 200) {
                    this.state.cache[queryString] = xhr.response;
                    on200(xhr.response);
                  } else {
                    this.setState({
                      state: 'error',
                      msg: this.getErrorLog(xhr),
                    });
                  }
                };
                // get a callback when net::ERR_CONNECTION_REFUSED
                xhr.onerror = () => {
                  this.setState({
                    state: 'error',
                    msg: 'SERVER DOWN: The Forge World of the ' +
                      'Adeptus Optimus must be facing an onslaught of heretics.',
                  });
                };
                // get a callback when the server responds
                xhr.open('GET', serverIp + '?' + queryString);
                // force preflight
                xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
                // send the request
                xhr.send();
              }
            }
          },
      );
    }
  }
}
