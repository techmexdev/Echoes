import React from 'react';

class UpdateBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalActive:false,
      rating: '',
      impression: ''
    };
  }

  //show updateBox
  openModal () {
    this.setState({ modalActive:true})
  }

  //hide updateBox
  closeModal () {
    this.setState({modalActive:false})
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
    this.closeModal();
  }

  // handles deleting whole entry from the database
  handleDelete(e) {
    e.preventDefault();
    this.props.deleteUserEntries(this.props.impressionId, this.props.date, this.props.getUserEntries);
    this.closeModal();
  }


  render () {
      return (
        // td
        <td className='col-md-3'>
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
              <a onClick={this.handleDelete.bind(this)}>
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
              <span className='close glyphicon glyphicon-remove' onClick={this.closeModal.bind(this)}></span>
              <form id='update' onSubmit={this.handleSubmit.bind(this)}>
                {/* impression box */}
                <textarea className='form-control' id='impression' name='impression'
                                          cols='25'
                                          rows='4'
                                          value={this.state.impression}
                                          onChange={this.handleInputChange.bind(this)}
                                          placeholder='Write your impression...'></textarea>
                <br></br>
                <div className='input-group'>
                  {/* rating dropdown */}
                  <select className='form-control' name='rating' id='rating' value={this.state.rating} onChange={this.handleInputChange.bind(this)}>
                    <option value={null}>Rating</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                  <span className='input-group-btn'>
                    <button className='btn btn-default' type='submit' id="submit" name='button' value='Save'></button>
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
