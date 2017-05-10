import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class AlbumSelect extends Component {
  constructor(props){
    super(props);
  }
  handleOpen() {
    this.props.handleStateChange('currForm', 'AlbumSelect')
  }
  handleSelect(album) {

  }

  render() {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
      },
    };

    return (
      <div>
        <Dialog
          title="Select an album"
          modal={false}
          open={this.props.currForm === 'AlbumSelect'}
          onRequestClose={() => { this.props.handleStateChange('currForm', 'none'); } }
        >
          <TextField hintText="Search for an album"
            onChange={(event) => { this.props.iTunesSearch(event.target.value) } } />
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
              {
                this.props.searchResults.map( album =>
                <GridTile
                  key={album.artworkUrl100}
                  title={album.collectionName}
                  subtitle={album.artistName}
                  titlePosition="top"
                  titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  cols={1}
                  rows={1}
                >
                  <img src={album.artworkUrl100} />
                </GridTile>

              )}
            </GridList>
        </Dialog>
      </div>
    );
  }

}
