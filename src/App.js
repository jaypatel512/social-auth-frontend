import React from "react";
import "./App.css";
import GoogleLogin from "react-google-login";
import config from "./config";

class App extends React.Component {
  state = {
    isAuthenticated: false,
    user: null,
    token: ""
  };

  logout = () => {
    this.setState({
      isAuthenticated: false,
      user: null,
      token: ""
    });
  };

  googleResponse = response => {
    console.log(response);
    const { accessToken } = response;

    const tokenBlob = new Blob(
      [
        JSON.stringify(
          {
            access_token: accessToken
          },
          null,
          2
        )
      ],
      { type: "application/json" }
    );

    console.log(tokenBlob);

    const options = {
      crossDomain: true,
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };

    fetch("https://social-auth-tutorial.herokuapp.com/api/v1/auth/google", options).then(r => {
      const token = r.headers.get("x-auth-token");
      r.json().then(user => {
        if (token) {
          this.setState({
            isAuthenticated: true,
            user,
            token
          });
        }
      });
    });
  };

  onFailure = err => {
    alert(err);
  };

  render() {
    let content = !!this.state.isAuthenticated ? (
      <div>
        <div>Authenticated</div>
        <div>
          <p>{this.state.user.email}</p>
          <button onClick={this.logout}>Logout</button>
        </div>
      </div>
    ) : (
      <div>
        <GoogleLogin clientId={config.GOOGLE_CLIENT_ID} buttonText="Login With Google" onSuccess={this.googleResponse} onFailure={this.googleResponse} />
      </div>
    );

    return <div className="App">{content}</div>;
  }
}

export default App;

// Secret: 4h67stmhkV3FuH4c_7pRvshl
