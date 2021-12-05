import React, { Component } from "react";
import axios from "axios";
import "../styles/app.scss";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };

  constructor(props) {
    super(props);
    this.state = { jokes: [] };
  }

  async componentDidMount() {
    try {
      // Load Jokes
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        jokes.push(res.data.joke);
      }

      this.setState({ jokes: jokes });
    } catch (err) {
      console.error("Oops something went wrong! 😣😣");
    }
  }

  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="Dad Joke"
          />
          <button className="JokeList-getmore">New Jokes</button>
        </div>

        <div className="JokeList-jokes">
          {this.state.jokes.map(joke => (
            <div>{joke}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
