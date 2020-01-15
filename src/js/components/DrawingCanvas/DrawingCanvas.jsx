import React from 'react'
import P5Wrapper from '../P5Wrapper'
import mandalaSketch from '../../sketch/mandala-p5-sketch'

import { mandalaContext } from '../../context/MandalaProvider'

const DrawingCanvas = () => {
	const {settings, updateSettings} = React.useContext(mandalaContext)
	
	return (
		<P5Wrapper sketch = {mandalaSketch} config = {settings}/>
	)
}

export default DrawingCanvas
