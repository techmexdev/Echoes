constructor(props){
  super(props);
  this.state = {
    open: false,
  };
}

handleOpen() {
  this.setState({open: true});
};

handleClose() {
  this.setState({open: false});
};

render() {
  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={() => this.handleClose()}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      onTouchTap={() => this.handleClose()}
    />,
  ];

  return (
    <div>
      <RaisedButton label="Dialog" onTouchTap={() => this.handleOpen()} />
      <Dialog
        title="Dialog With Actions"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={() => this.handleClose()}
      >
        The actions in this window were passed in as an array of React objects.
      </Dialog>
    </div>
  );
}
