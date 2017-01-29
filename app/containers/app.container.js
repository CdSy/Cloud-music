import React from 'react';
import Sound from 'react-sound';
import Axios from 'axios';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Search from '../components/search.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {

  constructor(props) {
     super(props);

     this.client_id = '2f98992c40b8edf17423d93bda2e04ab';
     
     this.state = {
       searchValue: '',
       tracks: [],
       currentTrack: {stream_url: '', title: '', artwork_url: ''},
       counterTrack: 0,
       playStatus: Sound.status.STOPPED,
       elapsed: '00:00',
       total: '00:00',
       position: 0,
       playFromPosition: 0,
       volume: 100,
       widthBlind: 0,
       activeFooterElement: 'trackList',
       placeholder: 'Search',
       random: false
     };
  }

  xlArtwork(url){
    if (url === null) {
      return 'https://i.yapx.ru/GJ6W.png';
    }
    return url.replace(/large/, 't500x500');
  }

  prepareUrl(url) {
    return `${url}?client_id=${this.client_id}`
  }

  formatMilliseconds(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    const minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    const seconds = Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;

    return `${minutes < 10 ? '0' : ''}${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
  }

  handleChange(event) {
    this.setState({searchValue: event.target.value});

    if (this.state.searchValue.length > 2) {
      this.setState({preloader: true});
      this.getTrackList(event.target.value);
    }
  }

  getTrackList (value) {
    Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}&limit=40`)
        .then((response) => {
            console.log(response.data);
            this.setState({tracks: response.data});
            this.setState({currentTrack: response.data[0]});
            this.setState({counterTrack: 0});
            this.setState({preloader: false});
            this.setState({placeholder: 'Search'});
        })
        .catch((err) => {
            console.log(err);
            this.setState({placeholder: 'Oops something went wrong'});
            this.setState({preloader: false});
        });
  }

  toggleTrackList() {
    if (this.state.activeFooterElement) {
      this.setState({activeFooterElement: ''});
    } else {
      this.setState({activeFooterElement: 'trackList'});
    }
  }

  toggleEqualizer() {
    if (this.state.activeFooterElement) {
      this.setState({activeFooterElement: ''});
    } else {
      this.setState({activeFooterElement: 'equalizer'});
    }
  }

  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }

  handleSongFinished () {
    if (!this.state.random) {
      if (this.state.counterTrack === this.state.tracks.length - 1) {
        this.setState({counterTrack: 0});
        this.setState({currentTrack: this.state.tracks[0]});
      } else {
        this.setState({counterTrack: this.state.counterTrack + 1});
        this.setState({currentTrack: this.state.tracks[this.state.counterTrack + 1]});
      }
    } else {
      const randomNumber = Math.floor(Math.random() * (this.state.tracks.length - 0) + 0);

      this.setState({counterTrack: randomNumber});
      this.setState({currentTrack: this.state.tracks[randomNumber]});
    }
  }

  togglePlay(){
    if (this.state.tracks.length === 0) {
      return;
    }
    
    if(this.state.playStatus === Sound.status.PLAYING){
      this.setState({playStatus: Sound.status.PAUSED})
    } else {
      this.setState({playStatus: Sound.status.PLAYING})
    }
  }

  stop(){
    if (this.state.tracks.length === 0) {
      return;
    }

    this.setState({playStatus: Sound.status.STOPPED});
  }

  backward() {
    if (this.state.tracks.length === 0) {
      return;
    }

    if (!this.state.random) {
      if (this.state.counterTrack === 0) {
        this.setState({counterTrack: this.state.tracks.length - 1});
        this.setState({currentTrack: this.state.tracks[this.state.tracks.length - 1]});
      } else {
        this.setState({counterTrack: this.state.counterTrack - 1});
        this.setState({currentTrack: this.state.tracks[this.state.counterTrack - 1]});
      }
    } else {
      const randomNumber = Math.floor(Math.random() * (this.state.tracks.length - 0) + 0);

      this.setState({counterTrack: randomNumber});
      this.setState({currentTrack: this.tracks[randomNumber]});
    }
  }

  forward(){
    if (this.state.tracks.length === 0) {
      return;
    }

    this.handleSongFinished();
  }

  handleRandomTrack() {
    if (this.state.random) {
      this.setState({random: false});
    } else {
      this.setState({random: true});
    }
  }

  handleScrolling(event) {
    if (this.state.tracks.length === 0) {
      return;
    }

    event.persist();

    const cursorPosition = event.pageX - event.target.getBoundingClientRect().left;
    const position = Math.floor((cursorPosition / event.target.offsetWidth) * 100);
    const fromPosition = (this.state.currentTrack.duration * position) / 100;

    this.setState({position: position / 100});
    this.setState({playFromPosition: fromPosition});
  }

  handleMouseMove(event) {
    if (this.state.tracks.length === 0) {
      return;
    }

    event.persist();

    const cursorPosition = event.pageX - event.target.getBoundingClientRect().left;
    const widthBlind = Math.floor((cursorPosition / event.target.offsetWidth) * 100);

    this.setState({widthBlind: widthBlind});
  }

  switchTrack(index) {
    this.setState({playStatus: Sound.status.STOPPED});
    this.setState({counterTrack: index});
    this.setState({currentTrack: this.state.tracks[index]});
    this.setState({playStatus: Sound.status.PLAYING});
  }

  handleVolume(event) {
    const cursorPosition = event.pageX - event.target.getBoundingClientRect().left;
    const position = Math.ceil((cursorPosition / event.target.offsetWidth) * 100);

    this.setState({volume: position});
  }

  handleBlur() {
    this.setState({searchValue: ''});
  }

  deleteTrack(event, index) {
    event.preventDefault;
    event.stopPropagation;

    const state = this.state.tracks.slice(0);

    state.splice(index, 1);

    const updatedTracks = state;

    if (index < this.state.counterTrack) {
      this.setState({tracks: updatedTracks});
      this.setState({counterTrack: this.state.counterTrack - 1});
    }
    
    if (index > this.state.counterTrack) {
      this.setState({tracks: updatedTracks});
    }

    if (this.state.counterTrack === index) {
      this.setState({tracks: updatedTracks});

      if (!this.state.random) {
        if (this.state.counterTrack === this.state.tracks.length - 1) {
          this.setState({counterTrack: 0});
          this.setState({currentTrack: this.state.tracks[0]});
        } else {
          this.setState({counterTrack: this.state.counterTrack});
          this.setState({currentTrack: this.state.tracks[this.state.counterTrack]});
        }
      } else {
        const randomNumber = Math.floor(Math.random() * (this.state.tracks.length - 1) + 0);

        this.setState({counterTrack: randomNumber});
        this.setState({currentTrack: this.state.tracks[randomNumber]});
      }
    }
  }

  render() {
    const wrapperStyle = {
      width: '450px',
      height: '450px',
      boxSizing: 'border-box',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.7)), 
      url(${this.state.tracks.length && this.state.currentTrack &&this.state.currentTrack.artwork_url ? this.xlArtwork(this.state.currentTrack.artwork_url) : 'https://i.yapx.ru/GJ6W.png'})`
    }

    return (
      <div className="player-wrapper" style={wrapperStyle}>
        <Search
          placeholder={this.state.placeholder}
          preloader={this.state.preloader}
          handleChange={this.handleChange.bind(this)}
          searchValue={this.state.searchValue}
          handleBlur={this.handleBlur.bind(this)}
        />
        <Details 
          title={this.state.currentTrack && this.state.currentTrack.title ? this.state.currentTrack.title : ''}
        />
        <Sound 
          url={this.prepareUrl(this.state.currentTrack ? this.state.currentTrack.stream_url : '')}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)}
          volume={this.state.volume}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          handleRandomTrack={this.handleRandomTrack.bind(this)}
          random={this.state.random}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
          handleScrolling={this.handleScrolling.bind(this)}
          handleMouseMove={this.handleMouseMove.bind(this)}
          widthBlind={this.state.widthBlind}
          wave={this.state.currentTrack ? this.state.currentTrack.waveform_url : ''}
        />
        <Footer
          toggleTrackList={this.toggleTrackList.bind(this)}
          toggleEqualizer={this.toggleEqualizer.bind(this)}
          trackList={this.state.tracks}
          counterTrack={this.state.counterTrack}
          activeFooterElement={this.state.activeFooterElement}
          formatMilliseconds={this.formatMilliseconds}
          switchTrack={this.switchTrack.bind(this)}
          handleVolume={this.handleVolume.bind(this)}
          volume={this.state.volume}
          deleteTrack={this.deleteTrack.bind(this)}
        />
      </div>
    );
  }
}

export default AppContainer
