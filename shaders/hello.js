const hello_vs = `

    attribute vec3 aPosition;
    
    void main(){
        
        gl_Position = vec4(aPosition,1.0);
        
    }

`

const hello_fs = `

    precision highp float;
    
    void main(){
    
        gl_FragColor = vec4(1.0,0.0,1.0,0.5);
    
    }
    

`