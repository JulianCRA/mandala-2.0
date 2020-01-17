class MandalaDrawingTool {
	constructor({sections, width, height}){
        this.points = []
        this.sections = sections
        this.angleIncrement = Math.PI * 2 / sections

        this.verticalOffset = height * 0.5
        this.horizontalOffset = width * 0.5

        this.color = [255, 255, 255, 255]

        this.reflect = true
    }
    
    setSections(s){
        this.sections = s
        this.angleIncrement = Math.PI * 2 / s
        console.log('DAFUQ')
    }

    addVertex(xCoord, yCoord){
        this.points.push({x: xCoord - this.horizontalOffset, y:yCoord - this.verticalOffset})
    }

	beginCurve = (initialX, initialY) => {
        this.points = []
        this.addVertex(initialX, initialY)
    }

    endCurve(finalX, finalY){
		this.addVertex(finalX, finalY)
    }

    drawLine(container, mode){
        mode === 1 ? container.clear() : null
        
        container.push()
        //container.strokeWeight(this.strokeSize);
        container.stroke(this.color)
        container.translate(container.width/2, container.height/2)
        const final = this.points.length-1
        const initial = mode === 0 ? final-1 : 0
        
        for(let s = 0; s < this.sections; s++){
            container.push()
            container.rotate(s * this.angleIncrement)
            container.stroke(this.color)
            if(this.reflect && s%2 != 0){
                container.rotate(this.angleIncrement)
                container.scale(1, -1)
            }
            container.line(this.points[initial].x, this.points[initial].y, this.points[final].x, this.points[final].y)
            container.pop()
        }
        container.pop()
    }

    
}

export default MandalaDrawingTool