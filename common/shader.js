class Shader {
    static id_last_draw = "None"
    static last_material = null
    static shader_in_use = "None"
    static shader_counter = 0
    constructor(glContext, vsSource, fsSource,shader_id = null) {
        Shader.shader_counter++
        //DEBUGGING
        this.vsLog = ""
        this.fsLog = ""
        this.uniLog = ""

        if(shader_id == null){
            this.shader_id = "Shader_"+Shader.shader_counter
        }else{
            this.shader_id = shader_id
        }
        this.disableAttributesFunc = null
        this.enableAttributesFunc = null
        this.bindingFuncion = null
        this.drawFunction = null
        this.uniformStaticFunction = null
        this.attributesAreOn = false

        this.vsSource = vsSource
        this.fsSource = fsSource
        this.gl = glContext
        this.textureArray = []
        this.program = this.gl.createProgram()
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(this.vertexShader, this.vsSource)
        this.gl.compileShader(this.vertexShader)
        //DEBUGGING
        this.vsLog = this.gl.getShaderInfoLog(this.vertexShader)
        this.gl.shaderSource(this.fragmentShader, this.fsSource)
        this.gl.compileShader(this.fragmentShader)
        //DEBUGGING
        this.fsLog = this.gl.getShaderInfoLog(this.fragmentShader)

        this.gl.attachShader(this.program, this.vertexShader)
        this.gl.attachShader(this.program, this.fragmentShader)

        this.gl.linkProgram(this.program)
        this.gl.useProgram(this.program)
        this.secondParser(vsSource,fsSource)
        if(this.uniforms !== []){
            this.uniforms.forEach((attribute) =>{
                this.bindUniform(attribute)
            })
        }
        if(this.attributes !== []){
            this.attributes.forEach((element, index) => {
                this.bindAttribute(element, index)
            })
        }
        this.configure = false
    }
    secondParser(vsCode,fsCode){
        let attributes = []
        let uniforms = []
        let linesVS = vsCode.split("\n")
        linesVS.forEach((line) =>{
            if(line.includes("attribute")){
                let subLines = line.split(" ")
                subLines.forEach((sub) =>{
                    if(sub.includes(";")){
                        attributes.push(sub.substring(0,sub.length - 1))

                    }
                })
            }
            if(line.includes("uniform")){
                let subLines = line.split(" ")
                subLines.forEach((sub) =>{
                    if(sub.includes(";")){
                        uniforms.push(sub.substring(0,sub.length - 1))

                    }
                })
            }
        })
        let linesFS = fsCode.split("\n")
        linesFS.forEach((line) =>{
            if(line.includes("uniform")){
                let subLines = line.split(" ")
                subLines.forEach((sub) =>{
                    if(sub.includes(";") && !sub.includes("];")){
                        uniforms.push(sub.substring(0,sub.length - 1))

                    }
                })
            }
        })
        this.uniforms = uniforms
        this.attributes = attributes

    }
    bindToDefaultFramebuffer(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null)
    }
    /*
        this.uniformStaticFunction = null
     */
    setStaticUniformsFunction(func = null){
        if(func != null){
            this.uniformStaticFunction = func
        }
    }
    setStaticUniforms(){
        if(this.uniformStaticFunction != null){
            this.uniformStaticFunction(this)
        }
    }
    setEnableAttrFunc(func = null){
        this.enableAttributesFunc = func
    }
    setDisableAttrFunc(func = null){
        this.disableAttributesFunc = func
    }
    bindShape(drawable){
        if(this.bindingFuncion != null){
            this.bindingFuncion(this,drawable)
        }else{
            console.log("No function for binding shapes is setted")
        }
    }
    enableAttributes(){
        if(this.enableAttributesFunc != null){
            this.enableAttributesFunc(this)
            this.attributesAreOn = true
        }else{
            console.log(this.shader_id + " shader hasn't any function to enable attributes")
        }
    }
    disableAttributes(){
        if(this.disableAttributesFunc != null){
            this.disableAttributesFunc()
            this.attributesAreOn = false
        }else{
            console.log("Can't disable attributes, function is missing\n")
        }
    }
    useProgram(){
        this.gl.useProgram(this.program)
    }
    setDrawFunction(drawFunction = null){
        this.drawFunction = drawFunction
    }
    useDrawFunction(drawable){
        if(this.drawFunction != null){
            this.drawFunction(this,drawable)
        }else{
            console.log(this.shader_id + " Draw function not setted")
        }
    }
    config(){
        if(!this.configure){
            this.enableAttributes()
            this.setStaticUniforms()
            this.configure = true
        }
    }

    draw(drawable){
        var isShaderChanged = Shader.shader_in_use !== this.shader_id
        if(isShaderChanged){
            this.config()
            Shader.shader_in_use = this.shader_id
        }
        if(Shader.id_last_draw !== drawable.shape.id || isShaderChanged){
            this.bindShape(drawable)
            Shader.id_last_draw = drawable.shape.id
        }
        this.useDrawFunction(drawable)


    }
    drawDrawable(toDraw){
        var context = this.gl
        if(Shader.last_material !== null){
            if(Shader.last_material.getId() !== toDraw.material.getId()) {
                Shader.last_material.deactivateMaterial(this)
                toDraw.material.activateMaterial(this)
                Shader.last_material = toDraw.material
            }
        }else{
            Shader.last_material = toDraw.material
            toDraw.material.activateMaterial(this)
        }
        if((Shader.id_last_draw !== toDraw.shape.id) || Shader.shader_in_use !== this.shader_id && !this.attributesAreOn){
            if(this.attributes.includes("aPosition")){
                context.bindBuffer(context.ARRAY_BUFFER, toDraw.shape.vBuffer)
                context.vertexAttribPointer(this["aPosition"],3,context.FLOAT,false,0,0)
            }
            if(this.attributes.includes("aNormal")){
                context.bindBuffer(context.ARRAY_BUFFER, toDraw.shape.nBuffer)
                context.vertexAttribPointer(this["aNormal"],3,context.FLOAT,false,0,0)
            }
            if(this.attributes.includes("aTangent")){
                context.bindBuffer(context.ARRAY_BUFFER,toDraw.shape.tBuffer)
                context.vertexAttribPointer(this["aTangent"],3,context.FLOAT,false,0,0)
            }
            if(this.attributes.includes("aTextureCoord")){
                context.bindBuffer(context.ARRAY_BUFFER, toDraw.shape.texCoordBuffer)
                context.vertexAttribPointer(this["aTextureCoord"],2,context.FLOAT,false,0,0)
                //toDraw.material.activateMaterial(this)
            }
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,toDraw.shape.iBuffer)
            Shader.id_last_draw = toDraw.shape.id
            //Shader.shader_in_use = this.shader_id
        }
        this.setMatrixUniform("uM",toDraw.frame)
        context.uniformMatrix4fv(this['uInvTransGeoMatrix'],false,toDraw.inverseTransposeMatrix)
        context.drawElements(context[toDraw.shape.drawType],toDraw.shape.indices.length,context.UNSIGNED_SHORT,0)

    }
    setBindingFunction(binding_function){
        if(binding_function != null){
            this.bindingFuncion = binding_function
        }
    }
    getContext(){
        return this.gl
    }

    bindAttribute(id, number) {
        this[id] = number
        this.gl.bindAttribLocation(this.program, this[id], id)
    }

    bindUniform(id = null) {
        //Utilizzato per mettere i nomi degli uniform che non vengono parsati dentro lo shader
        if(this.uniforms == null)
            this.uniforms = []
        if(!this.uniforms.includes(id)){
            this.uniforms.push(id)
        }
        this[id] = this.gl.getUniformLocation(this.program, id)
    }

    static parseShaders(vsSource, fsSource) {
        let attrParser = /(?<=attribute\s\w+\s)\w+(?=;)/g
        let unifParser = /(?<=uniform\s\w+\s)\w+(?=;)/g



        let attributes = vsSource.match(attrParser)
        var uniforms = vsSource.match(unifParser)
        var uniforms2 = fsSource.match(unifParser)
        if(uniforms != null && uniforms2 != null){
            uniforms.concat(uniforms2)
            return [attributes, uniforms]
        }else if(uniforms == null && uniforms2 != null){

            return [attributes, uniforms2]
        }else{
            return [attributes, uniforms]
        }

    }

    setMatrixUniform(uniformName, data, transpose=false){
        if(!this.hasOwnProperty(uniformName)){
            this.uniLog+=`Error: ${uniformName} does not exist|`
            return
        }
        this.gl.uniformMatrix4fv(this[uniformName], transpose, data)
    }

    setVectorUniform(uniformName, data){
        this.gl.uniform3fv(this[uniformName],data)
    }
    getUniformValue(uniformName){
        return this.gl.getUniform(this.program,this[uniformName])
    }
    setUniform1Float(uniformName,data){
        this.gl.uniform1f(this[uniformName],data)
    }
    setUniform1Int(uniformName,data){
        this.gl.uniform1i(this[uniformName],data)
    }
}