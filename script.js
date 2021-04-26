currently_playing = document.getElementById("currently-playing");

control_play = document.getElementById("control-play");
control_play.onclick = function() {
    let uuid = currently_playing.uuid;
    let msg = JSON.stringify({
        Action: {
            Play: uuid
        }
    })
    socket.send(msg)
}

control_stop = document.getElementById("control-stop");
control_stop.onclick = function() {
    let msg = JSON.stringify({
        Action: "Stop"
    })
    socket.send(msg)
}

control_pause = document.getElementById("control-pause");
control_pause.onclick = function() {
    let msg = JSON.stringify({
        Action: "Pause"
    })
    socket.send(msg)
}

let socket = new WebSocket("ws://192.168.1.3:9023");

socket.onopen = function(e) {
    console.log("[WebSocket] Connection established");
    console.log("[WebSocket] Sending to server");
    socket.send("{\"QueryResources\":{}}");
};

socket.onmessage = function(event) {
    console.log(`[WebSocket] Data received from server: ${event.data}`);

    response = JSON.parse(event.data)
    if (response.Resources) {
        resources_div = document.getElementById("resources");
        resources_div.innerHTML = "";

        response.Resources.forEach(r => {
            var res_uri = document.createElement('a');
            res_uri.innerHTML = r.name;
            res_uri.onclick = function() {
                let uuid = r.uuid;
                let msg = JSON.stringify({
                    Action: {
                        Play: uuid
                    }
                })
                console.log(msg)
                currently_playing.innerHTML = r.name;
                currently_playing.uuid = uuid;
                socket.send(msg);
            }

            var res_element = document.createElement('div');
            res_element.appendChild(res_uri);

            resources_div.appendChild(res_element);
        });
    }
};

socket.onclose = function(event) {
    document.body.innerHTML = "<div class='server-error'>Could not connect to server</div>"

    if (event.wasClean) {
        console.log(`[WebSocket] Connection closed, code=${event.code} reason=${event.reason}`);
    } else {
        console.log('[WebSocket] Connection died');
    }
};

socket.onerror = function(error) {
    console.log(`[WebSocket] ${error.message}`);
};
