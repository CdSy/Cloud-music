import React from 'react';
import ClassNames from 'classnames';

class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const playPauseClass = ClassNames({
      'fa fa-play': this.props.playStatus === 'PLAYING' ? false : true,
      'fa fa-pause': this.props.playStatus === 'PLAYING' ? true : false
    });

    return (
      <div className="player">
        <div className="player_backward" onClick={this.props.backward}>
          <i className="fa fa-backward"></i>
        </div>

        <div className="player_main">
          <i className={playPauseClass} onClick={this.props.togglePlay}></i>
          <i className="fa fa-stop" onClick={this.props.stop}></i>
          <i className={`fa fa-random ${this.props.random ? 'active' : ''}`} onClick={this.props.handleRandomTrack}></i>
        </div>

        <div className="player_forward" onClick={this.props.forward}>
          <i className="fa fa-forward"></i>
        </div>
      </div>
    );
  }
}

export default Player
