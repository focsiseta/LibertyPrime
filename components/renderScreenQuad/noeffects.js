const noeffects_vs = `
    
    attribute vec3 aPos;
    attribute vec2 aTex;
    varying vec2 vTex;
    void main(){
        vTex = aTex; 
        gl_Position = vec4(aPos,1.0);
    }
    
`

const noeffect_fs = `

    precision highp float;
    
    uniform sampler2D scene;
    uniform float uTime;
    
    varying vec2 vTex;
    
    void main(){
        vec4 color = texture2D(scene,vec2(vTex.x,vTex.y));
        float average = color.r + color.g + color.b / 3.0;
        gl_FragColor = vec4(vec3(color),1.0);
    
    }

`