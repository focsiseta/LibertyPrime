class Light {
    static  structDefinition = `
        
        struct Light{
            
            vec3 position;
            vec3 direction;
            float ambientInt;
            
        }
    
    `
    static counter = 0
    constructor(position, direction, ambientInt = 0.3) {

        this.position = position
        this.direction = direction
        this.ambientInt = ambientInt

    }
}


class DirectionalLight extends Transformations{
    static lightKeep = []


    static includeDirectional(){
        if(DirectionalLight.counter !== 0 ){
            return `
        #define DIRLIGHT `+ DirectionalLight.counter+`        
            struct DirLight{
                float ambInt;
                vec3 color;
                vec3 dir;
            };
            uniform DirLight dirLights[DIRLIGHT];
        vec4 dirlight(DirLight light,vec2 texCoords,vec3 normal,sampler2D albedo,vec3 cameraPos,vec3 fragPos){
            vec4 color = texture2D(albedo,texCoords);
            vec3 N = normalize(normal);
            vec3 lightDir = normalize(-light.dir);
            vec3 viewDirection = normalize(cameraPos - fragPos);
            vec4 ambient = vec4(color.rgb * light.ambInt,1.0);
            
            
            float diff = max(dot(N,lightDir),0.4);
            vec4 diffuse = color * diff;
            
            vec3 halfway = normalize(lightDir + viewDirection);
            float spec = pow(max(dot(halfway,N),0.0),1.0);
                
            vec4 specular = spec * vec4(light.color,1.0) * diffuse;
                
            vec4 finalColor = specular + diffuse + ambient;
            return finalColor;
        }
    `}
        return ""
    }
    static debug_function = `
    
        
        vec4 dirlight(vec2 texCoords,vec3 normal,sampler2D albedo,vec3 fragPos){
             vec4 color = texture2D(albedo,texCoords);
             vec3 lightDir = normalize(vec3(0.0,1.0,0.0));
             vec3 viewDirection = normalize(vec3(0.0,0.0,5.0) - fragPos);
             vec3 normalizedNormal = (normal);
             vec3 HalfwayV = normalize(lightDir + viewDirection); 
             //vec4 ambient = vec4(0.01,0.01,0.01,1.0);
             vec4 ambient = vec4(0.0,0.0,0.0,1.0);
             //Diffuse
             float diffuseFactor = max(dot(lightDir,normalizedNormal),0.4);
             vec4 diffuse = color * diffuseFactor;
             //Specular
             float spec = pow(max(dot(HalfwayV,normalizedNormal),0.0),64.0);
             vec4 specular = vec4(vec3(1.0),1.0) * spec * diffuse;
             return  vec4(( specular + diffuse).rgb,1.0);
            
                //return (ambient + specular + diffuse);
        }
    `
    static counter = 0
    constructor(ambientInt = 0.2,color = [1,1,1],direction = [0,-1,0]) {
        super(Transformations.gimbalT.XYZ)
        this.ambientInt = ambientInt
        this.color = color
        this.direction = direction
        this.idNumber = DirectionalLight.counter
        this.idUniform = "dirLights["+this.idNumber+"]"
        DirectionalLight.counter++
        DirectionalLight.lightKeep.push(this)

    }
    loadLight(shader){
        shader.setUniform1Float(this.idUniform+".ambInt",this.ambientInt)
        shader.setVectorUniform(this.idUniform+".color",this.color)
        shader.setVectorUniform(this.idUniform+".dir",this.direction)
    }
    bindStructUniform(shader){
        shader.bindUniform(this.idUniform+".ambInt")
        shader.bindUniform(this.idUniform+".color")
        shader.bindUniform(this.idUniform+".dir")
    }
    static bindStructUniforms(shader){
        DirectionalLight.lightKeep.forEach((light) =>{
            light.bindStructUniform(shader)
        })

    }
}

class Pointlight extends Transformations{

    static counter = 0
    static lightKeep = []
    constructor(ambientInt = 0.2,color = [1,1,1],position = [0,1,0],LinearK = 0.35,QuadraticK = 0.44) {
        super(Transformations.gimbalT.XYZ)
        this.ambientInt = ambientInt
        this.Kl = LinearK
        this.Kq = QuadraticK
        this.color = color
        this.position = position
        this.idNumber = Pointlight.counter
        this.idUniform = "pointLights[" + this.idNumber + "]"
        Pointlight.counter++
        Pointlight.lightKeep.push(this)
    }
    static includeStruct(){
        if (Pointlight.counter !== 0) {
            return `
        #define POINTLIGHT ` + Pointlight.counter + `        
        #define KC 1.0    
            struct Pointlight{
                float kl;
                float kq;
                float ambInt;
                vec3 color;
                vec3 pos;
            };
            uniform Pointlight pointLights[POINTLIGHT];`
        }

    }
    static includePointlight() {
        if (Pointlight.counter !== 0) {
            return `
        #define POINTLIGHT ` + Pointlight.counter + `        
        #define KC 1.0    
            struct Pointlight{
                float kl;
                float kq;
                float ambInt;
                vec3 color;
                vec3 pos;
            };
            uniform Pointlight pointLights[POINTLIGHT];
        vec4 pointlightChangeSpace(Pointlight light,vec2 texCoords,vec3 normal,sampler2D albedo,vec3 cameraPos,vec3 fragPos,mat3 space){
            vec3 distanceV = light.pos - fragPos;
            vec3 rayDir = space * normalize(distanceV);
            float dist = length(distanceV);
            float attenuation = 1.0 /(KC + light.kl * dist + light.kq * (dist * dist));
            
            vec4 color = texture2D(albedo,texCoords);
            vec3 N = normalize(normal);
            vec3 viewDirection =  space * normalize(cameraPos - fragPos);
            vec4 ambient = vec4(color.rgb * light.ambInt,1.0);
            
            
            float diff = max(dot(N,rayDir),0.4);
            vec4 diffuse = color * diff;
            
            vec3 halfway = normalize(rayDir + viewDirection);
            float spec = pow(max(dot(halfway,N),0.0),10.0);
                
            vec4 specular = spec * vec4(light.color,1.0) * diffuse;
                
            vec4 finalColor = specular + diffuse + ambient;
            return vec4(finalColor.rgb * attenuation ,1.0);
        }
        vec4 pointlight(Pointlight light,vec2 texCoords,vec3 normal,sampler2D albedo,vec3 cameraPos,vec3 fragPos){
            vec3 distanceV = light.pos - fragPos;
            vec3 rayDir = normalize(distanceV);
            float dist = length(distanceV);
            float attenuation = 1.0 /(KC + light.kl * dist + light.kq * (dist * dist));
            
            vec4 color = texture2D(albedo,texCoords);
            vec3 N = normalize(normal);
            vec3 viewDirection = normalize(cameraPos - fragPos);
            vec4 ambient = vec4(color.rgb * light.ambInt,1.0);
            
            
            float diff = max(dot(N,rayDir),0.4);
            vec4 diffuse = color * diff;
            
            vec3 halfway = normalize(rayDir + viewDirection);
            float spec = pow(max(dot(halfway,N),0.0),10.0);
                
            vec4 specular = spec * vec4(light.color,1.0) * diffuse;
                
            vec4 finalColor = specular + diffuse + ambient;
            return vec4(finalColor.rgb * attenuation ,1.0);
        }
    `
        }
    }
    /*
    struct Pointlight{
                float kl;
                float kq;
                float ambInt;
                vec3 color;
                vec3 pos;
            };
     */
        loadLight(shader){
            shader.setUniform1Float(this.idUniform+".kl",this.Kl)
            shader.setUniform1Float(this.idUniform+".kq",this.Kq)
            shader.setUniform1Float(this.idUniform+".ambInt",this.ambientInt)
            shader.setVectorUniform(this.idUniform+".color",this.color)
            shader.setVectorUniform(this.idUniform+".pos",this.position)
        }
        bindStructUniform(shader){
            shader.bindUniform(this.idUniform+".kl")
            shader.bindUniform(this.idUniform+".kq")
            shader.bindUniform(this.idUniform+".ambInt")
            shader.bindUniform(this.idUniform+".color")
            shader.bindUniform(this.idUniform+".pos")
        }

}
/*
class Spotlight extends Transformations{

    static counter = 0
    static lightKeep = []
    constructor(ambientInt = 0.2,color = [1,1,1],direction = [0,-1,0],position = [0,1,0])
    {
        super(Transformations.gimbalT.XYZ)
        this.ambientInt = ambientInt
        this.color = color
        this.position = position
        this.direction = direction
        this.idNumber = Pointlight.counter
        this.idUniform = "spotLights[" + this.idNumber + "]"
        Spotlight.counter++
        Spotlight.lightKeep.push(this)
    }

}
 */