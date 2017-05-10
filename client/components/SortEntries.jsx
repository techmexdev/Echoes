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
  }

  handleChange(event, index, value) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <div>
        <br />
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value={1} primaryText="Sort By" />
          <MenuItem value={2} primaryText="Album" />
          <MenuItem value={3} primaryText="Artist" />
          <MenuItem value={4} primaryText="Rating: High - Low" />
          <MenuItem value={5} primaryText="Rating: Low - High" />
        </DropDownMenu>
      </div>
    );
  }
}

export default SortEntries;
