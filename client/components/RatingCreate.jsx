import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { Rating } from 'material-ui-rating'
import RaisedButton from 'material-ui/RaisedButton';

export default class RatingCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: 5
    };
  }

  handleRate(value) {
    this.props.handleStateChange('rating', value);
    this.setState({ rating: value});
  }

  handleSubmit() {
    this.props.addNewEntry();
    this.props.handleStateChange('currForm', 'none');
    this.props.handleStateChange('snackbar', true);

  }
  render() {
    return (
      <Dialog
        title="Leave your rating"
        modal={false}
        open={this.props.currForm === 'RatingCreate'}
        onRequestClose={() => this.props.handleStateChange('currForm', 'none') } >
        <Rating
          value={this.state.rating}
          max={5}
          onChange={(value) => this.handleRate(value) }
        />
        <RaisedButton label="Journal" backgroundColor='#254E70' labelColor='#fff'
          onTouchTap={this.handleSubmit.bind(this) } />
      </Dialog>
    );
  }

}
