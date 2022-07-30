const nolight_vs = `

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoords;
    uniform mat4 uProj;
    uniform mat4 uViewMatrix;
    uniform mat4 uM;
    varying vec2 oTex;
    varying vec3 vPos;
    varying vec3 vNormal;
    
    void main(){
        oTex = aTexCoords;
        vPos =  vec3((uViewMatrix * uM * vec4(aPosition,1.0)).xyz);
        vNormal = normalize(aNormal);
        gl_Position = uProj * uViewMatrix * uM * vec4(aPosition,1.0);
    }

`

const nolight_fs_variables = `
    precision highp float;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 oTex;
    uniform vec3 uCameraPos;

    uniform sampler2D uAlbedo;
    
`
const nolight_fs_main = `
    precision highp float;
    #include(dirlight)
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 oTex;
    uniform vec3 uCameraPos;

    uniform sampler2D uAlbedo;
    void main(){
       gl_FragColor = dirlight(dirLights[0],oTex,vNormal,uAlbedo,uCameraPos,vPos);
    }
`

const nolight_fs =  `
    
    precision highp float;
    varying vec2 oTex;
    uniform sampler2D uAlbedo;
  

    void main(){
    
        gl_FragColor = vec4(1.0,0.0,1.0,1.0);
        gl_FragColor = texture2D(uAlbedo,oTex);
    }

`