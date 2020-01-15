import React from 'react'
import cx from 'classnames'

import { mandalaContext, actions } from '../../context/MandalaProvider'

import styles from '../Controls/Controls.module.css'

import downloadBtn from '../../assets/images/downloadbtn.png'

const SavePanel = ({ side, show }) => {
	const { settings, updateSettings } = React.useContext( mandalaContext )
	
	return (
		<div className = {cx(styles.panel, styles[side], { [styles.hidden]: !show })}>
			<div className={ cx( styles.property, styles.propertyCheck ) }>
				<label> Lines only :</label>
				<input 
					type = "checkbox" 
					checked = {settings.linesOnly}
					className = {styles.toggleProperty} 
					onChange = {()=>{
						updateSettings({
							type: actions._TOGGLE_LINES_ONLY
						})
					}} 
				/>
			</div>
			<div className = { cx( styles.property, styles.propertyCheck ) }>
				<label> Black on transparent : </label>
				<input 
					disabled = {!settings.linesOnly}
					type = "checkbox"
					checked = {settings.blackLines && settings.linesOnly}
					className = {styles.toggleProperty} 
					onChange = {()=>{
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'blackLines',
							value: !settings.blackLines
						})
					}} 
				/>
			</div>
			<div className = { cx( styles.property, styles.propertyCheck ) }>
				<label> Forced aliasing :</label>
				<input 
					disabled = {!settings.linesOnly}
					type = "checkbox"
					checked = {settings.forcedAlias && settings.linesOnly}
					className = {styles.toggleProperty} 
					onChange = {()=>{
						updateSettings({
							type: actions._CHANGE_VALUE, 
							attribute: 'forcedAlias',
							value: !settings.forcedAlias
						})
					}} 
				/>
			</div>
			<button 
				id = {styles.savebtn} 
				className = {styles.toolsButton} 
				onClick = {()=>setSaveConfig({lo:true, bot:false, fa:true})}
				style = {{
					background:  `url(${downloadBtn}) center no-repeat` 
				}}
			/>
		</div>
	)
}

export default React.memo(SavePanel)
