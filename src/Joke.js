import React from 'react';
import './Joke.css';

class Joke extends React.Component {
  constructor(props){
    super(props);
    
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
  }
  
  upVote(e) {
    this.props.handleVote(e.target.dataset.id, 1);
  }
  
  downVote(e) {
    this.props.handleVote(e.target.dataset.id, -1);
  }
  
  getColor() {
    if(this.props.rating >= 10) {
      return "#4CAF50";
    } else if(this.props.rating >= 8) {
      return "#8BC34A";
    } else if(this.props.rating >= 6) {
      return "#CDDC39";
    } else if(this.props.rating === 5) {
      return "#FFEB3B";
    } else if(this.props.rating >= 4) {
      return "#FFC107";
    } else if(this.props.rating >= 2) {
      return "#FF9800";
    } else if(this.props.rating >= 0) {
      return "#F44336";
    }
  }
  
  render(){
    return (
      <div className="joke">
        <div className="joke-rating">
          <i className="fas fa-arrow-up" data-id={this.props.id} onClick={this.upVote}></i>
          <div className="joke-score" style={{borderColor: this.getColor()}}>
            <p>{this.props.rating}</p>
          </div>
          <i className="fas fa-arrow-down" data-id={this.props.id} onClick={this.downVote}></i>
        </div>
        <div className="joke-text">
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default Joke;