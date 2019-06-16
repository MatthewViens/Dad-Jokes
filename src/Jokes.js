import React from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';
import Joke from './Joke';
import './Jokes.css';

class Jokes extends React.Component {
  static defaultProps = {
    numJokes: 10
  }
  
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]" ),
      loading: false
    }
    
    this.seenJokes = new Set(this.state.jokes.map(joke => joke.text));
    
    this.handleVote = this.handleVote.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    if(this.state.jokes.length === 0) this.getJokes();
  }
  
  async getJokes() {
    try {
      let jokes = [];
      while(jokes.length < this.props.numJokes) {
        let jokeRes = await axios.get('https://icanhazdadjoke.com/', 
          { headers: {Accept: 'application/json'}});
        let newJoke = jokeRes.data.joke;
        if(!this.seenJokes.has(newJoke)) {
          jokes.push({id: uuid(), text: newJoke, rating: 5});
        }
      }
      this.setState((prev => ({
        jokes: [...prev.jokes, ... jokes],
        loading: false
      })), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
    } catch(e) {
      alert(e)
      this.setState({loading: false})
    }
  }
  
  handleClick() {
    this.setState({loading: true}, this.getJokes);
  }
  
  handleVote(id, delta) {
    const votedJoke = this.state.jokes.find(joke => joke.id === id);
    if(votedJoke.rating < 10 && delta === 1) {
      votedJoke.rating += 1;
    } else if(votedJoke.rating > 0 && delta === -1) {
      votedJoke.rating -= 1;
    }
      this.setState((prev => ({
        jokes: prev.jokes.map(joke => (
          joke.id === id ? joke = votedJoke : joke
        ))
      })), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)))
  }
  
  render() {
    if(this.state.loading) {
      return (
        <div className="spinner">
          <i className="far fa-8x fa-laugh fa-spin"></i>
          <h1>Loading...</h1>
        </div>
      )
    }
    
    // Sort jokes by rating
    // let jokes = this.state.jokes.sort((a, b) => b.rating - a.rating);
    
    let jokes = this.state.jokes;
    
    return (
      <div className="jokes-wrapper">
        <div className="jokes-new">
        <a href="https://github.com/MatthewViens/Dad-Jokes" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i>
        </a>
        <h1>Dad Jokes</h1>
        <div className="brand">
          <p>😄</p>
        </div>
        <button onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className="jokes-container">
          {jokes.map(joke => (
            <Joke 
              key={joke.id} 
              id={joke.id}
              text={joke.text} 
              rating={joke.rating}
              handleVote={this.handleVote}
            />))}
        </div>
      </div>
    )
  }
}

export default Jokes;