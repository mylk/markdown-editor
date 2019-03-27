function renderResults(response) {
    $(".content[data-type='html']").html(response);
    $(".content[data-type='raw-html']").val($(".content[data-type='html']").html());
}

// generate exponential backoff
function generateTimeout(retries) {
    var timeout = Math.pow(2, retries);

    timeout = (timeout > 32) ? 32 : timeout;

    return timeout * 1000;
}

var retries = 1;
var socket;

function createWebSocket() {
    var ws = new WebSocket('ws://localhost:80');

    ws.onclose = function () {
        var timeout = generateTimeout(retries);

        setTimeout(function () {
            createWebSocket();
            retries++;
        }, timeout);
    };

    ws.onerror = function (e) {
        //@TODO maybe log this somewhere
        console.log(e);
    };

    ws.onopen = function () {
        retries = 1;

        // assign websocket to a global var, so it can be reassigned on open event after a close event
        socket = ws;
    };

    ws.addEventListener("message", function (response) {
        renderResults(response.data);
    });
}

$(document).ready(function () {
    var supportsWS = (typeof (WebSocket) !== "undefined");

    if (supportsWS) {
        createWebSocket();
    }

    $(".content[data-type='markdown']").on("keyup", function () {
        if (!supportsWS) {
            // support for older browsers
            $.ajax({
                url: "/render",
                data: $(this).val(),
                method: "POST",
                success: function (response) {
                    renderResults(response);
                }
            });
        } else {
            socket.send($(".content[data-type='markdown']").val());
        }
    });

    $(".export").on("click", function (e) {
        e.preventDefault();

        var inputType = $(this).data("input-type");
        var outputType = $(this).data("output-type");
        var inputContent = "";

        if (inputType === "markdown") {
            inputContent = $(".content[data-type='markdown']").val();
        } else if (inputType === "html") {
            inputContent = $(".content[data-type='html']").html();
        }

        $.ajax({
            url: "/export/" + outputType + "/" + inputType,
            data: inputContent,
            method: "POST",
            success: function (response) {
                $("#downloadhelper").attr("src", "/export_file/" + response);
            }
        });
    });

    $(".raw-html, .rendered-html").on("click", function (e) {
        e.preventDefault();

        $(".rendered-html").toggle();
        $(".content[data-type='raw-html']").toggle();

        $(".raw-html").toggle();
        $(".content[data-type='html']").toggle();
    });
});
