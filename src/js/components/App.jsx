import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class App extends Component {
  static propTypes = {
	name: PropTypes.string.isRequired
  }

  render() {
	return (
	  <div>
		<p>Here's to new beginnings, {this.props.name}!!!</p>
	  </div>
	)
  }
}

export default App
