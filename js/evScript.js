var mousePosition,
    editTool,
    viewTool,
    path,
    point1 = null,
    point2 = null,
    receiver,
    receivers = new Array(),
    nameArray = new Array(),
    zoom,
    scroll,
    startZone,
    endZone,
    drawEdit,
    pollCursor,
    editZoneHandler,
    init,
    getBadgeData,
    updateLocationData,
    receiverIndex = 1001,
    updateListView,
    updateRoomList,
    resizeView;

getBadgeData = function () {
    $.getJSON('data/Y11 Infusion.txt')
    .done(function (data) {
        updateLocationData(data);
        updateListView(data);
        updateRoomList(data);
    });
};
updateListView = function (data) {
    var listView = $('#listView');
    listView.empty();
    for (var o = 0; o < data.badges.length; o++) {
        listView.append(
            '<tr>' +
            '<td>' + data.badges[o].badgeNumber + '</td>' +
            '<td>' + data.badges[o].name + '</td>' +
            '<td>' + data.badges[o].location + '</td>' +
            '</tr>');
    }
};
updateLocationData = function (data) {
    for (var p = 0; p < nameArray.length; p++) {
        console.log(nameArray[p]);
        nameArray[p].remove();
    }
    nameArray = new Array();
    for (var t = 0; t < receivers.length; t++) {
        receivers[t].nameHeight = 16;
    }
    for (var i = 0; i < data.badges.length; i++) {
        for (var r = 0; r < receivers.length; r++) {
            if (data.badges[i].location === receivers[r].receiverNumber.toString()) {
                var newText = new PointText({
                    point: receivers[r].outlinePath.bounds.topLeft + new Point(5, receivers[r].nameHeight),
                    content: data.badges[i].name,
                    fillColor: 'black',
                    name: 'name',
                    scaling: project.activeLayer.scaling
                });
                receivers[r].nameHeight += newText.bounds.height;
                nameArray.push(newText);
            }
        }
    }
};
init = function (data) {
    project.importSVG(data);

};
receiver = function (name, receiverNumber, rectangle) {
    this.name = name;
    this.receiverNumber = receiverNumber;
    this.rectangle = rectangle;
    this.nameHeight = 16;
    this.outlinePath = new Path.Rectangle(rectangle);
    this.outlinePath.strokeColor = 'black';
}
updateRoomList = function (data) {
    var roomView = $('#roomView');
    roomView.empty();
    for (var o = 0; o < receivers.length; o++) {
        var badgesInRoom = new Array();
        //for (var l = 0; l < data.badges.length; l++) {
        //    if (data.badges[l].location === receiver[o].receiverNumber.toString()) {
        //        badgesInRoom.push(data.badges[l].location)
        //    }
        //}
        roomView.append(
            '<tr>' +
            '<td>' + receivers[o].receiverNumber + '</td>' +
            '<td>' + receivers[o].name + '</td>' +
            '<td>' + badgesInRoom.toString() + '</td>' +
            '</tr>');
    }
};
zoom = function (event) {
    if (event.key == 'up') {
        project.activeLayer.scale(1.1, mousePosition);
    }
    if (event.key == 'down') {
        project.activeLayer.scale(0.9, mousePosition);
    }
    getBadgeData();
    return false;
}

scroll = function (event) {
    view.scrollBy(event.delta / 2);
}

startZone = function (event) {
    point1 = event.point;
};
endZone = function (event) {
    point2 = event.point;
    var newReceiver = new receiver('test', receiverIndex, new Rectangle(point1, point2));
    receivers.push(newReceiver);
    point1 = null;
    point2 = null;
    receiverIndex += 1;
    getBadgeData();
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
$('#resizeViewButton').click(function () {
    resizeView();
});
resizeView = function () {
    var evCanvas = $('#evCanvas');
    view.viewSize = new Size(evCanvas.width(), evCanvas.height());
}
$(document).ready(function () {
    var svgReq = $.get("svg/Y11Infusion.svg");
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
    resizeView();
});