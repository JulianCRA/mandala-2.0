import React from 'react'

import { MandalaProvider } from '../../context/MandalaProvider'
// import MandalaDrawing from './MandalaDrawing'

import Controls from '../../ui/Controls'

import styles from './Mandala.module.css'

const Mandala = () => {
	return (
		<MandalaProvider>
			<div className = {styles.mandalaContainer}>
				{/* <MandalaDrawing /> */}
				<Controls side = "left" />
			</div>
		</MandalaProvider>
	)
}

export default Mandala
