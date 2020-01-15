import React from 'react'
import $ from 'jquery'

import spectrum from './spectrum.js'

import { mandalaContext, actions } from '../../context/MandalaProvider'

import './spectrum.css'

const previewColor = () => {
	$(".csampler").css("background-color", $("#colorpicker").spectrum("get").toHexString())
}

const ColorPicker = () => {
	const { settings, updateSettings } = React.useContext( mandalaContext )

	const setColor = ({_r, _g, _b, _a}) => {
		updateSettings({
			type: actions._CHANGE_VALUE,
			attribute: 'color',
			value: [Math.round(_r), Math.round(_g), Math.round(_b), Math.round(_a*255)]
		})
	}
	
	React.useEffect(() => {
		$("#colorpicker").spectrum({
			color: 'white',
			flat: true,
			move: previewColor,
			change: color => setColor(color),
			clickoutFiresChange: false,
			showPalette: true,
			showSelectionPalette: true,
			maxSelectionSize: 9,
			showButtons: false,
			containerClassName: 'colorp',
		})

		$("#colorpicker").on('dragstop.spectrum', function(e, tinycolor) { 
			setColor(tinycolor)
		})
		
		previewColor()
	}, [])

	return (
		<div>
			<input type="text" id="colorpicker"/>
			<div id="csampler"></div>
		</div>
	)
}

export default React.memo(ColorPicker)
