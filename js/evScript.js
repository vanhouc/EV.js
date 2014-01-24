var plan,
    svgReq,
    i,
    init = function (data) {
        plan = project.importSVG(data);
    };
$(document).ready(function () {
    svgReq = $.get("svg/Y11_Infusion.svg");
    svgReq.done(function (data) {
        init(data);
    });
});
