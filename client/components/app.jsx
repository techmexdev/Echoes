import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import { lightBlue50, indigo900, blueGrey300, blueGrey400, blueGrey500, blueGrey900 } from 'material-ui/styles/colors';
import injectTapEventPlugin from "react-tap-event-plugin";
import $ from 'jquery';
import moment from 'moment';
import SortEntries from './SortEntries.jsx'
import Search from './Search.jsx';
import EntryList from './EntryList.jsx';

injectTapEventPlugin();

// sets color sets for Material UI components
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

class App extends React.Component {
  constructor (props) {
    super (props);
    // will hold state of all entries in database and current search values
    this.state = {
      viewingEntry: '',
      allEntries: [],
      searchResults: [],
      throwBackEntries: [],
      currentUser: '',
      sortByAlbum: false,
      sortByArtist: false,
      sortByRatingHighest: false,
      sortByRatingLowest: false,
      impressThrowBack: false,
    };
    // Bindings
    this.disableSorts = this.disableSorts.bind(this);
    this.deleteUserEntries = this.deleteUserEntries.bind(this);
    this.findOneYearEntries = this.findOneYearEntries.bind(this);
    this.getUserEntries = this.getUserEntries.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggleSortAlbum = this.toggleSortAlbum.bind(this);
    this.toggleSortArtist = this.toggleSortArtist.bind(this);
    this.toggleSortLowest = this.toggleSortLowest.bind(this);
    this.toggleSortHighest = this.toggleSortHighest.bind(this);
    this.updateUserEntries = this.updateUserEntries.bind(this);
  }
  // when the component loads successfully
  componentWillMount() {
    // load all of the user's data
    this.getUserEntries();
  }

  // after component mounts
  componentDidMount() {
    // will show dialog of what user listened to on year ago today
    this.setState({
      impressThrowBack: false,
    })
  }

  // disables all sorting states
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
  findOneYearEntries(entries) {
    let oneYearEntries = [];
    let todayDate = new Date();
    let formattedDate = moment(todayDate).format('YYYY-MM-DD');
    for (let idx in entries) {
      let entryDay = entries[idx].date.slice(0, 10);
      console.log(entries[idx]);
      if (formattedDate === entryDay) {
        oneYearEntries.push(entries[idx]);
      }
    }
  }
  //gets all users entries
  getUserEntries () {
    var app = this;
    $.ajax({
      url: '/querydb',
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name
        if (response.length) {
          let oneYearEnt = app.findOneYearEntries(response);
          app.setState({
            allEntries: response,
            currentUser: response[0].user,
            throwBackEntries: oneYearEnt,
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

  handleClose() {
    this.setState({
      impressThrowBack: false,
    });
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

            <Dialog
              title="1 Year Ago Today..."
              modal={true}
              open={this.state.impressThrowBack}
              actions= {
                <FlatButton
                  label="Close"
                  primary={true}
                  onTouchTap={this.handleClose}
                />
              }
            >
              <EntryList
                allEntries={this.state.throwBackEntries}
              />
            </Dialog>
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
