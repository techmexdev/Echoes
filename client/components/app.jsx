import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { lightBlue50, indigo900, blueGrey300, blueGrey400, blueGrey500, blueGrey900 } from 'material-ui/styles/colors';
import injectTapEventPlugin from "react-tap-event-plugin";
import $ from 'jquery';
import SortEntries from './SortEntries.jsx'
import Search from './Search.jsx';
import EntryList from './EntryList.jsx';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blueGrey900,
    primary2Color: blueGrey500,
    accent1Color: blueGrey300,
    accent2Color: blueGrey400,
    textColor: lightBlue50,
    canvasColor: blueGrey900,
  },
  appBar: {
    height: 50,
  },
});

injectTapEventPlugin();

class App extends React.Component {
  constructor (props) {
    super (props);
    // will hold state of all entries in database and current search values
    this.state = {
      viewingEntry: '',
      allEntries: [],
      searchResults: [],
      currentUser: '',
      sortByAlbum: false,
      sortByArtist: false,
      sortByRatingHighest: false,
      sortByRatingLowest: false,
    };
    // Bindings
    this.disableSorts = this.disableSorts.bind(this);
    this.deleteUserEntries = this.deleteUserEntries.bind(this);
    this.getUserEntries = this.getUserEntries.bind(this);
    this.toggleSortAlbum = this.toggleSortAlbum.bind(this);
    this.toggleSortArtist = this.toggleSortArtist.bind(this);
    this.toggleSortLowest = this.toggleSortLowest.bind(this);
    this.toggleSortHighest = this.toggleSortHighest.bind(this);
    this.updateUserEntries = this.updateUserEntries.bind(this);
  }
  // when the component loads successfully
  componentWillMount () {
    // load all of the user's data
    this.getUserEntries();
  }

  disableSorts(){
    this.setState({
      sortByAlbum: false,
      sortByArtist: false,
      sortByRatingLowest: false,
      sortByRatingHighest: false,
    })
  }
  // deletes a listening instance from the db
  deleteUserEntries (id, date, callback) {
    $.ajax({
      url:'/querydb/delete',
      type:'POST',
      data: {
        impressionId: id,
        date: date
      },
      success: function (response) {
        callback();
      },
      error: function (error) {
        throw error;
      }
    })
  }
  getUserEntries () {
    var app = this;
    $.ajax({
      url: '/querydb',
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name
        if (response.length) {
          app.setState({
            allEntries: response,
            currentUser: response[0].user
          })
        } else {
          app.setState({
            allEntries: response
          })
        }
      },
      error: function (error) {
        throw error;
      }
    })
  };
  // generates greeting in banner
  greetUser () {
    // if current user is identified
    if (this.state.currentUser) {
      // greet them by name
      return `Hello, ${this.state.currentUser}!`
    } else {
      // new users are greetedwith Hello
      return `Hello!`
    }
  }

  toggleSortAlbum() {
    this.setState({
      sortByAlbum: !this.sortByAlbum,
    });
  }

  toggleSortArtist() {
    this.setState({
      sortByArtist: !this.sortByArtist,
    });
  }

  toggleSortHighest() {
    this.setState({
      sortByRatingHighest: !this.state.sortByRatingHighest,
    });
  }

  toggleSortLowest() {
    this.setState({
      sortByRatingLowest: !this.state.sortByRatingLowest,
    });
  }
  // updates a user entry
  updateUserEntries(id, rating, impression, callback) {
    var app = this;
    $.ajax({
      url:'/querydb/update',
      type:'POST',
      data:{
        id: id,
        rating: rating,
        impression: impression
      },
      success: function (response) {
         callback();
      },
      error: function (error) {
        throw error;
      }
    })
  }


  // renders the app to the DOM
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div className="container-fluid app">
            <header className="navbar">
              <div><h2 className="greeting">{this.greetUser()}</h2></div>
              <a href="/signout" className='navbar-right signout'>
                <button className="btn btn-default landing"><span>Sign Out</span></button>
              </a>
              <img className='navbar-center header logo' src="styles/logo.svg"></img>
            </header>
            <div className="entries-container">
              <div className="col-md-2 search">
                <SortEntries
                  handleSortByAlbum={this.toggleSortAlbum}
                  handleSortByArtist={this.toggleSortArtist}
                  handleSortByHighest={this.toggleSortHighest}
                  handleSortByLowest={this.toggleSortLowest}
                  disableSorts={this.disableSorts}
                />
                <Search getUserEntries={this.getUserEntries}/>
              </div>
              <div className="col-md-10">
                  <EntryList
                    allEntries={this.state.allEntries}
                    sortByAlbum={this.state.sortByAlbum}
                    sortByArtist={this.state.sortByArtist}
                    sortByRatingLowest={this.state.sortByRatingLowest}
                    sortByRatingHighest={this.state.sortByRatingHighest}
                    updateUserEntries={this.updateUserEntries}
                    getUserEntries={this.getUserEntries}
                    deleteUserEntries={this.deleteUserEntries}
                  />
              </div>
            </div>
          </div>
        </div>
     </MuiThemeProvider>
    )
  }
}

export default App;
