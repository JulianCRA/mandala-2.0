class MandalaDrawingTool {
	constructor({sections, width, height, color, reflect, antialias, strokeWidth, correctionAccuracy}){
        this.points = []
        this.sections = sections
        this.angleIncrement = Math.PI * 2 / sections

        this.verticalOffset = height * 0.5
        this.horizontalOffset = width * 0.5

        this.color = color
        this.reflect = reflect
        this.antiAlias = antialias
        this.strokeSize = strokeWidth
        this.sampleSize = correctionAccuracy
    }
    
    setSections(s){
        this.sections = s
        this.angleIncrement = Math.PI * 2 / s
    }

    fillArea({xpos, ypos, currentDrawing, placeHolder, newColor = this.color}){
        const initialColor = currentDrawing.get(xpos, ypos)
    
        function matchWithInitial(color){
            return(
                initialColor[0] === color[0] && 
                initialColor[1] === color[1] && 
                initialColor[2] === color[2] && 
                initialColor[3] === color[3]
            )
        }
        
        if(matchWithInitial(newColor))
            return false

        let pixStack = [{x:Math.round(xpos), y:Math.round(ypos)}]
        let leftSideHasBeenChecked
        let rightSideHasBeenChecked

        placeHolder.clear()
        currentDrawing.loadPixels()
        placeHolder.loadPixels()
        
        while(pixStack.length > 0){
            let pixel = pixStack.pop()
            leftSideHasBeenChecked = false
            rightSideHasBeenChecked = false
            
            while(pixel.y >= 0){
                pixel.y--
                const pixelPosition = (pixel.y * placeHolder.width + pixel.x) * 4
                if(!matchWithInitial([
                    currentDrawing.pixels[pixelPosition], 
                    currentDrawing.pixels[pixelPosition + 1], 
                    currentDrawing.pixels[pixelPosition + 2], 
                    currentDrawing.pixels[pixelPosition + 3]
                ])) break
            }

            while(pixel.y < placeHolder.height - 1){
                pixel.y++;
                const pixelPosition = (pixel.y * placeHolder.width + pixel.x) * 4
                if(!matchWithInitial([
                    currentDrawing.pixels[pixelPosition], 
                    currentDrawing.pixels[pixelPosition + 1], 
                    currentDrawing.pixels[pixelPosition + 2], 
                    currentDrawing.pixels[pixelPosition + 3]
                ])) break

                placeHolder.pixels[pixelPosition] = this.color[0]
                placeHolder.pixels[pixelPosition+1] = this.color[1]
                placeHolder.pixels[pixelPosition+2] = this.color[2]
                placeHolder.pixels[pixelPosition+3] = this.color[3]

                currentDrawing.pixels[pixelPosition] = this.color[0]
                currentDrawing.pixels[pixelPosition+1] = this.color[1]
                currentDrawing.pixels[pixelPosition+2] = this.color[2]
                currentDrawing.pixels[pixelPosition+3] = this.color[3]

                if(pixel.x > 0){
                    let pixelPosition = (pixel.y * placeHolder.width + (pixel.x - 1)) * 4
                    if(matchWithInitial([
                        currentDrawing.pixels[pixelPosition], 
                        currentDrawing.pixels[pixelPosition + 1], 
                        currentDrawing.pixels[pixelPosition + 2], 
                        currentDrawing.pixels[pixelPosition + 3]
                        ])
                    ){
                        if(!leftSideHasBeenChecked){
                            pixStack.push({x:(pixel.x - 1), y:pixel.y})
                            leftSideHasBeenChecked = true
                        }
                    }
                    else{
                        if(leftSideHasBeenChecked) leftSideHasBeenChecked = false
                    }
                }

                if(pixel.x < placeHolder.width - 1){
                    let pixelPosition = (pixel.y * placeHolder.width + (pixel.x + 1)) * 4
                    if(matchWithInitial([
                        currentDrawing.pixels[pixelPosition], 
                        currentDrawing.pixels[pixelPosition + 1], 
                        currentDrawing.pixels[pixelPosition + 2], 
                        currentDrawing.pixels[pixelPosition + 3]
                        ])
                    ){
                        if(!rightSideHasBeenChecked){
                            pixStack.push({x:(pixel.x + 1), y:pixel.y})
                            rightSideHasBeenChecked = true
                        }
                    }
                    else{
                        if(rightSideHasBeenChecked) rightSideHasBeenChecked = false
                    }
                }
            }
        }

        placeHolder.updatePixels()
        //currentDrawing.updatePixels()
    }

    addVertex(xCoord, yCoord){
        this.points.push({x: xCoord - this.horizontalOffset, y:yCoord - this.verticalOffset})
    }

	beginLine(initialX, initialY){
        this.points = []
        this.addVertex(initialX, initialY)
    }

    endLine(finalX, finalY){
		this.addVertex(finalX, finalY)
    }

    drawLine(container, mode){
        mode === 1 ? container.clear() : null
        
        container.push()
        container.strokeWeight(this.strokeSize)
        container.stroke([this.color[0]*0.75, this.color[1]*0.75, this.color[2]*0.75])
        container.translate(container.width/2, container.height/2)
        const final = this.points.length-1
        const initial = mode === 0 ? final-1 : 0
        
        for(let s = 0; s < this.sections; s++){
            container.push()
            container.rotate(s * this.angleIncrement)
            if(this.reflect && s%2 != 0){
                container.rotate(this.angleIncrement)
                container.scale(1, -1)
            }
            container.line(this.points[initial].x, this.points[initial].y, this.points[final].x, this.points[final].y)
            container.pop()
        }
        container.pop()
    }

    applyLineCorrection(placeHolder, mode){
        let totalSamples = Math.ceil((this.sampleSize * this.points.length)-1)
        let samples = [this.points[0]]
        if(mode === 0)
            for(let i = 0; i < totalSamples; i++)
                samples.push(this.points[Math.floor(i*this.points.length/totalSamples)])
        samples.push(this.points[this.points.length-1])
        
        placeHolder.clear()
        placeHolder.stroke(this.color)
        placeHolder.strokeWeight(this.strokeSize)
        placeHolder.strokeCap("round")
        placeHolder.strokeJoin("round")
        placeHolder.noFill()
        
        const final = samples.length-1
        for(let s = 0; s < this.sections; s++){
            placeHolder.push()
            placeHolder.translate(placeHolder.width/2, placeHolder.height/2)
            placeHolder.rotate(s * this.angleIncrement)

            if(this.reflect && s%2 != 0){
                placeHolder.rotate(this.angleIncrement)
                placeHolder.scale(1, -1);
            }

            placeHolder.beginShape()
            if(samples.length <= 2) placeHolder.curveVertex(samples[0].x, samples[0].y)
            for(let i = 0; i < samples.length; i++){
                placeHolder.curveVertex(samples[i].x, samples[i].y)
            }
            placeHolder.curveVertex(samples[final].x, samples[final].y)
            placeHolder.endShape()

            placeHolder.pop()
        }

        if(!this.antiAlias){
            placeHolder.loadPixels()
            for (let i = 3; i < placeHolder.pixels.length; i += 4) 
                if(placeHolder.pixels[i] != 0)
                    placeHolder.pixels[i] = 255                    
            placeHolder.updatePixels()
        }
        
    }
    
}

export default MandalaDrawingTool