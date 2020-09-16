let handleFail = function (err) { console.log("Error: ", err); }

// The remote container within which the remote feeds will go
let remoteContainer = document.getElementById("remote-container");

// When new video stream is published, this function adds its div to the DOM.
function addVideoStream (elementId) {
    let streamDiv = document.createElement("div");
    streamDiv.id = elementId;
    streamDiv.style.transform = "rotateY(180deg)"; // Mirroring video
    remoteContainer.appendChild(streamDiv);
}

// When video stream is unpubslihed, this function removes its div from the DOM.
function removeVideoStream (elementId) {
    let remDiv = document.getElementById(elementId);
    if (remDiv) remDiv.parentNode.removeChild(remDiv);
}