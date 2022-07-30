function main(){
    c = new Context()
    let gl = c.gl
    newTarget = new Framebuffers(600,1300,c.gl)
    gl.activeTexture(gl.TEXTURE0)
    lightShader = lightpassSetup(c)
    lightShader.useProgram()
    lightShader.setUniform1Int("uAlbdeo",0)
    screenShader = flatQuadST(c)
    screenShader.useProgram()
    screenShader.setUniform1Int("scene",0)
    dQuad = new Drawable(quad,new Material(bricks))
    drawLoop()

}

function drawLoop(){
    let gl = c.gl
    lightShader.useProgram()
    gl.enable(gl.DEPTH_TEST)
    newTarget.bind()
    gl.clearColor(0,0,0,0.8)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.bindTexture(gl.TEXTURE_2D,f.material.albedoTexture.textureBuffer)
    lightShader.draw(f)
    gl.disable(gl.DEPTH_TEST)
    screenShader.bindToDefaultFramebuffer()
    gl.clear(gl.COLOR_BUFFER_BIT)
    screenShader.useProgram()
    gl.bindTexture(gl.TEXTURE_2D,newTarget.texture)
    screenShader.draw(dQuad)






    //screenQuadShader.useProgram()
    //screenQuadShader.draw(dQuad)



   window.requestAnimationFrame(drawLoop)

}

main()