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
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  async getJokes() {
    try {
      // Load Jokes
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
      }

      this.setState(
        state => ({
          loading: false,
          jokes: [...state.jokes, ...jokes],
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
      window.localStorage.setItem("jokes", JSON.stringify(jokes));
    } catch (err) {
      console.error("Oops something went wrong! 😣😣", err.message);
    }
  }

  handleVote(id, delta) {
    this.setState(
      state => ({
        jokes: state.jokes.map(joke =>
          joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }
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
          <button onClick={this.handleClick} className="JokeList-getmore">
            New Jokes
          </button>
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
