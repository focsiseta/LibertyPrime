
function identity(){
    var F = glMatrix.mat4.create()
    return glMatrix.mat4.identity(F)
}
function vec3add( v3,i,rs){
    v3[i*3] 	+= rs[0];
    v3[i*3+1] += rs[1];
    v3[i*3+2] += rs[2];
}
function gradToRad(number){
    return number *  Math.PI/200
}
function vec3eq( v3,i,rs){
    v3 [i*3] 	  = rs [0];
    v3 [i*3+1]  = rs [1];
    v3 [i*3+2]  = rs [2];
}
//Thanks prof
function ComputeNormals(vertexArray, indexArray){

    var nv = vertexArray.length/3;
    var nt = indexArray.length/ 3;

    normalArray = new Float32Array(nv*3);
    var star_size = new Float32Array(nv);

    for( var i = 0 ; i  < nv; ++i){
        star_size[i] = 0;
        normalArray[3*i] = 0.0;
        normalArray[3*i+1] = 0.0;
        normalArray[3*i+2] = 0.0;
    }

    for( var i = 0 ; i  < nt; ++i){
        var i_v  = [ indexArray[i*3+0], 	indexArray[i*3+1], 	indexArray[i*3+2]];

        var p0 = [vertexArray[3*i_v[0]+0],vertexArray[3*i_v[0]+1],vertexArray[3*i_v[0]+2]];
        var p1 = [vertexArray[3*i_v[1]+0],vertexArray[3*i_v[1]+1],vertexArray[3*i_v[1]+2]];
        var p2 = [vertexArray[3*i_v[2]+0],vertexArray[3*i_v[2]+1],vertexArray[3*i_v[2]+2]];

        var p01 = glMatrix.vec3.sub(glMatrix.vec3.create(),p1,p0);
        var p02 = glMatrix.vec3.sub(glMatrix.vec3.create(),p2,p0);
        var n = glMatrix.vec3.cross(glMatrix.vec3.create(),p02,p01);

        n = glMatrix.vec3.normalize(n,n);

        vec3add(normalArray,i_v[0],n);
        vec3add(normalArray,i_v[1],n);
        vec3add(normalArray,i_v[2],n);

        star_size[i_v[0]] += 1;
        star_size[i_v[1]] += 1;
        star_size[i_v[2]] += 1;
    }
    for( var i = 0 ; i  < nv; ++i){
        var n = [ normalArray[ 3*i],	normalArray[ 3*i+1],	normalArray[ 3*i+2] ];

        glMatrix.vec3.mul(n,n,[1.0/star_size[i],1.0/star_size[i],1.0/star_size[i]]);
        n = glMatrix.vec3.normalize(n,n);

        vec3eq(normalArray,i,[-n[0],-n[1],-n[2]]);
    }

    //obj.numVertices = nv;
    //obj.numTriangles = obj.indexs.length/3;
    return normalArray;
};



const cyVertexGen = function (resolution) {
    let angle = 0
    let step = (Math.PI*2)/resolution
    let lowY = -1.0
    let highY = +1.0

    let out = [0.0, lowY, 0.0]
    //lowerCircle
    for(let i=1; i<=resolution; i++){
        out.push(Math.cos(angle), lowY, Math.sin(angle))
        angle += step
    }
    out.push(0.0,highY,0.0)


    angle = 0
    //upperCircle
    for(let i=0; i<resolution;i++){
        out.push(Math.cos(angle), highY, Math.sin(angle))
        angle += step
    }

    return out
}
const cyIndexContourGen = function(resolution){
    let out = []
    //lowerCircle
    for(let i=1; i<resolution; i++){
        out.push(i,i+1)
    }
    out.push(resolution,1)
    //upperCircle
    for(let i=1; i<resolution; i++){
        out.push(resolution+1+i, resolution+2+i)
    }
    out.push(resolution+2, 2*resolution+1)
    return out
}

//questa versione crea le linee anche per gli spigoli laterali (da usare solo con resolution bassa)
const cyIndexContourGen2 = function(resolution){
    let out = []
    //lowerCircle
    for(let i=1; i<resolution; i++){
        out.push(i,i+1)
    }
    out.push(resolution,1)
    //upperCircle
    for(let i=1; i<resolution; i++){
        out.push(resolution+1+i, resolution+2+i)
    }
    out.push(resolution+2, 2*resolution+1)
    //lateral edges
    for(let i = 1; i<=resolution; i++)
        out.push(i,i+resolution+1)


    return out
}
const cyIndexGen = function (resolution){
    let out= []
    //lowerCircle
    for (let i = 1; i<resolution; i++){
        out.push(i+1,0, i)
    }
    out.push(1, 0,resolution)


    //upperCircle
    for(let i = 1; i<resolution; i++){

        out.push(i+resolution+1, resolution+1,i+resolution+2)
    }

    out.push( 2*resolution+1,resolution+1,resolution+2)

    //lateralFaces
    for(let i = 1; i<resolution; i++){
        out.push(i+resolution+1,i+1, i)
        out.push(i+resolution+2,i+1,i+resolution+1)
    }

    out.push(resolution*2 + 1,1, resolution,)
    out.push(resolution+2, 1,resolution*2 + 1)


    return out
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

function generateTexCoords(howMany){
    var tmp = []
    for(i = 0; i < howMany;i++){
        tmp.push(0.5)
    }
    return tmp
}
function divideIntoPoints3D(coordinateArray){
        var points = []
        for(var i = 0; i < coordinateArray.length / 3;i++){
            var point = []
            point.push(coordinateArray[3 * i])
            point.push(coordinateArray[1 + (3 * i)])
            point.push(coordinateArray[2 + (3 * i)])
            points.push(point)
        }
        return points
}
function divideIntoPoints2D(coordinateArray){
    var points = []
    for(var i = 0; i < coordinateArray.length / 2;i++){
        var point = []
        point.push(coordinateArray[2 * i])
        point.push(coordinateArray[1 + (2 * i)])
        points.push(point)
    }
    return points
}
function attemptToFixUVs(coordArray){
    var fixedUVs = []
    coordArray.forEach((value)  =>{
        if (value != 1 || value != 0){
            var tmp = Math.floor(value)
            fixedUVs.push(value - tmp)
            console.log(value - tmp)
        }else{
            fixedUVs.push(value)
        }

    })

    return fixedUVs
}