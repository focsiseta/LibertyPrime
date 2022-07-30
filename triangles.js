function main(){
    c = new Context()
    helloShader = c.spawnShader(hello_vs,hello_fs,"hello")
    triangle = new Element("triangle",[1,1,0,0,0,0,1,0,0],"TRIANGLES")
    var wholeScreen = [
        -1, 1, 0.0,-1, -1, 0.0, // right
        1, 1, 0.0,  -1, -1, 0.0, // left
        1, -1, 0.0, 1, 1, 0.0] // top  ]
    quad = new Element("quad",wholeScreen)
    c.loadElement(triangle)
    c.loadElement(quad)
    var gl = c.gl
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0,0,0,0.8)
    helloShader.setEnableAttrFunc((shader) => {
        var gl = shader.gl
        gl.enableVertexAttribArray(shader["aPosition"])
    })
    helloShader.setBindingFunction((shader,drawable)=>{
        var gl = shader.gl
        gl.bindBuffer(gl.ARRAY_BUFFER,drawable.shape.vBuffer)
        gl.vertexAttribPointer(shader["aPosition"],3,gl.FLOAT,false,0,0)
    })
    helloShader.setDrawFunction((shader,drawable) =>{
        if(drawable != null){
            var gl = shader.gl
            gl.drawArrays(gl[drawable.shape.drawType],0,drawable.shape.vertices.length / 3)
        }
    })

    dr = new Drawable(triangle)
    q = new Drawable(quad)
    helloShader.useProgram()
    drawLoop()
}
function drawLoop(){
    var gl = c.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    helloShader.draw(q)
    helloShader.draw(dr)
    //window.requestAnimationFrame(drawLoop)
}
main()