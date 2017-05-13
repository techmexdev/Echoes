import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import { Rating } from 'material-ui-rating';
import Dialog from 'material-ui/Dialog';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentFilter from 'material-ui/svg-icons/content/filter-list'

const styles = {
  root: {
    whiteSpace: 'normal',
    backgroundColor: 'transparent',
  },
};

class ThrowBackImpressionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    // Binding
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({
      modalOpen: false,
    });
  }

  handleTileClick(e) {
    console.log(e.target);
    this.setState({
      modalOpen: true,
    });
  }

  render() {
    return (
      <div>
        <GridTile
          title={this.props.title}
          subtitle={this.props.title}
          actionIcon={<ContentFilter />}
          style={{height:'250px'}}
          onTouchTap={this.handleTileClick}
          >
            <img src={this.props.art_url100} style={{ width: '250px', height: '250px'}} />
          </GridTile>
          <Dialog
            title={`Your Impression on ${this.props.title}`}
            modal={false}
            open={this.state.modalOpen}
            onRequestClose={this.handleClose}
            actions= {
              <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleClose}
              />
            }
            >
            <Table
              selectable={false}
              style={styles.root}
              fixedHeader={false}
              displayBorder={false}
            >
              <TableBody
                style={styles.root}
                displayRowCheckbox={false}
                >
                <TableRow
                  selectable={false}
                  displayBorder={false}
                >
                  <TableRowColumn colSpan="4" style={{ whiteSpace: 'normal'}}>
                    <h3><img className='albumArt' src={this.props.art_url100} /></h3>
                    <h4>{this.props.title}</h4>
                    <h5>{this.props.artist}</h5>
                    <p>{this.props.year}</p>
                    <p>{this.props.genre}</p>
                    <Rating
                      value={this.props.rating}
                      max={5}
                      readOnly
                    />
                    <br />
                  </TableRowColumn>
                  <TableRowColumn colSpan="3" style={{ fontSize: '20px', whiteSpace: 'normal' }}>
                      {this.props.impression}
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Dialog>
      </div>
    );
  }
};

export default ThrowBackImpressionEntry;
