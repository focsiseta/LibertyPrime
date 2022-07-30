class Render{
    static nodesByShader = new Map()
    static nodesByMaterial = new Map()
    static nodesByShape = new Map()
    static ParseNodes(){
        Node.nodeList.forEach((node) => {
            let shaderID = node.shader.shader_id
            let shapeID = node.shape.id
            let hasMaterial = node.drawable.hasMaterial
            if(Render.nodesByShader.has(shaderID)){
                let nList = Render.nodesByShader.get(shaderID)
                nList.push(node)
            }else{
                Render.nodesByShader.set(shaderID,[node])
            }
            if(Render.nodesByShape.has(shapeID)){
                let nList = Render.nodesByShape.get(shapeID)
                nList.push(node)
            }else{
                Render.nodesByShape.set(shapeID,[node])
            }
            if(hasMaterial){
                let materialID = node.drawable.material.id
                if(Render.nodesByMaterial.has(materialID)){
                    let nList = Render.nodesByMaterial.get(materialID)
                    nList.push(node)
                }else{
                    Render.nodesByMaterial.set(materialID,[node])
                }
            }

        })
    }
}