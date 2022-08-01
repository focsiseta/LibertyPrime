class Framebuffers{

    constructor(h,w,gl) {
        this.gl = gl
        this.w = w
        this.h = h
        this.framebuffer = gl.createFramebuffer()
        this.texture = gl.createTexture()
        this.depthbuffer = gl.createRenderbuffer()
        gl.bindTexture(gl.TEXTURE_2D,this.texture)
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null)
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.texture,0)
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.depthbuffer)
        if(gl.FRAMEBUFFER_COMPLETE !== gl.checkFramebufferStatus(gl.FRAMEBUFFER))
            console.log("error building framebuffer")
        gl.bindFramebuffer(gl.FRAMEBUFFER,null)
        gl.bindTexture(gl.TEXTURE_2D,null)
        gl.bindRenderbuffer(gl.RENDERBUFFER,null)
    }

    static depthFramebuffer(){

    }

    bind(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer)
        //this.gl.viewport(0,0,this.w,this.h)
    }

    unbind(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer)
    }
}