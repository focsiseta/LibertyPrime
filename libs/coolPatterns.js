function SpiralPattern(){
    var aaa = new sceneNode(new Drawable(Transformations.gimbalT.XYZ,shapeSphere))
    aaa.drawab.lRotateAlpha(1)
    //aaa.drawab.scale([3,3,3])
    var node = aaa
    for(var i = 1;i < 200;i++){
        var d = new Drawable(Transformations.gimbalT.XYZ,shapeCrate)
        d.translate([0,0,-2.5*i/20])
        d.lRotateBeta(100)
        node = node.addSon(d)
    }
    //node.drawab.lRotateAlpha(80)

    return aaa
}