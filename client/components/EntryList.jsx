import React from 'react';
import Entry from './Entry.jsx';

class EntryList extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    return (
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
      {this.props.allEntries.map((entry) => {
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
    </tbody>
    );
  }
};

export default EntryList;
