import DrawPanel from '../ui/DrawPanel/DrawPanel'

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

const huh = args => {
	console.log(args)
}

const mandalaSketch = p => {
	let guides

	p.preload = () => {}
	p.setup = () => {
		p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		p.mouseDragged = huh
		p.mouseClicked = () => console.log("click")

		guides = p.createGraphics(p.width, p.height)
		drawGuides({container: guides, width: p.width, height: p.height})
		p.image(guides, 0, 0)
	}
}

export default mandalaSketch