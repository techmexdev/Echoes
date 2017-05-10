
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Rating} from 'material-ui-rating';

class UpdateBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalActive:false,
      rating: '',
      impression: '',
      confirmDeletionModalActive: false
    };
  }

  //show updateBox
  openModal () {
    this.setState({ modalActive:true})
  }

  //hide updateBox
  closeModals () {
    this.setState({modalActive:false, confirmDeletionModalActive: false});
  }

  // handles all form value changes
  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  //handles submiting form
  handleSubmit (e) {
    e.preventDefault();
    this.props.updateUserEntries(this.props.impressionId, this.state.rating, this.state.impression, this.props.getUserEntries);
    this.closeModals();
  }

  // handles deleting whole entry from the database
  handleDelete(e) {
    e.preventDefault();
    this.closeModals();
    this.props.deleteUserEntries(this.props.impressionId, this.props.date, this.props.getUserEntries);

  }

  handleClickToDelete(e) {
    e.preventDefault();
    this.setState({confirmDeletionModalActive: true});
  }

  render () {
      console.log('Im here');
      return (
        // td
        <td className='col-md-3'>
          {
            this.state.confirmDeletionModalActive &&

            (
              <Dialog
                  title="Confirm Removal"
                  actions={[
                    <FlatButton label="Cancel" primary={true}
                      onClick={this.closeModals.bind(this)} />,
                    <FlatButton label="Continue" primary={true}
                      onClick={this.handleDelete.bind(this)} />
                  ]}
                  modal={false}
                  open={this.state.confirmDeletionModalActive}
                  onRequestClose={this.closeModals.bind(this)}
                >
                  Confirm the deletion of this album
                </Dialog>


            )
          }

          {!this.state.modalActive && (
            <div className='btn-group' role="group">
              {/* update button -- do not remove a tags.
                They are necessary to maintain working buttons while keeping bootstrap styling */}
              <a onClick={this.openModal.bind(this)}>
                <button className='update btn btn-default'>
                  {/* pencil icon */}
                  <span className='glyphicon glyphicon-pencil'></span>
                </button>
              </a>
              {/*  delete button */}
              <a onClick={this.handleClickToDelete.bind(this)}>
                <button className='remove btn btn-default'>
                  {/* remove button */}
                  <span className='glyphicon glyphicon-remove-circle'></span>
                </button>
              </a>
            </div>
          )}
          {this.state.modalActive && (
            <div className='update'>
            
              {/* remove icon */}
              <span className='close glyphicon glyphicon-remove' onClick={this.closeModals.bind(this)}></span>
              
              <form id='update' onSubmit={this.handleSubmit.bind(this)}>
                {/* impression box */}
                <textarea className='form-control' id='impression' name='impression'
                                          cols='25'
                                          rows='4'
                                          value={this.state.impression}
                                          onChange={this.handleInputChange.bind(this)}
                                          placeholder='Write your impression...'></textarea>
                <br></br>
                <div> <Rating value={+this.state.rating} max={10} 
                onChange={(value) => {
                  console.log(`Rated with value ${value}`); 
                  this.setState({rating:value});
                } }/></div>
                <div className='input-group'>
                  {/* rating dropdown */}

                  <span className='input-group-btn'>
                    <button className='btn btn-default' type='submit' id="submit" name='button' value='Save'>Submit</button>
                    <button className='btn btn-default' onClick={this.closeModals.bind(this)}>Cancel</button>
                  </span>
                </div>
              </form>
            </div>
          )}
      </td>
      )
    }
}

export default UpdateBox;
