import React from 'react'
import cx from 'classnames'

import { mandalaContext, actions, modes } from '../../context/MandalaProvider'
import ColorPicker from '../ColorPicker'

import styles from '../Controls/Controls.module.css'

import bucketButton from '../../../assets/images/bucketbtn.png'
import freehandButton from '../../../assets/images/freehandbtn.png'
import lineButton from '../../../assets/images/straightlinebtn.png'


const DrawPanel = ({ side, show }) => {
	const { settings, updateSettings } = React.useContext( mandalaContext )
	
	const setMode = mode => {
		updateSettings({
			type: actions._CHANGE_VALUE,
			attribute: "mode",
			value: mode
		})
	}

	return (
		<div className = {cx(styles.panel, styles[side], { [styles.hidden]: !show })}>
			<ColorPicker />
			<div id = {styles.modes}>
				<input 
					type = "radio" 
					className = { cx(styles.toolsButton, styles.modeInput)} 
					name = "moderb"
					style = {{background: `url(${freehandButton}) center no-repeat`}}
					onChange = { () => setMode(modes._FREE_HAND) }
					checked = {settings.mode === modes._FREE_HAND}
				/>

				<input 
					type = "radio" 
					className = { cx(styles.toolsButton, styles.modeInput)} 
					name = "moderb"
					style = {{background: `url(${lineButton}) center no-repeat`}}
					onChange = { () => setMode(modes._STRAIGHT) }
					checked = {settings.mode === modes._STRAIGHT}
				/>

				<input 
					type = "radio" 
					className = { cx(styles.toolsButton, styles.modeInput)} 
					name = "moderb"
					style = {{background: `url(${bucketButton}) center no-repeat`}}
					onChange = { () => setMode(modes._FILL) }
					checked = {settings.mode === modes._FILL}
				/>
			</div>
		</div>
	)
}

export default React.memo(DrawPanel)
