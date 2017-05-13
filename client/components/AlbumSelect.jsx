import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import './AlbumSelect.css';

export default class AlbumSelect extends Component {
  constructor(props){
    super(props);
  }

  handleOpen() {
    this.props.handleStateChange('currForm', 'AlbumSelect')
  }

  selectAlbum(album) {
    this.props.handleStateChange('album', album);
    this.props.handleStateChange('currForm', 'ImpressionCreate');
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
          <TextField
            onChange={(event) => { this.props.iTunesSearch(event.target.value) } }
             />
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
              {
                this.props.searchResults.map( album =>
                <GridTile
                  className={"container"}
                  onTouchTap={ () => { this.selectAlbum(album); } }
                  key={album.artworkUrl100}
                  title={album.collectionName}
                  subtitle={album.artistName}
                  titlePosition="top"
                  titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  cols={2}
                  rows={2}
                >
                  <img src={album.albumArtUrl} style={{width: 'auto'}}/>

                </GridTile>

              )}
            </GridList>
        </Dialog>
      </div>
    );
  }

}
