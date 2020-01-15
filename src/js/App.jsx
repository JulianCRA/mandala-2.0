import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class App extends Component {

	render() {
		return (
			<React.Fragment>
				Welcome back, {this.props.name}
			</React.Fragment>
		)
	}
}

export default App