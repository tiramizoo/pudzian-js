function PudzianDrawer(options){
    var c = document.getElementById(options.canvasID);
    var context = c.getContext("2d");
    var root = options.root;

    var p3d = function (x, y, z) {
        var cameradistance = 500;
        var scale = cameradistance / (cameradistance - (z >= cameradistance ? cameradistance - 1 : z));
        return {
            x: x * scale,
            y: y * scale
        };
    };

    var drawBox = function (x, y, z, w, h, l){
        var x2 = x + w;
        var y2 = y + h;
        var z2 = z + l;

        var p1 = p3d(x,y,z);
        var p2 = p3d(x2,y,z);
        var p3 = p3d(x2,y2,z);
        var p4 = p3d(x,y2,z);
        var p5 = p3d(x,y,z2);
        var p6 = p3d(x2,y,z2);
        var p7 = p3d(x2,y2,z2);
        var p8 = p3d(x,y2,z2);

        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.lineTo(p4.x, p4.y);
        context.lineTo(p1.x, p1.y);
        context.moveTo(p1.x, p1.y);
        context.lineTo(p5.x, p5.y);
        context.lineTo(p6.x, p6.y);
        context.lineTo(p7.x, p7.y);
        context.lineTo(p8.x, p8.y);
        context.lineTo(p5.x, p5.y);
        context.moveTo(p4.x, p4.y);
        context.lineTo(p8.x, p8.y);
        context.moveTo(p3.x, p3.y);
        context.lineTo(p7.x, p7.y);
        context.moveTo(p2.x, p2.y);
        context.lineTo(p6.x, p6.y);
        context.stroke();
    };

    context.strokeStyle = "black";
    drawBox(root.x, root.y, root.z, root.w, root.h, root.l);

    return {
        drawBox: function (x, y, z, w, h, l, color) {
            context.strokeStyle = color;
            return drawBox(x + root.x, root.y - y + root.h, z + root.z, w, -1 * h, l);
        }
    };
};
