const lightpass_vs = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoords;
    attribute vec3 aTangent;
    
    uniform mat4 uProj;
    uniform mat4 uViewMatrix;
    uniform mat4 uM;
    varying vec2 oTex;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying mat3 vTBN;
    
     mat3 transpose(mat3 inMatrix) {
        highp vec3 i0 = inMatrix[0];
        highp vec3 i1 = inMatrix[1];
        highp vec3 i2 = inMatrix[2];

        highp mat3 outMatrix = mat3(
                 vec3(i0.x, i1.x, i2.x),
                 vec3(i0.y, i1.y, i2.y),
                 vec3(i0.z, i1.z, i2.z)
                 );

        return outMatrix;
    }
    
    void main(){
        oTex = aTexCoords;
        vPos =  vec3((uM * vec4(aPosition,1.0)).xyz);
        vNormal = normalize( uM * vec4(aNormal,0.0)).xyz;
        vec3 T = normalize(vec3(uM * vec4(aTangent,0.0)));
        vec3 B = normalize(cross(T,vNormal));
        vTBN = mat3(T,B,vNormal); 
        gl_Position = uProj * uViewMatrix * uM * vec4(aPosition,1.0);
    }

`
const lightpass_fs = `

    precision highp float;
    #include(pointlight)
    #include(dirlight)
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 oTex;
    varying mat3 vTBN;
    uniform mat4 cameraMatrix;
    uniform vec3 uCameraPos;
    
    uniform sampler2D uAlbedo;
    uniform sampler2D uNormal;
    
    void main(){
       vec3 sampledNormal = normalize(vTBN * (texture2D(uNormal,oTex) * 2.0).xyz - 1.0);
       gl_FragColor = dirlight(dirLights[0],oTex,vNormal,uAlbedo,uCameraPos, vPos);
       //gl_FragColor = vec4(1.0,0.0,1.0,1.0);
    }
`