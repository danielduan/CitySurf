function decToHex(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

function getFPS(stats) {
    var FPS = null
    try {
        FPS = stats.domElement.innerText.match(/.*(?= FPS)/);
    } catch (err) {
        FPS = stats.domElement.textContent.match(/.*(?= FPS)/);
    }
    if (FPS) {
        return FPS[0]
    } else {
        return undefined
    }
}

function createBlocker(txt) {
    var ele = gameBlocker;
    $("#container").append(ele);
    $(ele).html("");
    $(ele).css({
            "display": "block"
        })
    $(ele).css({
            "width": "100%",
            "height": "100%",
            "margin": 0,
            "padding": 0,
            "font-size": "50px",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "text-shadow": "0px 3px 3px rgba(170,170,170,.7)"
        })
    $(ele).html("<tbody><tr><td align='center' valign='middle' style='width:" + $("#container").width() + "px;height:" + $("#container").height() + "px'>" + txt + "</td></tr></tbody>");
}

function removeBlocker() {
    var ele = gameBlocker;
    $(ele).html("");
    $(ele).css({
            "display": "none"
        })
}