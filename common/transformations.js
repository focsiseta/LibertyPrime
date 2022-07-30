class Transformations {
    static gimbalT = {
        XYZ:0,
        XZY:1,
        YXZ:2,
        YZX:3,
        ZXY:4,
        ZYX:5,
    }

    constructor(gimbalType = Transformations.gimbalT.XYZ){
        //rotation in radians of local x,y,z axis
        this.dirty = false;
        this.alpha = 0
        this.beta = 0
        this.gamma = 0
        //Local right, up, front vectors
        this.right = glMatrix.vec3.fromValues(1,0,0)
        this.up = glMatrix.vec3.fromValues(0,1,0)
        this.front = glMatrix.vec3.fromValues(0,0,1)

        this.type = gimbalType

        this.rotationMatrix = glMatrix.mat4.create()
        this.scaleMatrix = glMatrix.mat4.create()
        this.translationMatrix = glMatrix.mat4.create()
        //Optimization
        this.frame = glMatrix.mat4.create()
        this.inverseTransposeMatrix = glMatrix.mat4.create()
        this.transformationMatrix = glMatrix.mat4.create()


        //Father frame
        this.fMatrix = glMatrix.mat4.create()

    }
    applyReferenceSpace(space){
        glMatrix.mat4.mul(this.fMatrix,space,this.fMatrix)
    }
    update(){
        //todo
        //Still does some unwanted math, but I have other stuff to write rn
        if(this.dirty){
            console.log("Doing math...")
            this.dirty = false
            this.transformationMatrix = glMatrix.mat4.mul(this.transformationMatrix,this.translationMatrix,this.scaleMatrix)
            //(T * S) = T * S * R
            glMatrix.mat4.mul(this.transformationMatrix,this.transformationMatrix,this.rotationMatrix)
             /******** object frame **************/
            glMatrix.mat4.mul(this.frame,this.fMatrix,this.transformationMatrix)
            /******** Inverse Transpose **************/
            glMatrix.mat4.transpose(this.inverseTransposeMatrix,glMatrix.mat4.invert(this.inverseTransposeMatrix,this.frame))

        }
    }
    //this method is for keeping normal consistency in the shaders. If we have to draw an object with normals, we also need the inverse transposed transf matrix
    getInverseTranspose(){
        return this.inverseTransposeMatrix
    }
    rotationCalc(){

        //BUG gimbal selection doesn't work as intended,rotation don't change
        let tmp1 = glMatrix.mat4.create()
        let rotX = glMatrix.mat4.fromXRotation(glMatrix.mat4.create(),this.alpha)
        let rotY = glMatrix.mat4.fromYRotation(glMatrix.mat4.create(),this.beta)
        let rotZ = glMatrix.mat4.fromZRotation(glMatrix.mat4.create(),this.gamma)
        //Type of gimbal we want gives us different formulas
        switch(this.type) {
            case 0://XYZ
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp1,tmp1 ,rotZ)
                break
            case 1://XZY
                glMatrix.mat4.multiply(tmp1, rotZ, rotX)
                glMatrix.mat4.multiply(tmp1, rotY, tmp1)
                break
            case 2://YXZ
                glMatrix.mat4.multiply(tmp1, rotX, rotY)
                glMatrix.mat4.multiply(tmp1, rotZ, tmp1)
                break
            case 3://YZX
                glMatrix.mat4.multiply(tmp1, rotZ, rotY)
                glMatrix.mat4.multiply(tmp1, rotX, tmp1)
                break
            case 4://ZXY
                glMatrix.mat4.multiply(tmp1, rotX, rotZ)
                glMatrix.mat4.multiply(tmp1, rotY, tmp1)
                break
            case 5://ZYX
                glMatrix.mat4.multiply(tmp1, rotY, rotZ)
                glMatrix.mat4.multiply(tmp1, rotX, tmp1)
                break
            default:
            //return identity
        }

        this.rotationMatrix = tmp1
    }
    //Set of functions to brutally set angles useful for fixing rotation bug
    setAlpha(alpha) { this.alpha = alpha % (Math.PI*2) }
    setBeta(beta) { this.beta = beta % (Math.PI*2) }
    setGamma(gamma) { this.gamma = gamma % (Math.PI*2) }
    //If we use this functions with glMatrix.mat4.mul(this.rotationMatrix,this.rotationMatrix,tmp1) it becomes increasingly faster

    addAlpha(alpha) { this.alpha = (this.alpha + alpha) % (Math.PI*2) }
    addBeta(beta) { this.beta = (this.beta + beta) % (Math.PI*2) }
    addGamma(gamma){ this.gamma = (this.gamma + gamma) % (Math.PI*2) }

    lRotateAlpha(alpha){
        this.dirty = true
        this.addAlpha(alpha)
        this.rotationCalc()
    }
    lRotateBeta(beta){
        this.dirty = true
        this.addBeta(beta)
        this.rotationCalc()
    }
    lRotateGamma(gamma){
        this.dirty = true
        this.addGamma(gamma)
        this.rotationCalc()
    }

    //wRotate* are rotations methods that can be applied to rotate around "real" axis (not relative ones)
    wRotateX(angle){
        this.dirty = true
        glMatrix.mat4.rotateX(this.rotationMatrix,this.rotationMatrix,angle)
    }
    wRotateY(angle){
        this.dirty = true
        glMatrix.mat4.rotateY(this.rotationMatrix,this.rotationMatrix,angle)
    }
    wRotateZ(angle){
        this.dirty = true
        glMatrix.mat4.rotateZ(this.rotationMatrix,this.rotationMatrix,angle)
    }
    translate(translationVector){
        this.dirty = true
        glMatrix.mat4.translate(this.translationMatrix,this.translationMatrix,translationVector)
    }
    scale(scaleVector){
        this.dirty = true
        glMatrix.mat4.scale(this.scaleMatrix,this.scaleMatrix,scaleVector)
    }
    getFrame(){
        //this.update()
        return this.frame
    }
    getTransformation(){
        //this.update()
        return this.transformationMatrix
    }
    getTranslation(){
        //this.update()
        return this.translationMatrix
    }
    getRotation(){
        //this.update()
        return this.rotationMatrix
    }
    setFatherFrame(frame){
        this.dirty = true
        glMatrix.mat4.copy(this.fMatrix,frame)
    }
    getFatherFrame(){
        return this.fMatrix
    }
    setDirty(boolean){
        this.dirty = boolean
    }
    getDirty(){
        return this.dirty
    }


}