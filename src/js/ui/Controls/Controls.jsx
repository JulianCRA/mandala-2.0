import React from 'react'
import classNames from 'classnames'

import { mandalaContext } from '../../context/MandalaProvider'

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
	
	const [ showConfigPanel, toggleConfigPanel ] = React.useState(()=>true)
	const [ showSavePanel, toggleSavePanel ] = React.useState(()=>false)
	const [ showDrawPanel, toggleDrawPanel ] = React.useState(()=>false)

	return (
		<div className = { cx(styles.controls, styles[side]) } >
			<div className = { cx(styles.quickaccess, styles[side]) } >
				<button 
					className = {styles.toolsButton}
					onClick = { () => {
						toggleDrawPanel(!showDrawPanel)
						toggleSavePanel(false)
						toggleConfigPanel(false)
					}}
					style = {{
						background:  `url(${showDrawPanel? closeBtn : toolBtn}) center no-repeat` 
					}}
				/>

				<button 
					className = {styles.toolsButton}
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
					className={styles.toolsButton}
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
				/>
				
				<button 
					className = {styles.toolsButton}
					style = {{
						background: `url(${deleteBtn}) center no-repeat` 
					}}
					onClick = { event => {
						event.preventDefault()
						console.log('settings', settings)
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
