function lightpassSetup(c){
    handler = new Input()
    var gl = c.gl
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0,0,0,0.8)
    tea = new Element("tea",teapot.vertices[0].values,"TRIANGLES",teapot.vertices[1].values,teapot.connectivity[0].indices,generateTexCoords(teapot.vertices[0].values.length))
    cassa = new Element("cassa",crateWTexture.vertices[0].values,"TRIANGLES",crateWTexture.vertices[1].values,crateWTexture.connectivity[0].indices,crateWTexture.vertices[3].values)
    circle = new Element("sfera",sphere.vertices[0].values,"TRIANGLES",
        sphere.vertices[1].values,sphere.connectivity[0].indices,generateTexCoords(sphere.vertices[0].values.length))
    c.loadElement(cassa)
    c.loadElement(tea)
    c.loadElement(circle)
    bricks = c.loadTexture("texture/bricks.jpg")
    grass = c.loadTexture("texture/grassTexture.jpg")
    step = c.loadTexture("texture/heightmaps/step.jpg")
    rocks = c.loadTexture("texture/heightmaps/brickheight.jpg")
    var dir = new DirectionalLight(0.3,[0.4,0.4,0.4],[0,0,-1])
    var point = new Pointlight(0.2,[1,1,1],[0,5,0],0.22,0.0019)
    var sourceTest = new ShaderSource(lightpass_fs)
    camera = new Camera([0,0,3])
    let noLight = c.spawnShader(lightpass_vs,sourceTest.source,"noLight")
    noLight.useProgram()
    dir.bindStructUniform(noLight)
    point.bindStructUniform(noLight)
    point.loadLight(noLight)
    dir.loadLight(noLight)
    noLight.setUniform1Int("uAlbedo",0)
    noLight.setUniform1Int("uNormal",1)
    noLight.setEnableAttrFunc((shader) =>{
        var gl = shader.gl
        gl.enableVertexAttribArray(shader["aPosition"])
        gl.enableVertexAttribArray(shader["aTexCoords"])
        gl.enableVertexAttribArray(shader["aNormal"])
        gl.enableVertexAttribArray(shader["aTangent"])

    })
    projMatrix = glMatrix.mat4.perspective(glMatrix.mat4.create(),3.14/4,1300/720,0.15,100)
    noLight.setBindingFunction((shader,drawable) => {
        var gl = shader.gl
        var shape = drawable.shape
        gl.bindBuffer(gl.ARRAY_BUFFER,shape.vBuffer)
        gl.vertexAttribPointer(shader["aPosition"],3,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ARRAY_BUFFER,shape.nBuffer)
        gl.vertexAttribPointer(shader["aNormal"],3,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ARRAY_BUFFER,shape.texCoordBuffer)
        gl.vertexAttribPointer(shader["aTexCoords"],2,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ARRAY_BUFFER,shape.tBuffer)
        gl.vertexAttribPointer(shader["aTangent"],3,gl.FLOAT,false,0,0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,shape.iBuffer)
    })
    noLight.setStaticUniformsFunction((shader) => {
        shader.setMatrixUniform("uProj",projMatrix)
    })
    noLight.setDrawFunction((shader,drawable) => {
        var gl = shader.gl
        var shape = drawable.shape
        camera.processInput(handler)
        shader.setVectorUniform("uCameraPos",camera.getCameraPosition())
        shader.setMatrixUniform("uViewMatrix",camera.getViewMatrix())
        shader.setMatrixUniform("uM",drawable.getFrame())
        gl.drawElements(gl[shape.drawType],shape.indices.length,gl.UNSIGNED_SHORT,0)

    })
    f = new Drawable(tea, new Material(grass,step))
    box = new Drawable(cassa, new Material(bricks,step))
    box.scale([10,10,10])
    box.translate([0,-5,0])
    box.update()
    return noLight
}