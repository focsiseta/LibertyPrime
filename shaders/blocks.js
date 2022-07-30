const variables = `
    
            attribute vec3 aPosition;
            attribute vec2 aTexCoords;
            uniform mat4 uProj;
            uniform mat4 uViewMatrix;
            uniform mat4 uM;
            varying vec2 oTex;
    
    `

const  structDefinition = `
        
        struct Light{
            
            vec3 position;
            vec3 direction;
            float ambientInt;
            
        }
    
    `

const functions = `

    vec4 pointColor(Light light,vec2 texCoords,vec3 normal,vec3 cameraPos, vec3 fragPos){
        vec4 albedoColor = texture2D(uAlbedo,texCoords);
        vec3 rayDir = normalize(light.position - fragPos);
        vec3 viewDir = normalize(cameraPos - fragPos);
        vec3 Halfway = normalize(rayDir + viewDir);
        vec3 N = normalize(normal);
        
        float diff = max(dot(normal,rayDirection),0.0);
        vec4 diffuse = (albedoColor * diff);
        
        float spec = max(pow(dot(Halfway,N),25.),0.0);
        vec4 specular = (albedoColor * spec);
        
        vec4 ambient = light.ambientInt * albedoColor;
        
        return ambient + diffuse + specular;
        
        
    }

`