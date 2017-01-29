import React from 'react';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isActiveTrackList = this.props.activeFooterElement && this.props.activeFooterElement === 'trackList' ? 'active' : '';

    return(
      <div className="footer">
        <a 
          href="https://soundcloud.com" 
          className="link" 
          target="_blank" 
          rel="noopener" 
          rel="noreferrer"
        >
          <i className="fa fa-soundcloud"></i>
          <span className="text">SOUNDCLOUD</span>
        </a>
        <div className="volume">
          <progress
            value={this.props.volume / 100}
            max="1"
            onClick={this.props.handleVolume}
          />
          <div className="volume-value">{`Volume ${this.props.volume} %`}</div>
        </div>

        <div  className={`track-list-toggler ${isActiveTrackList}`}
              onClick={this.props.toggleTrackList}
        >
          <i className="fa fa-list-ul"></i>
        </div>

        {/*<div  className="equalizer-toggler"
              onClick={this.props.toggleEqualizer}
        >
          <i className="fa fa-sliders"></i>
        </div>*/}

        <div className={`player_track-list ${isActiveTrackList}`}>
          {this.props.trackList.map((track, index) => {
            return  <span 
                      className={`track ${this.props.counterTrack === index ? 'active' : ''}`} 
                      key={index}
                      onClick={() => this.props.switchTrack(index)}
                    >
                      <span className="title">{track.title}</span>
                      <span className="info">{this.props.formatMilliseconds(track.duration)}</span>
                      <div 
                        className="delete-track"
                        onClick={(event) => this.props.deleteTrack(event, index)}
                      >
                        <i className="fa fa-times"></i>
                      </div>
                    </span>
          })}
        </div>

        {/* <div className={`player_equalizer ${this.props.activeFooterElement && this.props.activeFooterElement === 'equalizer' ? 'active' : ''}`}></div>*/}
      </div>
    );
  }
}

export default Footer
