import React from 'react';

class Progress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="progress">
        <span className="player_time-elapsed">{this.props.elapsed}</span>
        <progress
          value={this.props.position}
          max="1"
          >
          {/* <div className="blind" style={{width: `${this.props.widthBlind}%`}}></div> */}
        </progress>
        <div 
          className="wave" 
          style={{backgroundImage: `url(${this.props.wave})`}}
          onClick={this.props.handleScrolling}
        />
        <span className="player_time-total">{this.props.total}</span>
      </div>
    );
  }
}

export default Progress
