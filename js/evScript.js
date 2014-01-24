var svgReq,
    svgBDReq,
    i,
    creatingRect = false,
    rectp1,
    rectPreview,
    buildingRect = false,
    layerlistObj = document.getElementById('layerlist'),
    mousePosition,
init = function (data) {
    project.importSVG(data);
    for (i = 0; i < project.layers.length; i++) {
        $('#layerlist').append(project.layers[i].index);
    }
},
loadBadges = function (data) {
    var currentLayer = project.layers['EVTEXT']
    var textRegion = project.layers['EVTEXT'].firstChild;
    var height = 0;
    for (i = 0; i < data.badges; i++) {
        currentLayer.addChild(new PointText({
            point: [0, height],
            content: data.badges[i].name,
            fillColor: 'black',
            fontFamily: 'arial',
            fontSize: 6
        }))
    }
};
$(document).ready(function () {
    svgReq = $.get("svg/Y11 Infusion.svg");
    svgReq.done(function (data) {
        init(data);
    });
    svgBDReq = $.getJSON("data/Y11 Infusion.txt");
    svgBDReq.done(function (data) {

    });
});
function onKeyDown(event) {
    if (event.key == 'up') {
        project.activeLayer.scale(1.1, mousePosition);
        return false;
    }
    if (event.key == 'down') {
        project.activeLayer.scale(0.9, mousePosition);
        return false;
    }
}

function onMouseDrag(event) {
    view.scrollBy(event.delta / 2);
}

