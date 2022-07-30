class Texture {
    static counter = 0
    constructor(texturePath = null,gl) {
        this.gl = gl
        if(texturePath != null){
            this.id = texturePath
            let image = new Image()
            image.src = texturePath
            this.textureUnit = Texture.counter
            Texture.counter++
            image.addEventListener('load',function(){
                this.textureBuffer = gl.createTexture();
                //gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
                gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    // Yes, it's a power of 2. Generate mips.
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    // No, it's not a power of 2. Turn off mips and set
                    // wrapping to clamp to edge
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                gl.bindTexture(gl.TEXTURE_2D, null);
            }.bind(this));
        }else{
            console.log("No path has been used for texture loading")
        }
        this.gl.bindTexture(gl.TEXTURE_2D,null)
    }
    bind(){
        //this.gl.activeTexture(this.gl.TEXTURE0 + this.textureUnit)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBuffer)
    }
    unbind(){
        this.gl.activeTexture(this.gl.TEXTURE0 + this.textureUnit)
        this.gl.bindTexture(this.gl.TEXTURE_2D,null)
    }
}

class Material{
    static counter = 0
    constructor(albedoTexture = null,normalMap = null) {
        this.hasAlbedo = albedoTexture != null
        this.albedoTexture = albedoTexture
        this.hasNormalMap  = normalMap != null
        this.normalMap = normalMap
        this.id = "Material_"+Material.counter
        Material.counter++
    }
    bindMaterial(shader) {
        if (this.hasAlbedo) {
            this.albedoTexture.bind()
            shader.setUniform1Int("uAlbedo",this.albedoTexture.textureUnit)
        }
        if (this.hasNormalMap) {
            this.normalMap.bind()
            shader.setUniform1Int("uNormal",this.normalMap.textureUnit)
        }
    }
    deactivate(){
        if (this.hasAlbedo)
            this.albedoTexture.unbind()
        if (this.hasNormalMap)
            this.normalMap.unbind()
    }

}