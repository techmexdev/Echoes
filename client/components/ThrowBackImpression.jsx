import React from 'react';
import { GridList } from 'material-ui/GridList';
import ThrowBackImpressionEntry from './ThrowBackImpressionEntry.jsx';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: '4px',
    maxHeight: '500px'
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    height: '270px'
  },
};

const ThrowBackImpression = (props) => (
  <div style={styles.root}>
    <GridList style={styles.gridList} cols={2.2}>
      {props.allEntries.map((entry, index) => (
        <ThrowBackImpressionEntry
          key={index}
          title={entry.title}
          artist={entry.name}
          genre={entry.genre}
          year={entry.year}
          rating={entry.rating}
          impression={entry.impression}
          art_url60={entry.art_url60}
          art_url100={entry.art_url100}
        />
      ))}
    </GridList>
    </div>
);

export default ThrowBackImpression;
