import React, {Component} from 'react';
import AlbumSelect from './AlbumSelect.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import ImpressionCreate from './ImpressionCreate.jsx';
import RatingCreate from './RatingCreate.jsx';
import moment from 'moment';
import $ from 'jquery';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class CreateImpressionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albumQuery: '',
      searchResults: [],
      currForm: 'none',
      album: '',
      impression: '',
      rating: 0,
			snackbar: false
    }
  }

	handleStateChange(state, value, callback = ()=> {}) {
		this.setState({ [state]: value }, () => {
			callback();
		});
	}

  iTunesSearch (term) {
		// used percent encoding for iTunes API search
		var query = term.split(' ').join('%20');
		// creates search URL with limit of four results
		var searchUrl = 'https://itunes.apple.com/search?term=?$' + query + '&entity=album&limit=12';
=======
      searchResults: '',
      displayForm: 'none',
      album: '',
      impression: '',
      rating: 0
    }
  }

	handleStateChange(state, value) {
		this.setState({ [state]: value });
	}

  iTunesSearch (term) {
		this.setState({albumQuery: term});
		// used percent encoding for iTunes API search
		var query = this.state.albumQuery.split(' ').join('%20');
		// creates search URL with limit of four results
		var searchUrl = 'https://itunes.apple.com/search?term=?$' + query + '&entity=album&limit=4';
>>>>>>> Change

		$.ajax({
			url: searchUrl,
			data : {
				format: 'json'
			},
			type: 'GET',
			dataType: 'jsonp',
			success: (data) => {
<<<<<<< HEAD
				console.log('Album search results: ', data.results);
				// changes state of results, triggering view change
				this.setState({ searchResults: [] }, () => {
					data.results.forEach(item => {
					this.spotifyAlbumArtSearch(item.artistName, item.collectionName, item);
				})
			});
				// this.setState({searchResults: data.results});
=======
				console.log('Album search results: ', data);
				// changes state of results, triggering view change
				this.setState({searchResults: data.results});
>>>>>>> Change
			},
			error: (error) => {
				console.log(error);
				return;
			}
		})
	}

	spotifyAlbumArtSearch(artistSpaced, albumSpaced, iTunesItem) {
		let artist = artistSpaced.split(' ').join('%20');
		let album = albumSpaced.split(' ').join('%20');

		fetch(`https://api.spotify.com/v1/search?q=${artist}%20${album}&type=album&limit=1`)
			.catch( e => {
				console.log('Could not fetch album. Error: ', e)
			})
			.then( res => res.json())
			.then( json => {
				if(json.albums.items[0].images[0].url !== '')
				 	return json.albums.items[0].images[0].url
				return new Error()
			})
			.catch( ()=> { console.log('Could not fetch image'); })
			.then( albumArtUrl => {

				if(albumArtUrl) {
						const newSearchRes = [Object.assign({}, iTunesItem, {albumArtUrl}) ];
						this.setState({
						searchResults: this.state.searchResults.concat(newSearchRes)
					});
				}
			})
	}

	addNewEntry () {
	 // send object with keys album and date
	 var newEntry = {album: this.state.album, date: new Date().slice(0,10)};

	 // user can only submit one album
	 if (this.state.results.length === 1) {
		 $.ajax({
			 url: '/querydb',
			 type: 'POST',
			 dataType: 'text',
			 contentType: 'application/json',
			 data: JSON.stringify(newEntry),
			 success: (results) => {
				 console.log('SUCCESS!', results)
				 // assigns current date to state
				 // clears previously set state
				 var date = this.setDate();
				 this.setState({
					 term: '',
					 results: [],
					 selectedListenDate: date
				 });
					// gets user entries from db and rerenders entry list
				 console.log('calling getUserEntries from search.jsx')
				 this.props.getUserEntries();
				 // clear the search bar
				 $('.search-bar').val('');
  		 },
  			 error: function (error) {
  				 console.log(error);
  				 return;
  			 }
  		 });
  	 }
   }

  componentWillMount() {
    let todayDate = new Date();
		this.setState({
			selectedListenDate: moment(todayDate).format('YYYY-MM-DD')
		});
	}

  render() {
    return(
      <div>
				<RaisedButton label="Dialog"
					onTouchTap={() => { this.setState({currForm: 'AlbumSelect'}); } } />
				<AlbumSelect handleStateChange={this.handleStateChange.bind(this)} currForm={this.state.currForm}
					iTunesSearch={this.iTunesSearch.bind(this)} searchResults={this.state.searchResults}/>
				 <ImpressionCreate handleStateChange={this.handleStateChange.bind(this)} currForm={this.state.currForm} />
				<RatingCreate handleStateChange={this.handleStateChange.bind(this)} currForm={this.state.currForm}
					addNewEntry={()=> this.addNewEntry}/>
				<Snackbar
          open={this.state.snackbar}
          message="You've created an impression"
          autoHideDuration={2000}
          onRequestClose={ () => this.setState({snackbar: false}) }
        />
      </div>
    );
  }
}
