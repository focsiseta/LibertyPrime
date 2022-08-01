function main(){
    c = new Context()
    let gl = c.gl
    newTarget = new Framebuffers(600,1300,c.gl)
    lightShader = lightpassSetup(c)
    //lightShader.useProgram()
    screenShader = flatQuadST(c)
    //screenShader.useProgram()
    sfera = new Drawable(circle,new Material(grass,bricks))
    dQuad = new Drawable(quad,new Material(bricks,step))
    dQuad.translate([0,0,2])
    dQuad.update()
    scQuad = new Drawable(quad)
    drawLoop()

}

function drawLoop(){
    let gl = c.gl
    lightShader.useProgram()
    gl.enable(gl.DEPTH_TEST)
    gl.bindFramebuffer(gl.FRAMEBUFFER,newTarget.framebuffer)
    gl.clearColor(0,0,1,0.8)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    dQuad.material.bindAlbedo(lightShader)
    dQuad.material.bindNormal(lightShader)
    lightShader.draw(dQuad)
    dQuad.wRotateX(gradToRad(1))
    dQuad.update()
    screenShader.useProgram()
    screenShader.bindToDefaultFramebuffer()
    gl.disable(gl.DEPTH_TEST)
    gl.clearColor(1,0,1,0.8)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D,newTarget.texture)
    screenShader.draw(scQuad)





  window.requestAnimationFrame(drawLoop)

}

main()