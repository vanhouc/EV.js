var mousePosition,
    editTool,
    viewTool,
    path,
    point1 = null,
    point2 = null,
    receiver,
    receivers = new Array(),
    zoom,
    scroll,
    startZone,
    endZone,
    drawEdit,
    pollCursor,
    editZoneHandler,
    init,
    updateReceiverList;
init = function (data) {
    project.importSVG(data);

};
receiver = function (name, receiverNumber, rectangle) {
    this.name = name;
    this.receiverNumber = receiverNumber;
    this.rectangle = rectangle;
}
updateReceiverList = function () {
    var receiverList = $('#receiverList');
    receiverList.empty();
    for (var i = 0; i < receivers.length; i++) {
        receiverList.append(
            '<li class=\'list-group-item\'>' +
            'Zone name: ' +
            receivers[i].name +
            ' Receiver Number: ' +
            receivers[i].receiverNumber +
            '</li>');
    }
};
zoom = function (event) {
    if (event.key == 'up') {
        project.activeLayer.scale(1.1, mousePosition);
        return false;
    }
    if (event.key == 'down') {
        project.activeLayer.scale(0.9, mousePosition);
        return false;
    }
}

scroll = function (event) {
    view.scrollBy(event.delta / 2);
}

startZone = function (event) {
    point1 = event.point;
};
endZone = function (event) {
    point2 = event.point;
    var newReceiver = new receiver('test', 1001, new Rectangle(point1, point2));
    receivers.push(newReceiver);
    point1 = null;
    point2 = null;
    updateReceiverList();
};
editZoneHandler = function (event) {
    console.log('called editZoneHandler');
    switch (point1) {
        case null:
            startZone(event);
            console.log('called startzone');
            break;
        default:
            endZone(event);
            console.log('called endzone');
            break;
    }
};
drawEdit = function () {
    if (point1 !== null) {
        if (path !== null && path !== undefined) {
            path.remove();
        }
        path = new Path.Rectangle(point1, mousePosition);
        path.strokeColor = 'green';
        console.log('drew edit path');
    }
};
pollCursor = function (event) {
    mousePosition = event.point;
};
$("#viewButton").click(function () {
    viewTool.activate();
    view.detach('frame');
    console.log(viewTool);
});
$('#editButton').click(function () {
    editTool.activate();
    view.detach('frame');
    view.attach('frame', drawEdit);
    console.log(editTool);
});
$(document).ready(function () {
    var svgReq = $.get("svg/Y11 Infusion.svg");
    svgReq.done(function (data) {
        init(data);
    });
    editTool = new Tool();
    editTool.activate();
    editTool.attach('mousedown', editZoneHandler);
    editTool.attach('mousemove', pollCursor);
    viewTool = new Tool();
    viewTool.activate();
    viewTool.attach('keydown', zoom);
    viewTool.attach('mousedrag', scroll);
    viewTool.attach('mousemove', pollCursor);
});
