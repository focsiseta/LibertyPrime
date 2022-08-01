function flatQuadST(c = new Context()){
    let gl = c.gl
    gl.clearColor(0,0,0,0.8)
    /* for drawArray you need to load this
    *     quad = new Element("quad",[-1, 1, 0, -1, -1, 0, 1, -1, 0,1, -1, 0, 1, 1, 0,-1, 1, 0,])
    * */
    quad = new Element("quad",[-1, 1, 0,
                                            -1, -1, 0,
                                            1, -1, 0,
                                            1, 1, 0],
        "TRIANGLES",[0,1,0,
            0,1,0,
            0,1,0
            ,0,1,0],
        [2,1,0,2,3,0],
        [0, 1, 0, 0, 1, 0, 1, 1])
    c.loadElement(quad)
    let vertexShader = new ShaderSource(noeffects_vs)
    let fragmentShader = new ShaderSource(noeffect_fs)
    let startDate = new Date().getTime()
    let noeffectShader = c.spawnShader(vertexShader.source,fragmentShader.source,"noeffect")
    noeffectShader.setEnableAttrFunc((shader) =>{
        let gl = shader.gl
        gl.enableVertexAttribArray(shader["aPosition"])
        gl.enableVertexAttribArray(shader["aTex"])
    })
    noeffectShader.setBindingFunction((shader,drawable) =>{
        var gl = shader.gl
        gl.bindBuffer(gl.ARRAY_BUFFER,drawable.shape.vBuffer)
        gl.vertexAttribPointer(shader["aPosition"],3,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ARRAY_BUFFER,drawable.shape.texCoordBuffer)
        gl.vertexAttribPointer(shader["aTex"],2,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,drawable.shape.iBuffer)
    })
    noeffectShader.setDrawFunction((shader,drawable) =>{
        let gl = shader.gl
        //gl.drawArrays(drawable.drawType,drawable.vBuffer,3)
        console.log((new Date().getTime() - startDate) / 10000)
        shader.setUniform1Float("uTime", (new Date().getTime() - startDate) / 10000)
        gl.drawElements(gl[drawable.shape.drawType],drawable.shape.indices.length,gl.UNSIGNED_SHORT,0)
    })
    noeffectShader.useProgram()
    noeffectShader.setUniform1Int("scene",0)
    return noeffectShader
}