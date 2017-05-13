import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Rating } from 'material-ui-rating';

class UpdateBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalActive:false,
      rating: '',
      impression: '',
      confirmDeletionModalActive: false
    };
    // Bindings
    this.openModal = this.openModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClickToDelete = this.handleClickToDelete.bind(this);
  }

  //show updateBox
  openModal() {
    this.setState({
      modalActive: true,
    });
  }

  //hide updateBox
  closeModals() {
    this.setState({
      modalActive: false,
      confirmDeletionModalActive: false
    });
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
    this.setState({
      confirmDeletionModalActive: true,
    });
  }

  render() {
      return (
        // td
        <td className='col-md-3 update'>
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
                  onRequestClose={this.closeModals}
                >
                  Confirm the deletion of this album
             </Dialog>
            )
          }

          {!this.state.modalActive && (
            <div className='btn-group' role="group">
              {/* update button -- do not remove a tags.
                They are necessary to maintain working buttons while keeping bootstrap styling */}
              <div>
                  <a onClick={this.openModal}>
                    <button className='update btn btn-default'>
                    {/* pencil icon */}
                    <span className='glyphicon glyphicon-pencil'></span>
                  </button>
                </a>
              </div>
              {/*  delete button */}
              <div>
                <a onClick={this.handleClickToDelete}>
                  <button className='remove btn btn-default'>
                    {/* remove button */}
                    <span className='glyphicon glyphicon-remove-circle'></span>
                  </button>
                </a>
              </div>
            </div>
          )}
          {this.state.modalActive && (
            <div className='update'>
              {/* remove icon */}
              <span className='close glyphicon glyphicon-remove' onClick={this.closeModals}></span>

              <form id='update' onSubmit={this.handleSubmit}>
                {/* impression box */}
                <textarea
                  className='form-control'
                  id='impression'
                  name='impression'
                  cols='25'
                  rows='4'
                  value={this.state.impression}
                  onChange={this.handleInputChange}
                  placeholder='Write your impression...'>
                </textarea>
                <br></br>
                <div>
                  <Rating
                  value={+this.state.rating}
                  max={5}
                  onChange={(value) => {
                    this.setState({
                      rating: value
                    });
                    }}
                  />
              </div>
                <div className='input-group'>
                  <span className='input-group-btn'>
                    <button className='btn btn-default updateForm' type='submit' id="submit" name='button' value='Save'>Submit</button>
                    <button className='btn btn-default updateForm' onClick={this.closeModals}>Cancel</button>
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
