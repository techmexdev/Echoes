import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 200,
  },
};

class SortEntries extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
    //Bindings
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.props.disableSorts();
    this.setState({
      value,
    }, () => {
      if (this.state.value === 2) {
        this.props.handleSortByAlbum();
      } else if(this.state.value === 3) {
        this.props.handleSortByArtist();
      } else if (this.state.value === 4) {
        this.props.handleSortByHighest();
      } else if (this.state.value === 5) {
        this.props.handleSortByLowest();
      } else if (this.state.value === 1) {
        this.props.disableSorts();
      }
    });
  }

  render() {
    return (
      <div>
        <br />
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          autoWidth
        >
          <MenuItem value={1} primaryText="Sort By..." />
          <MenuItem value={2} primaryText="Sort By Album" />
          <MenuItem value={3} primaryText="Sort By Artist" />
          <MenuItem value={4} primaryText="Sort by Rating:Highest" />
          <MenuItem value={5} primaryText="Sort by Rating:Lowest" />
        </DropDownMenu>
      </div>
    );
  }
}

export default SortEntries;
