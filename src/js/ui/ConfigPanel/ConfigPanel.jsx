import React from 'react'
import cx from 'classnames'

import { mandalaContext, actions } from '../../context/MandalaProvider'

import styles from '../Controls/Controls.module.css'

const ConfigPanel = ({ side, show }) => {
	const { settings, updateSettings } = React.useContext( mandalaContext )
	
	return (
		<div className = {cx(styles.panel, styles[side], { [styles.hidden]: !show })}>
			
			<div className = { cx(styles.property, styles.propertySlider)} >
				<label> Sections : {settings.sections}</label>
				<input 
					type = "range" 
					className = {styles.sliderProperty}
					value = {settings.sections} 
					min = "2"
					max = "128" 
					step = "2" 
					onChange = {event => 
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'sections',
							value: Number(event.currentTarget.value)
						})
					}
				/>
			</div>

			<div className = { cx(styles.property, styles.propertySlider)}>
				<label> Stroke accuracy : {Math.round(settings.correctionAccuracy*100)}%</label>
				<input 
					type = "range" 
					className = {styles.sliderProperty}
					defaultValue = {Math.round(settings.correctionAccuracy*100)} 
					min = "5" 
					max = "50" 
					step = "1"
					onInput = {event => 
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'correctionAccuracy',
							value: Number(event.currentTarget.value / 100)
						})
					}
				/>
			</div>

			<div className = { cx(styles.property, styles.propertySlider)}>
				<label> Stroke width : {settings.strokeWidth}</label>
				<input 
					type = "range" 
					className = {styles.sliderProperty}
					defaultValue = {settings.strokeWidth} 
					min = "1" 
					max = "20" 
					step = "1"
					onInput = {event => 
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'strokeWidth',
							value: Number(event.currentTarget.value)
						})
					}
				/>
			</div>


			<div className = { cx(styles.property, styles.propertyCheck) }>
				<label> Reflect strokes :</label>
				<input 
					type = "checkbox" 
					className = {styles.toggleProperty} 
					checked = {settings.reflect}
					onChange = {()=>{
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'reflect',
							value: !settings.reflect
						})
					}}
				/>
			</div>

			<div className = { cx(styles.property, styles.propertyCheck) }>
				<label> Show guides :</label>
				<input 
					type = "checkbox" 
					className = {styles.toggleProperty} 
					checked = {settings.showGuides}
					onChange = {()=>{
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'showGuides',
							value: !settings.showGuides
						})
					}}
				/>
			</div>

			<div className = { cx(styles.property, styles.propertyCheck) }>
				<label> Anti-Alias :</label>
				<input 
					type = "checkbox" 
					className = {styles.toggleProperty} 
					checked = {settings.antialias}
					onChange = {()=>{
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'antialias',
							value: !settings.antialias
						})
					}}
				/>
			</div>
		</div>
	)
}

export default React.memo(ConfigPanel)
