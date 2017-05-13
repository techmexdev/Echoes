import React from 'react';
import { Rating } from 'material-ui-rating';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import { lightBlue50 } from 'material-ui/styles/colors';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import $ from 'jquery';
import moment from 'moment';
import UpdateBox from './UpdateBox.jsx';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class Entry extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      months:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month:'',
      albumInfo : {status: 'UNREQUESTED'}, ///UNREQUESTED LOADING ERROR DATA
    }
  }

  componentWillMount () {
    this.setState ({
      month:this.props.date.slice(5,7)
    })
  }

  getAlbumInfoItunes(album) {
    this.setState({
      albumInfo: {status: 'LOADING', song: {songUrl: '', songId: ''} }
    });
    var searchAlbumUrl = 'https://itunes.apple.com/search?term=?$' +
                         this.props.title.split(' ').join('%20') +
                         '&entity=album&limit=10';

    var _this = this;
    $.ajax({
      url: searchAlbumUrl,
      data: {
        format: 'json'
      },
      type: 'GET',
      dataType: 'jsonp',
      success: (data) => {
        var collectionId = data.results
                        .filter(a=>a.collectionName === _this.props.title
                        && a.artistName === _this.props.artist)[0].collectionId;

        var albumSearchUrl = 'https://itunes.apple.com/lookup?id=' + collectionId + '&entity=song';

        $.ajax({
          url: albumSearchUrl,
          data: {
            format: 'json'
          },
          type: 'GET',
          dataType: 'jsonp',
          success: (album) => {
            _this.setState({
              albumInfo: {
                status: 'DATA',
                songs: album.results.filter((a) => a.kind === 'song')
              }
            });
          },
          error: (e) => {
            _this.setState({
              albumInfo: {status: 'ERROR'}
            });
          }
        })
      },
      error: (e) => {
        _this.setState({
          albumInfo: {status: 'ERROR'}
        })
      }
    })

  }

  // playSong(songId) {
  //   var searchSongUrl = 'http://itunes.apple.com/us/lookup?id=' + songId;
  //   this.setState({song: {songUrl: '', songId: ''}});
  //   $.ajax({
  //     url: searchSongUrl,
  //     data: {
  //       format: 'json'
  //     },
  //     type: 'GET',
  //     dataType: 'jsonp',
  //     success: (data) => {
  //       this.setState(
  //         {song: {songUrl: data.results[0].previewUrl, songId: data.results[0].trackId}
  //       })
  //     },
  //     error: (err) => {
  //       this.setState({
  //         songError: 'Error retrieving song',
  //       });
  //     }
  //   });
  // }

  render () {
    var statusAlbum = this.state.albumInfo.status;
    console.log('rendering ...', this.state);
    return (
      <div>
        {/* Pop-Up of Album info */}

        <Dialog
          title="Album Info"
          actions={[
            <FlatButton
              label="OK"
              primary={true}
              onClick={()=>this.setState({albumInfo: {status: 'UNREQUESTED'}})}
            />
          ]}
          modal={false}
          autoScrollBodyContent={true}
          open={statusAlbum !== 'UNREQUESTED'}
          onRequestClose={()=>this.setState({albumInfo: {status:'UNREQUESTED'} })}
        >
          {statusAlbum === 'LOADING' && <CircularProgress size={50} color={lightBlue50} />}
          {statusAlbum === 'ERROR' && ' A loading error has occurred. Sorry Dude/Dudette'}

          {statusAlbum === 'DATA' &&
            <div className='container-list tableDiv'>
              <Table height='auto' width='100%' fixedHeader style={{backgroundColor: 'blueGrey900'}}>
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow style={{width:'100px'}}>
                    <TableHeaderColumn colSpan="3" style={{ width: '200px'}} tooltip='Album Art'>
                      <h3><img className='albumArt' src={this.props.art_url100} onClick={(e)=>{e.preventDefault(); this.getAlbumInfoItunes(this.props.album);}} /></h3>
                    </TableHeaderColumn>
                    <TableHeaderColumn colSpan="3" style={{ width: '400px', whiteSpace: 'normal', verticalAlign:'middle' }} tooltip="Album Info">
                      <h4>{this.props.title}</h4>
                      <h5>{this.props.artist}</h5>
                      <p>{this.props.year}</p>
                      <p>{this.props.genre}</p>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow style={{ width: '100%', verticalAlign:'middle' }}>
                    <TableHeaderColumn colSpan="1" tooltip="ContentInbox" style={{ width: '200px', 'padding-left': '18px', verticalAlign: 'middle' }}><ContentInbox /></TableHeaderColumn>
                    <TableHeaderColumn colSpan="4" tooltip="Song Name" style={{ width: '800px', 'padding-left': '60px', verticalAlign: 'middle'  }}>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan="1" tooltip="Time" style={{ width: '200px', 'padding-left': '60px', verticalAlign: 'middle'  }}>Time</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                >
                  {this.state.albumInfo.songs.map((song, index) => (
                    <TableRow key={song.trackId}>
                      <TableRowColumn colSpan="1">{+index + 1}</TableRowColumn>
                      <TableRowColumn colSpan="4">
                        <a onClick={(e)=>{e.preventDefault(); this.props.playSong(song.trackId);}}
                          style={song.trackId === this.props.song.songId ? { textDecoration: 'none', color: '#555', pointerEvents: 'none' } :
                          {cursor: 'pointer'} }
                          >{song.trackName}</a>
                          {song.trackId === this.props.song.songId && <br />}
                          
                          {/*song.trackId === this.props.song.songId 
                            && <audio src={this.props.song.songUrl} autoPlay controls></audio>*/}
                      </TableRowColumn>
                      <TableRowColumn colSpan="1">
                        {song.trackTimeMillis && Math.floor(song.trackTimeMillis / 1000 / 60)}:{song.trackTimeMillis && (Math.floor(song.trackTimeMillis / 1000 % 60) >= 10? '' : '0') + Math.floor(song.trackTimeMillis / 1000 % 60)}
                      </TableRowColumn>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </div>
          }
          {/*<audio src={this.props.song.songUrl} autoPlay></audio>*/}
        </Dialog>
        


        <TableRow
          key={this.props.index}
          style={{ height: '122px', width: '75%', textAlign: 'left' }}
          hoverable={true}
        >
          <TableRowColumn colSpan="2" style={{ width: '150px' }}>
            <span className='month'><h4>{moment.months(this.state.month - 1)}</h4> </span>
            <span className='day'><h4>{this.props.date.slice(8, 10)}</h4></span>
            <span className='year'>{this.props.date.slice(0,4)}</span>
          </TableRowColumn>
          <TableRowColumn colSpan="2" style={{ width: '200px'}}>
            <h3><img className='albumArt' src={this.props.art_url100} 
                onClick={(e)=>{
                  e.preventDefault(); 
                  this.getAlbumInfoItunes(this.props.album);
                }} /></h3>
          </TableRowColumn>
          <TableRowColumn colSpan="2" style={{ width: '400px', whiteSpace: 'normal' }}>
              <h4>{this.props.title}</h4>
              <h5>{this.props.artist}</h5>
              <p>{this.props.year}</p>
              <p>{this.props.genre}</p>
          </TableRowColumn>
          <TableRowColumn colSpan="4" style={{ width: '500px', 'whiteSpace': 'normal' }}>
            <div className="impression">{this.props.impression}</div>
          </TableRowColumn>
          <TableRowColumn colSpan="3">
            <Rating
              value={this.props.rating}
              max={5}
              readOnly
            />
          </TableRowColumn>
          <TableRowColumn colSpan="3" style={{ textAlign: 'center' }}>
            <UpdateBox impressionId={this.props.impressionId}
                       date={this.props.date}
                       impression={this.props.impression}
                       rating={this.props.rating}
                       updateUserEntries={this.props.updateUserEntries}
                       getUserEntries={this.props.getUserEntries}
                       deleteUserEntries={this.props.deleteUserEntries}/>
          </TableRowColumn>
        </TableRow>
        
      </div>
    );
  };
};

export default Entry;
