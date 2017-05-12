import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ImpressionCreate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dialog
        title="Write your impression"
        modal={false}
        open={this.props.currForm === 'ImpressionCreate'}
        onRequestClose={() => this.props.handleStateChange('currForm', 'none') }
      >
        <div>
          <TextField multiLine={true} rows={6} rowsMax={6} fullWidth={true}
            onChange={(event) => this.props.handleStateChange('impression', event.target.value) } />
          <RaisedButton label="Next" backgroundColor='#254E70' labelColor='#fff'
            onTouchTap={() => this.props.handleStateChange('currForm', 'RatingCreate')} />
        </div>
      </Dialog>
    );
  }
}
