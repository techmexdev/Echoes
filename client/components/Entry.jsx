import React from 'react';
import { Rating } from 'material-ui-rating';
import UpdateBox from './UpdateBox.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Spinner from './Spinner.jsx';

class Entry extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      months:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month:'',
      albumInfo : {status: 'UNREQUESTED'} ///UNREQUESTED LOADING ERROR DATA
    }
  }

  componentWillMount () {
    this.setState ({
      month:this.props.date.slice(5,7)
    })
  }

  getAlbumInfoItunes(album) {
    this.setState({
      albumInfo: {status: 'LOADING'}
    });
    var searchAlbumUrl = 'https://itunes.apple.com/search?term=?$' +
                         this.props.title.split(' ').join('%20') +
                         '&entity=album&limit=1';

    var _this = this;
    $.ajax({
      url: searchAlbumUrl,
      data: {
        format: 'json'
      },
      type: 'GET',
      dataType: 'jsonp',
      success: (data) => {
        var collectionId = data.results[0].collectionId;
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

  render () {
    var statusAlbum = this.state.albumInfo.status;
    return (
      <tr className='entry row'>
        {/* Pop-Up of Album info */}
        <Dialog
          title="Songs"
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
          {statusAlbum === 'LOADING' && <Spinner />}
          {statusAlbum === 'ERROR' && ' A loading error has occurred.'}

          {statusAlbum === 'DATA' &&
            <div className='container-list tableDiv'>
              <table className="table-responsive table">
                <tbody className='container-fluid entryList'>
                  <tr className="row">
                    <th><ContentInbox /></th>
                    <th>Name</th>
                    <th>Time</th>
                  </tr>
                  {this.state.albumInfo.songs.map((song, index) => (
                    <tr key={song.trackId} className="row">
                      <td className={"col-sm-2"}>{+index + 1}</td>
                      <td className={"col-sm-10"}>{song.trackName}</td>
                      <td className={"col-sm-2"}>{Math.floor(song.trackTimeMillis / 1000 / 60)}:{Math.floor(song.trackTimeMillis / 1000 % 60)}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </Dialog>

        {/* Impression Entry */}
        <td className='listenDate col-md-1'>
          <span className='month'><h4>{moment.months(this.state.month - 1)}</h4> </span>
          <span className='day'><h4>{this.props.date.slice(8, 10)}</h4></span>
          <span className='year'>{this.props.date.slice(0,4)}</span>
        </td>
        <td className='col-md-1' onClick={(e)=>{e.preventDefault(); this.getAlbumInfoItunes(this.props.album);}}>
          <div>
            <img className='albumArt' src={this.props.art_url100} />
          </div>
        </td>
        <td className='albumInfo col-md-2'>
          <div>
            <h4>{this.props.title}</h4>
            <h5>{this.props.artist}</h5>
            <p>{this.props.year}</p>
            <p>{this.props.genre}</p>
          </div>
        </td>
        <td className='impression col-md-4'>
          <div>{this.props.impression}</div>
        </td>
        <td className='rating col-md-3'>
          <Rating
            value={this.props.rating}
            max={5}
            readOnly
          />
        </td>
        <UpdateBox impressionId={this.props.impressionId}
                   date={this.props.date}
                   impression={this.props.impression}
                   rating={this.props.rating}
                   updateUserEntries={this.props.updateUserEntries}
                   getUserEntries={this.props.getUserEntries}
                   deleteUserEntries={this.props.deleteUserEntries}/>
      </tr>
    )
  }
}

export default Entry;
