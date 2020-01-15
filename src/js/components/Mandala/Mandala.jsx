import React from 'react'

import { MandalaProvider } from '../../context/MandalaProvider'
import DrawingCanvas from '../DrawingCanvas'

import Controls from '../../ui/Controls'

import styles from './Mandala.module.css'

const Mandala = () => {
	return (
		<MandalaProvider>
			<div className = {styles.mandalaContainer}>
				<DrawingCanvas />
				<Controls side = "left" />
			</div>
		</MandalaProvider>
	)
}

export default Mandala
