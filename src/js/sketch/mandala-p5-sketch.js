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
	let layers
	let buffer

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

	let activeMouse = false
	let activeTouch = false
	
	function initialize(config){
		color = config.color
		mode = config.mode
		sections = config.sections
		correctionAccuracy = config.correctionAccuracy
		strokeWidth = config.strokeWidth
		reflect  = config.reflect
		showGuides = config.showGuides
		antialias =  config.antialias

		layers = []
		buffer = []
	}

	p.preload = () => {}
	p.setup = () => {
		canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		//p.pixelDensity(1)

		canvas.mousePressed(p.pressed)
		canvas.touchStarted(p.tStarted)

		mdt = new MandalaDrawingTool({width: p.width, height: p.height, color, sections, reflect, antialias, strokeWidth, correctionAccuracy})

		current = p.createGraphics(p.width, p.height)
		feedback = p.createGraphics(p.width, p.height)

		guides = p.createGraphics(p.width, p.height)
		drawGuides({container: guides, width: p.width, height: p.height, sections:sections})

		update()
	}

	//#region MOUSE EVENTS

	p.pressed = () => {
		console.log("M PRESS")
		p.mouseReleased = p.released
		activeMouse = true
		if(mode !== modes._FILL){
			p.mouseDragged = p.dragged
			
			feedback.clear()
			mdt.beginLine(p.mouseX, p.mouseY)
		}
	}

	p.dragged = () => {
		mdt.addVertex(p.mouseX, p.mouseY)
		mdt.drawLine(feedback, mode)
		mode === modes._STRAIGHT ? update() : null
		p.image(feedback, 0, 0)
	}

	p.released = () => {
		if(activeMouse){
			if(mode !== modes._FILL){
				p.mouseDragged = null
				p.mouseReleased = null
				mdt.endLine(p.mouseX, p.mouseY)
				mdt.applyLineCorrection(feedback, mode)
				current.image(feedback, 0, 0)
			}else{
				mdt.fillArea({xpos:p.mouseX, ypos:p.mouseY, currentDrawing:current, placeHolder:feedback})
			}
			addLayer()
			activeMouse = false
		}	
	}
	//#endregion

	//#region TOUCH EVENTS	
	
	p.tStarted = (event) => {
		canvas.touchEnded(p.tEnded)
		activeTouch = true
		if(mode !== modes._FILL){
			canvas.touchMoved(p.tMoved)
			
			feedback.clear()
			const touch = event.changedTouches[0]
			mdt.beginLine(touch.pageX, touch.pageY)
		}
		return false
	}
	
	p.tMoved = (event) => {
		event.preventDefault()
		if(mode !== modes._FILL){
			mdt.addVertex(p.mouseX, p.mouseY)
			mdt.drawLine(feedback, mode)
			mode === modes._STRAIGHT ? update() : null
			p.image(feedback, 0, 0)
		}
		return false
	}

	p.tEnded = (event) => {
		if(activeTouch){
			if(mode !== modes._FILL){
				p.mouseDragged = null
				p.mouseReleased = null
				mdt.endLine(p.mouseX, p.mouseY)
				mdt.applyLineCorrection(feedback, mode)
				current.image(feedback, 0, 0)
			}else{
				const touch = event.changedTouches[0]
				mdt.fillArea({xpos:touch.pageX, ypos:touch.pageY, currentDrawing:current, placeHolder:feedback})

			}
			addLayer()
			activeTouch = false
		}
		event.preventDefault()
		return false
	}

	//#endregion
	
	function update(){
		p.clear()
		p.image(current, 0, 0)
		if(showGuides)
			p.image(guides, 0, 0)
	}

	function addLayer(){
		layers.push({graphics:feedback.drawingContext.canvas.toDataURL("image/png"), mode:mode})
		current.image(feedback, 0, 0)
		buffer.push(current.drawingContext.canvas.toDataURL("image/png"))
		
		update()
	}

	function undo(){
		current.clear()
		layers.pop()
		buffer.pop()
		if(layers.length <= 0) {
			update()
			return
		}	
		
		p.loadImage(
			buffer[buffer.length - 1], 
			img => {
				current.image(img, 0, 0, p.width, p.height)
				update()
			}
		)
	}

	function clear(){
		layers = []
		buffer = []
		current.clear()
		update()
	}

	function save({linesOnly, blackLines, forcedAlias}){
		let curves
		let temporaryCanvas		
			
		if(linesOnly){
			curves = layers.filter( layer => layer.mode != 2 )
			temporaryCanvas = p.createGraphics(p.width, p.height)
			for(let i = 0; i < curves.length; i++)
				p.loadImage(
					curves[i].graphics, 
					img => {
						temporaryCanvas.image(img, 0, 0)
						if(i === curves.length - 1)
							applyFilters()
					}
				)
		}else{
			p.saveCanvas(current, "mandala.png")
		}

		function applyFilters(){
			if(forcedAlias || blackLines){
				temporaryCanvas.loadPixels()
				for (let i = 0; i < temporaryCanvas.pixels.length; i += 4) {
					if(temporaryCanvas.pixels[i+3] !== 0){
						if(blackLines){
							temporaryCanvas.pixels[i] = 0
							temporaryCanvas.pixels[i+1] = 0
							temporaryCanvas.pixels[i+2] = 0
						}
						if(forcedAlias)
							temporaryCanvas.pixels[i+3] = 255
					}
				}		
				temporaryCanvas.updatePixels()
			}

			p.saveCanvas(temporaryCanvas, "mandala.png")
		}
	}

	p.customRedraw = config => {
		switch(config.state){
			case "INITIALIZE":
				initialize(config)
			break
			case "UNDO":
				undo()
			break
			case "CLEAR":
				clear()
			break
			case "SAVE":
				save(config)
			break 
			case "UPDATE_VALUE":
				switch(config.attribute){
					case "mode":
						mode = config.mode
					break
					case "sections":
						mdt.setSections(config.sections)
						drawGuides({container: guides, width: p.width, height: p.height, sections: config.sections})
						update()
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
						update()
					break
				}
			break
		}
	}
}

export default mandalaSketch