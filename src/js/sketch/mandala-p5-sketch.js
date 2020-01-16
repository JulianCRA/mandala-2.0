import MandalaDrawingTool from './MandalaDrawingTool'

const drawGuides = ({container, sections = 32, width = 640, height = 480}) => {
	const horizontalOffset = width * 0.5
	const verticalOffset = height * 0.5

	container.stroke([170, 170, 170, 50])
	container.translate(horizontalOffset, verticalOffset)
	container.noFill()
	container.strokeWeight(2)

	for(let s = 0; s < sections; s++){
		container.rotate(Math.PI * 2 / sections)
		container.line(80, 0, width * 2, 0)
	}

	const constraint = Math.min(width, height)
	container.rect(constraint * -0.5, constraint * -0.5, constraint, constraint)
	container.ellipse(0, 0, constraint, constraint)
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

	let initial
	let mode = modes._FREE_HAND

	p.preload = () => {}
	p.setup = () => {
		canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		canvas.mousePressed(p.pressed)
		//p.mouseReleased = p.released

		// p.touchStarted = p.tStarted
		// p.touchEnded = p.tEnded
		//p.touchMoved = p.tMoved

		mdt = new MandalaDrawingTool({width: p.width, height: p.height, sections: 32})

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

	p.pressed = () => {
		if(mode !== modes._FILL){
			p.mouseDragged = p.dragged
			p.mouseReleased = p.released
			initial = {x:p.mouseX, y:p.mouseY}
			mdt.beginCurve(p.mouseX, p.mouseY)
		}
	}

	p.tStarted = () => {
		console.log('TOUCH')
		if(mode !== modes._FILL){
			p.touchMoved = p.tMoved
			initial = {x:p.mouseX, y:p.mouseY}
			mdt.beginCurve(p.mouseX, p.mouseY)
		}
		//return false
	}

	p.dragged = () => {
		mdt.addVertex(p.mouseX, p.mouseY)
		mdt.drawLine(feedback, mode)
		mode === modes._STRAIGHT ? p.update() : null
		p.image(feedback, 0, 0)
	}

	p.tMoved = () => {
		mdt.addVertex(p.mouseX, p.mouseY)
		mdt.drawLine(feedback, mode)
		mode === modes._STRAIGHT ? p.update() : null
		p.image(feedback, 0, 0)
		//return false
	}

	p.released = () => {
		if(mode !== modes._FILL){
			p.mouseDragged = null
			current.image(feedback, 0, 0)
			mdt.endCurve(p.mouseX, p.mouseY)
		}
		p.update()
	}

	p.tEnded = () => {
		if(mode !== modes._FILL){
			//p.tMoved = null
			current.image(feedback, 0, 0)
			mdt.endCurve(p.mouseX, p.mouseY)
		}
		p.update()
		// return false
	}

	p.customRedraw = config => {
		switch(config.state){
			case "CHANGE_COLOR":
				mdt.color = config.color
			break
			case "SET_MODE":
				mode = config.mode
			break
		}
	}
}

export default mandalaSketch