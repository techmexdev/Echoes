import React from 'react';
import Result from './Result';

// Component generatees each search result entry
class ResultsList extends React.Component {
	constructor(props){
		super(props);
	}

	render () {

		return (
			<div>
				{this.props.albums.map((album) => {
					return (
						<Result addNewEntry={this.props.addNewEntry}
							      setSelected={this.props.setSelected}
										key={album.collectionId}
										album={album}/>
						)}
					)
				}
			</div>
		);
	}

}

window.ResultsList = ResultsList;
