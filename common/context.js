class Context {
    constructor(canvasID = "OUT",typeOfContext = "webgl2") {
        var canvas = document.getElementById(canvasID)
        this.gl = WebGLDebugUtils.makeDebugContext(canvas.getContext(typeOfContext))
        this.gl.getExtension('OES_standard_derivatives')
    }
    loadElement(element = null){
        if(element == null){
            console.log("Element to load is null")
            return
        }
        var gl = this.gl
        element.vBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,element.vBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,element.vertices,gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER,null)

        if(element.hasNormals){
            element.nBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER,element.nBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,element.normals,gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER,null)
        }
        if(element.hasIndices){
            element.iBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,element.iBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,element.indices,gl.STATIC_DRAW)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null)
        }
        if(element.hasTexture){
            element.texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER,element.texCoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,element.texCoords,gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER,null)
        }
        if(element.hasNormals && element.hasTexture && element.hasIndices){
            element.tBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER,element.tBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,element.tangents,gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER,null)
        }


    }
    loadTexture(texturePath = null){
        if(texturePath == null){
            console.log("Texture path can't be null")
            return
        }
        var gl = this.gl
        var texture = new Texture(texturePath,gl)
        return texture
        //load texture and return a texture element
    }
    //because createShader was used by something in webgl debug
    spawnShader(vsSource = null,fsSource = null,shaderID = null){
        if(vsSource == null || fsSource == null){
            console.log("you can't have null sources")
            return
        }
        var shader = new Shader(this.gl,vsSource,fsSource,shaderID)
        return shader
    }
}