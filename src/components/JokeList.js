import React, { Component } from "react";
import axios from "axios";
import "../styles/app.scss";
import { v4 as uuid } from "uuid";
import Joke from "./Joke";

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
        jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
      }

      this.setState({ jokes: jokes });
    } catch (err) {
      console.error("Oops something went wrong! 😣😣");
    }
  }

  handleVote(id, delta) {
    this.setState(state => ({
      jokes: state.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      ),
    }));
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
            <Joke
              key={joke.id}
              votes={joke.votes}
              text={joke.text}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;