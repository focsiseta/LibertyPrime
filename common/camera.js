class Camera extends Transformations{
    constructor(position = [0,0,5],gimbalType = Transformations.gimbalT.XYZ) {
        super(gimbalType)
        //Position is used only to save the first position of the camera itself, for camera position use getActualPosition
        this.speed = 0.3
        this.resetPosition = position
        //euler rotation (careful about gimbal lock)
        //this.viewMatrix = glMatrix.mat4.create()
        this.translate(this.resetPosition)
        this.transformationMatrix = this.getTransformation()
    }
// method for passing the inverted viewFrame to the shader
    getViewMatrix(){
        this.update()
        var tmp = glMatrix.mat4.create()
        //glMatrix.mat4.mul(tmp,this.translationMatrix,this.rotationMatrix)
        glMatrix.mat4.invert(tmp,this.frame)
        return tmp
    }
    resetCamera(){
        this.rotationMatrix = glMatrix.mat4.create()
        this.scaleMatrix = glMatrix.mat4.create()
        this.translationMatrix = glMatrix.mat4.create()
        this.viewMatrix = glMatrix.mat4.create()
        this.alpha=0
        this.beta=0
        this.gamma=0
        this.translate(this.resetPosition)
    }

    getCameraPosition(){
        var matrix = this.frame
        return [matrix[12],matrix[13],matrix[14]]
    }
    getCameraDirection(){
        var matrix = this.frame
        //d vector
        return [matrix[8],matrix[9],matrix[10]]
        //glMatrix.vec3.normalize(this.direction,this.direction)


    }

    processInput(inputHandler) {
        /*
        il cross product e' invertito perche' per come funziona la telecamera e' il mondo che ci
        viene incontro quindi se deve sembrare che stiamo andando a sinistra,il mondo andra' alla nostra destra

        Stesso principio si applica per quando si va avanti o indietro
        Per andare avanti il mondo si sta spostando vicino a noi, mantre tornare indietro il mondo si deve allontanare

        Sottosopra il verso di destra e sinistra viene invertito, cercare di sistemare questo problema con una
        flag per invertire  vorrebbe dire che dopo una certo angolo di rotazione Z dovremmo cambiare il verso e questo
        puo' non essere sempre la soluzione piu' corretta
        */

        /*funzione ausiliaria per mantenere il codice pulito: esegue il corpo degli if nei casi della traslazione
        a,b,c sono gli elementi da estrarre dalla matrice nelle operazioni, flag se va invertito il segno della velocità*/

        var rotation = glMatrix.quat.create()
        let translationOps = (a,b,c,flag) => {
            let tmp = glMatrix.mat4.create()
            glMatrix.mat4.invert(tmp,this.getViewMatrix())
            let vector = glMatrix.vec3.fromValues(tmp[a],tmp[b],tmp[c])
            glMatrix.vec3.scale(vector,vector,flag?-this.speed:this.speed)

            this.translate(vector)
        }

        if(inputHandler.getKeyStatus('w') === true) {translationOps(8,9,10, true)}
        if(inputHandler.getKeyStatus('s') === true) {translationOps(8,9,10,false)}
        if(inputHandler.getKeyStatus('a') === true) {translationOps(0,1,2,  true)}
        if(inputHandler.getKeyStatus('d') === true) {translationOps(0,1,2, false)}

        if(inputHandler.getKeyStatus('i') === true){this.lRotateAlpha(gradToRad( 2))}
        if(inputHandler.getKeyStatus('k') === true){this.lRotateAlpha(gradToRad(-2))}

        if(inputHandler.getKeyStatus('l') === true){this.lRotateBeta(gradToRad(-2))}
        if(inputHandler.getKeyStatus('j') === true){this.lRotateBeta(gradToRad( 2))}

        if(inputHandler.getKeyStatus('n') === true){this.lRotateGamma(gradToRad( 2))}
        if(inputHandler.getKeyStatus('m') === true){this.lRotateGamma(gradToRad(-2))}

        /*if(inputHandler.getKeyStatus('u') === true){
            this.translate([0,0.05,0])
        }*/
        /*if(inputHandler.getKeyStatus('h') === true){
            this.translate([0,-0.05,0])
        }*/



        if(inputHandler.getKeyStatus('p') === true){
            this.getCameraPosition()
            this.resetCamera()
        }

    }


}