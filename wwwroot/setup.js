ev = "";
uploadUrl = "https://bashupload.com";

//parse query string to get room name if provided. if not provided, use default as the room name
if (location.href.includes("?")) {
  var queryStr = location.href.split("?")[1];
  var param = queryStr.split("=");
  if (param.length > 1) {
    var eIndex = param.indexOf("e") + 1;
    if (eIndex != 0) ev = param[eIndex];
    else ev = "default";
  }
}
var socket = io();

var form = document.getElementById("form");
var input = document.getElementById("txt");
var filesElement = document.getElementById("files");
var list = document.getElementById("list");
var lbl_progress = document.getElementById("lbl_progress");
var btn_cancel = document.getElementById("btn_cancel");
let controller = new AbortController();

btn_cancel.addEventListener("click", function () {
  controller.abort();
  lbl_progress.innerText = "";
  this.style.display = "none";
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (filesElement.files.length > 0) {
    controller = new AbortController();
    let formData = new FormData();
    for (let i = 0; i < filesElement.files.length; i++)
      formData.append("files", filesElement.files[i]);
    let timeStarted = new Date();
    btn_cancel.style.display = "inline-block";
    axios({
      method: "post",
      url: uploadUrl,
      data: formData,
      signal: controller.signal,
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        let remainingSeconds = convertHMS(
          timeStarted,
          progressEvent.loaded,
          progressEvent.total
        );
        let speed = getSpeedStr(progressEvent.loaded, timeStarted);
        lbl_progress.innerText = `${percentCompleted}%, ${speed}, ${remainingSeconds} remaining`;
      },
    })
      .then(function (response) {
        //handle success
        let respLines = response.data.split("\n");
        let fileUrl = "";
        for (let i = 0; i < respLines.length; i++) {
          if (respLines[i].includes("wget")) {
            fileUrl = respLines[i].split(" ")[1];
            break;
          }
        }
        socket.emit("broadcast", {
          ev: ev,
          type: 1,
          msg: input.value,
          files: [fileUrl],
        });
        form.reset();
        btn_cancel.style.display = "none";
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  } else if (input.value) {
    socket.emit("broadcast", {
      ev: ev,
      type: 1,
      msg: input.value,
      files: [],
    });
    form.reset();
  }
});
//Join the room.
socket.emit("joinroom", ev);
socket.on(ev, function (msg) {
  let firstMsg = true;
  let filesAfterLastMsg = false;
  let payload = msg;
  //payload.type = 1, means a message payload
  let files = payload.files;
  if (payload.type == 1) {
    if (msg.msg) {
      if (!firstMsg || !filesAfterLastMsg) {
        let br = document.createElement("BR");
        list.appendChild(br);
      }
      let txtarea = document.createElement("TEXTAREA");
      txtarea.readOnly = true;
      txtarea.classList.add("form-control");
      txtarea.value = msg.msg;
      list.appendChild(txtarea);
      firstMsg = false;
      filesAfterLastMsg = false;
    }
    if (files) {
      files.forEach((element) => {
        let anchor = document.createElement("A");
        anchor.target = "_blank";
        anchor.href = element;
        anchor.innerText = element;
        list.appendChild(anchor);
        let br = document.createElement("BR");
        list.appendChild(br);
        filesAfterLastMsg = true;
      });
    }
  }
  //Error payload
  else if (payload.type == -1) {
    alert("Failure: More than two users in room!");
  }
});
