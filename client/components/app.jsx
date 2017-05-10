import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
import SortEntries from './SortEntries.jsx'
import Search from './Search.jsx';
import EntryList from './EntryList.jsx';

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
      sortByRatingHighest: false,
      sortByRatingLowest: false,
    };
    // Bindings
    this.getUserEntries = this.getUserEntries.bind(this);
    this.deleteUserEntries = this.deleteUserEntries.bind(this);
    this.toggleSortLowest = this.toggleSortLowest.bind(this);
    this.toggleSortHighest = this.toggleSortHighest.bind(this);
    this.updateUserEntries = this.updateUserEntries.bind(this);
  }
  // when the component loads successfully
  componentWillMount () {
    // load all of the user's data
    this.getUserEntries();
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
        //console.log(response);
        console.log('deleting user entries')
        callback();
      },
      error: function (error) {
        console.log(error);
        throw error;
      }
    })
  }
  getUserEntries () {
    console.log('getUserEntries called')
    var app = this;
    $.ajax({
      url: '/querydb',
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name
        console.log('get User entries: ', response)
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
        console.log(error);
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

  toggleSortHighest() {
    this.setState({
      sortByRatingHighest: !this.state.sortByRatingHighest,
      sortByRatingLowest: false,
    });
  }

  toggleSortLowest() {
    this.setState({
      sortByRatingLowest: !this.state.sortByRatingLowest,
      sortRatingByHighest: false,
    });
  }
  // updates a user entry
  updateUserEntries (id, rating, impression, callback) {
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
        console.log(error);
        throw error;
      }
    })
  }


  // renders the app to the DOM
  render () {
    console.log('rendering app');

    return (
      <MuiThemeProvider>
        <div>
          <div className="container-fluid app">
            <header className="navbar">
              <div><h2 className="greeting">{this.greetUser()}</h2></div>
              <a href="/signout" className='navbar-right signout'>
                <button className="btn btn-default landing"><span>Sign Out</span></button>
              </a>
              <img className='navbar-center header logo' src="styles/logo.svg"></img>
            </header>
            <div  className="col-md-2 search">
              <SortEntries handleSortByHighest={this.toggleSortHighest} handleSortByLowest={this.toggleSortLowest} />
            </div>
            <div className="col-md-10">
              <EntryList
                allEntries={this.state.allEntries}
                sortByRatingLowest={this.state.sortByRatingLowest}
                sortByRatingHighest={this.state.sortByRatingHighest}
                updateUserEntries={this.updateUserEntries}
                getUserEntries={this.getUserEntries}
                deleteUserEntries={this.deleteUserEntries}
              />
            </div>
          </div>
        </div>
     </MuiThemeProvider>
    )
  }
}

export default App;
