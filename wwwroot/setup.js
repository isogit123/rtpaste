ev = ""
if (location.href.includes('?')) {
    var queryStr = location.href.split('?')[1]
    var param = queryStr.split('=')
    if (param.length > 1) {
        var eIndex = param.indexOf("e") + 1
        if (eIndex != 0)
            ev = param[eIndex]
        else
            ev = "default"
    }
}
var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('txt');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('broadcast', {
            ev: ev,
            type: 1,
            msg: input.value
        });
        input.value = '';
    }
});
socket.emit('joinroom', ev)
socket.on(ev, function (msg) {

    let payload = msg
    if (payload.type == 1) {
        let txtarea = document.createElement("TEXTAREA");
        txtarea.classList.add("form-control")
        txtarea.value = msg.msg
        document.getElementById('list').appendChild(txtarea)
    }
    else if (payload.type == -1) {
        alert('Failure: More than two users in room!')
    }

});
