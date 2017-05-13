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
import './Entry.css';

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
      confirmDeletionModalActive: false,
    };
    this.closeModals = this.closeModals.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClickToDelete = this.handleClickToDelete.bind(this);
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

  closeModals() {
    this.setState({
      modalActive: false,
      confirmDeletionModalActive: false
    });
  }

  handleDelete(e) {
    e.preventDefault();
    this.closeModals();
    this.props.deleteUserEntries(this.props.impressionId, this.props.date, this.props.getUserEntries);

  }

  handleClickToDelete(e) {
    e.preventDefault();
    this.setState({
      confirmDeletionModalActive: true,
    });
  }

  render () {
    var statusAlbum = this.state.albumInfo.status;
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
            <div className='container-list'>
              <Table height='auto' width='100%' fixedHeader style={{backgroundColor: 'blueGrey900'}}>
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow style={{width:'100px'}}>
                    <TableHeaderColumn colSpan="3" style={{ width: '200px'}} >
                      <h3><img className='albumArt' src={this.props.art_url100} onClick={(e)=>{e.preventDefault(); this.getAlbumInfoItunes(this.props.album);}} /></h3>
                    </TableHeaderColumn>
                    <TableHeaderColumn colSpan="3" style={{ width: '400px', whiteSpace: 'normal', verticalAlign:'middle' }}>
                      <h4>{this.props.title}</h4>
                      <h5>{this.props.artist}</h5>
                      <p>{this.props.year}</p>
                      <p>{this.props.genre}</p>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow style={{ width: '100%', verticalAlign:'middle' }}>
                    <TableHeaderColumn colSpan="1" style={{ width: '200px', 'padding-left': '18px', verticalAlign: 'middle' }}><ContentInbox /></TableHeaderColumn>
                    <TableHeaderColumn colSpan="4" style={{ width: '800px', 'padding-left': '60px', verticalAlign: 'middle' }}>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan="1" style={{ width: '200px', 'padding-left': '60px', verticalAlign: 'middle' }}>Time</TableHeaderColumn>
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
          style={{ height: '122px', width: '100%', textAlign: 'left' }}
          hoverable={true}
        >
          <TableRowColumn colSpan="1" style={{ width: '150px', paddingRight: '10px' }}>
            <span className='month'><h4>{moment.months(this.state.month - 1)}</h4> </span>
            <span className='day'><h4>{this.props.date.slice(8, 10)}</h4></span>
            <span className='year'>{this.props.date.slice(0,4)}</span>
          </TableRowColumn>

          <TableRowColumn colSpan="2" style={{ width: '110px', padding: '0'}}>
            <h3><img className='albumArt' src={this.props.art_url100}
                onClick={(e)=>{
                  e.preventDefault();

                  this.getAlbumInfoItunes(this.props.album);
                }} /></h3>
          </TableRowColumn>
          <TableRowColumn colSpan="2" style={{ width: '320px', whiteSpace: 'normal', paddingLeft: '5px' }}>
              <h4>{this.props.title}</h4>
              <h5>{this.props.artist}</h5>
              <p>{this.props.year}</p>
              <p>{this.props.genre}</p>
          </TableRowColumn>
          <TableRowColumn colSpan="4" style={{ width: '450px', 'whiteSpace': 'normal', paddingTop: '10px', paddingBottom: '10px' }}>
            <div className="impression">{this.props.impression}</div>
          </TableRowColumn>
          <TableRowColumn colSpan="3">
            <Rating
              value={this.props.rating}
              max={5}
              readOnly
            />
          </TableRowColumn>
          <TableRowColumn colSpan="1" style={{ textAlign: 'center', padding: '10px' }}>
            {
              this.state.confirmDeletionModalActive &&

              (
                <Dialog
                    title="Confirm Removal"
                    actions={[
                      <FlatButton label="Cancel" primary={true}
                        onClick={this.closeModals} />,
                      <FlatButton label="Continue" primary={true}
                        onClick={this.handleDelete} />
                    ]}
                    modal={false}
                    open={this.state.confirmDeletionModalActive}
                    onRequestClose={this.closeModals}
                  >
                    Confirm the deletion of this album
               </Dialog>


              )
            }
            <div className='btn-group' role="group">
              <a className="remove" onClick={this.handleClickToDelete}>
                <button className='remove btn btn-default'>
                  {/* remove button */}
                  <span className='glyphicon glyphicon-remove-circle'></span>
                </button>
              </a>
            </div>
          </TableRowColumn>
        </TableRow>



      </div>
    );
  };
};

export default Entry;
