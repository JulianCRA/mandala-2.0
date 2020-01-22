import MandalaDrawingTool from './MandalaDrawingTool'

const drawGuides = ({container, sections = 16, width = 640, height = 480}) => {
	const horizontalOffset = width * 0.5
	const verticalOffset = height * 0.5

	container.stroke([170, 170, 170, 50])
	container.noFill()
	container.strokeWeight(2)
	container.clear()

	container.push()
	container.translate(horizontalOffset, verticalOffset)

	for(let s = 0; s < sections; s++){
		container.rotate(Math.PI * 2 / sections)
		container.line(80, 0, width * 2, 0)
	}

	const constraint = Math.min(width, height)
	container.rect(constraint * -0.5, constraint * -0.5, constraint, constraint)
	container.ellipse(0, 0, constraint, constraint)
	container.pop()
}

const modes = {
	_FREE_HAND: 0,
	_STRAIGHT: 1,
	_FILL: 2
}

const mandalaSketch = p => {
	
	let mdt

	let canvas
	let guides
	let feedback
	let current

	let color
	let mode
	let sections
	let correctionAccuracy
	let strokeWidth
	let reflect
	let showGuides
	let antialias

	let isDrawing
	
	function initialize(config){
		color = config.color
		mode = config.mode
		sections = config.sections
		correctionAccuracy = config.correctionAccuracy
		strokeWidth = config.strokeWidth
		reflect  = config.reflect
		showGuides = config.showGuides
		antialias =  config.antialias
	}

	p.preload = () => {}
	p.setup = () => {
		console.log("SETUP")
		canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		canvas.mousePressed(p.pressed)
		
		// canvas.touchStarted(p.tStarted)
		// canvas.touchEnded(p.tEnded)
		// canvas.touchMoved(p.tMoved)

		mdt = new MandalaDrawingTool({width: p.width, height: p.height, color, sections, reflect, antialias, strokeWidth, correctionAccuracy})

		current = p.createGraphics(p.width, p.height)
		feedback = p.createGraphics(p.width, p.height)

		guides = p.createGraphics(p.width, p.height)
		drawGuides({container: guides, width: p.width, height: p.height, sections:sections})

		p.update()
	}

	p.update = () => {
		p.clear()
		p.image(current, 0, 0)
		if(showGuides)
			p.image(guides, 0, 0)
	}

	//#region MOUSE EVENTS
	/** MOUSE EVENTS */

	p.pressed = () => {
		p.mouseReleased = p.released
		isDrawing = true
		if(mode !== modes._FILL){
			p.mouseDragged = p.dragged
			
			feedback.clear()
			mdt.beginLine(p.mouseX, p.mouseY)
		}
	}

	p.dragged = () => {
		mdt.addVertex(p.mouseX, p.mouseY)
		mdt.drawLine(feedback, mode)
		mode === modes._STRAIGHT ? p.update() : null
		p.image(feedback, 0, 0)
	}

	p.released = () => {
		if(mode !== modes._FILL){
			p.mouseDragged = null
			p.mouseReleased = null
			mdt.endLine(p.mouseX, p.mouseY)
			mdt.applyLineCorrection(feedback, mode)
			current.image(feedback, 0, 0)
		}else{
			if(isDrawing)
				mdt.fillArea({xpos:p.mouseX, ypos:p.mouseY, currentDrawing:current, placeHolder:feedback})
		}
		isDrawing = false
		p.update()
	}
	//#endregion

	//#region TOUCH EVENTS
	/** TOUCH EVENTS */
	/*
	let activeTouch = false
	p.tStarted = (event) => {
		console.log('TOUCH start')
		//console.log('huh', huh)
		if(mode !== modes._FILL){
			const touch = event.touches[0]
			// const x = touch.pageX
			// const y = touch.pageY
			activeTouch = true
			mdt.beginCurve(touch.pageX, touch.pageY)
		}
		return false
	}
	
	p.tMoved = () => {
		//if(activeTouch || true){
			mdt.addVertex(p.mouseX, p.mouseY)
			mdt.drawLine(feedback, mode)
			mode === modes._STRAIGHT ? p.update() : null
			p.image(feedback, 0, 0)
		//}
		return false
	}

	p.tEnded = () => {
		if(mode !== modes._FILL){
			console.log('TOUCH END')
			if(activeTouch) activeTouch = false
			mdt.endCurve(p.mouseX, p.mouseY)
			current.image(feedback, 0, 0)	
		}
		p.update()
		return false
	}
*/
	//#endregion
	
	p.customRedraw = config => {
		console.log("CUSTOM")
		console.log(config. state, config.attribute, config[config.attribute])
		switch(config.state){
			case "INITIALIZE":
				initialize(config)
			break
			
			
			case "UPDATE_VALUE":
				switch(config.attribute){
					case "mode":
						mode = config.mode
					break
					case "sections":
						mdt.setSections(config.sections)
						drawGuides({container: guides, width: p.width, height: p.height, sections: config.sections})
						p.update()
					break
					case "color":
						mdt.color = config.color
					break
					case "strokeWidth":
						mdt.strokeSize = config.strokeWidth
					break
					case "reflect":
						mdt.reflect = config.reflect
					break
					case "correctionAccuracy":
						mdt.sampleSize = config.correctionAccuracy
					break
					case "antialias":
						mdt.antiAlias = config.antialias
					break
					case "showGuides":
						showGuides = config.showGuides
						p.update()
					break
				}
			break
		}
	}
}

export default mandalaSketch