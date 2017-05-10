import React from 'react';
import { Pagination } from 'react-bootstrap';
import Entry from './Entry.jsx';

class EntryList extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      currPage: 1,
      sortByRating: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(number) {
    console.log('handle select', number);
    this.setState({ currPage: number });
  }
  render () {
    let numItems = 10;
    let totalPages = Math.ceil(this.props.allEntries.length / 10);
    let allEntryData = this.props.allEntries.slice();

    let showNumEntries;
    if (this.state.currPage === 1) {
      showNumEntries = allEntryData.slice(0, numItems);
    } else {
      let end = numItems * this.state.currPage;
      let start = end - numItems;
      showNumEntries = allEntryData.slice(start, end);
    }
    return (
      <div className='container-list'>
        <table className="table-responsive table">
          <tbody className='container-fluid entryList'>
            <tr className='row'>
              <th className='col-md-1'>
                <span className='glyphicon glyphicon-calendar'></span>
              </th>
              <th className='col-md-1'><h5>Album</h5></th>
              <th className='col-md-2'></th>
              <th className='impression col-md-4'><h5>Impression</h5></th>
              <th className='rating col-md-1'><h5>Rating</h5></th>
              <th className='col-md-2'></th>
            </tr>
            {showNumEntries.map((entry) => {
              return (
                <Entry date={entry.date.slice(0,10)}
                       title={entry.title}
                       artist={entry.name}
                       genre={entry.genre}
                       year={entry.year}
                       rating={entry.rating}
                       impression={entry.impression}
                       art_url60={entry.art_url60}
                       art_url100={entry.art_url100}
                       impressionId={entry.id}
                       updateUserEntries={this.props.updateUserEntries}
                       getUserEntries={this.props.getUserEntries}
                       deleteUserEntries={this.props.deleteUserEntries}
                       key={entry.date + entry.id}
                  />
              )})
            }
            <tr>
            </tr>
          </tbody>
        </table>
        <Pagination
          bsSize="medium"
          items={totalPages}
          activePage={this.state.currPage}
          onSelect={this.handleSelect}
        />
      </div>
    );
  }
};

export default EntryList;
