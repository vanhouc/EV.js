var plan,
    svgReq,
    i,
    mousePosition,
    init = function (data) {
        plan = project.importSVG(data);
    };
$(document).ready(function () {
    svgReq = $.get("svg/Y11 Infusion2.svg");
    svgReq.done(function (data) {
        init(data);
    });
});
function onKeyDown(event) {
    if (event.key == 'up') {
        plan.scale(1.1, mousePosition);
        return false;
    }
    if (event.key == 'down') {
        plan.scale(0.9, mousePosition);
        return false;
    }
    alert(event.key);
}
tool.minDistance = 10;
function onMouseDrag(event) {
    view.scrollBy(event.delta);
}
function onMouseMove(event) {
    mousePosition = event.point;
}