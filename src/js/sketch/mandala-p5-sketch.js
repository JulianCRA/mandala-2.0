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

	let mode = modes._FREE_HAND

	p.preload = () => {}
	p.setup = () => {
		canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		canvas.mousePressed(p.pressed)

		canvas.touchStarted(p.tStarted)
		canvas.touchEnded(p.tEnded)
		canvas.touchMoved(p.tMoved)

		mdt = new MandalaDrawingTool({width: p.width, height: p.height, sections: 16})

		current = p.createGraphics(p.width, p.height)
		feedback = p.createGraphics(p.width, p.height)
		feedback.stroke(155)

		guides = p.createGraphics(p.width, p.height)
		drawGuides({container: guides, width: p.width, height: p.height})

		p.update()
	}

	p.update = () => {
		p.clear()
		p.image(current, 0, 0)
		p.image(guides, 0, 0)
	}

	/** MOUSE EVENTS */

	p.pressed = () => {
		if(mode !== modes._FILL){
			p.mouseDragged = p.dragged
			p.mouseReleased = p.released
			console.log("MOUSE PRESED")
			mdt.beginCurve(p.mouseX, p.mouseY)
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
			mdt.endCurve(p.mouseX, p.mouseY)
			current.image(feedback, 0, 0)
		}
		p.update()
	}

	/** TOUCH EVENTS */
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

	p.customRedraw = config => {
		switch(config.state){
			case "CHANGE_COLOR":
				mdt.color = config.color
			break
			case "SET_MODE":
				mode = config.mode
			break
			case "SET_SECTIONS":
				console.log(config.sections)
				mdt.setSections(config.sections)
				drawGuides({container: guides, width: p.width, height: p.height, sections: config.sections})
				p.update()
			break
		}
	}
}

export default mandalaSketch