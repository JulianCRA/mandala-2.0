import React from 'react'
import classNames from 'classnames'

import { mandalaContext, actions } from '../../context/MandalaProvider'

import DrawPanel from '../DrawPanel'
import SavePanel from  '../SavePanel'
import ConfigPanel from '../ConfigPanel'

import styles from './Controls.module.css'

import toolBtn from '../../../assets/images/toolsbtn.png'
import closeBtn from '../../../assets/images/closebtn.png'
import saveBtn from '../../../assets/images/savebtn.png'
import undoBtn from '../../../assets/images/undobtn.png'
import deleteBtn from '../../../assets/images/deletebtn.png'

let cx = classNames.bind(styles)

const Controls = ({ side }) => {
	
	const { settings, updateSettings } = React.useContext( mandalaContext )
	
	const [ showConfigPanel, toggleConfigPanel ] = React.useState(()=>false)
	const [ showSavePanel, toggleSavePanel ] = React.useState(()=>false)
	const [ showDrawPanel, toggleDrawPanel ] = React.useState(()=>true)

	return (
		<div className = { cx(styles.controls, styles[side]) } >
			<div className = { cx(styles.quickaccess, styles[side]) } >
				<button 
					className = { cx(styles.toolsButton, showDrawPanel?styles.toolsButtonCurrent:null) }
					onClick = { () => {
						toggleDrawPanel(!showDrawPanel)
						toggleSavePanel(false)
						toggleConfigPanel(false)
						
					}}
					style = {{
						background:  `url(${showDrawPanel? closeBtn : toolBtn}) center no-repeat` 
					}}
					autoFocus = {false}
				/>

				<button 
					className = { cx(styles.toolsButton, showConfigPanel?styles.toolsButtonCurrent:null) }
					onClick = { () => {
						toggleConfigPanel(!showConfigPanel)
						toggleSavePanel(false)
						toggleDrawPanel(false)
					}}
					style = {{
						background:  `url(${showConfigPanel? closeBtn : toolBtn}) center no-repeat` 
					}}
				/>
		
		
				<button 
					className = { cx(styles.toolsButton, showSavePanel?styles.toolsButtonCurrent:null) }
					onClick = { () => {
						toggleSavePanel(!showSavePanel)
						toggleConfigPanel(false)
						toggleDrawPanel(false)
					}}
					style = {{
						background: `url(${showSavePanel? closeBtn : saveBtn}) center no-repeat` 
					}}
				/>

				<button 
					className = {styles.toolsButton}
					style = {{
						background: `url(${undoBtn}) center no-repeat` 
					}}
					onClick = { event => {
						event.preventDefault()
						updateSettings({
							type: actions._UNDO
						})
					}}
				/>
				
				<button 
					className = {styles.toolsButton}
					style = {{
						background: `url(${deleteBtn}) center no-repeat` 
					}}
					onClick = { event => {
						event.preventDefault()
						console.log('settings', settings)
						updateSettings({
							type: actions._CLEAR
						})
					}}
				/>
			</div>
			<div className = { styles.panels } >
				<SavePanel side = {side} show = {showSavePanel}/>
				<ConfigPanel side = {side} show = {showConfigPanel}/>
				<DrawPanel side = {side} show = {showDrawPanel}/>
			</div>
		</div>
	)
}



export default React.memo(Controls)
