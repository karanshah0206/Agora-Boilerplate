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

// Create client by invoking the AgoraRTC create client method. Takes JSON to initialize basic settings.
let client  = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
client.init("c0041179099d492fa2dafcc82ec735c0"); // This function requires the App ID in string

// Join a specific channel (room).
client.join(null /* token - null if not present */, "channel-name", null /* if you need to specify custom ID */, (uid) => {
    // Create stream for local user.
    let localStream = AgoraRTC.createStream({ video: true, audio: true });
    localStream.init(() => {
        localStream.play("me"); // Play local stream "#me" div
        client.publish(localStream, handleFail); // Publish stream on server
    }, handleFail);
}, handleFail);

// Listen for remote streams added to the channel.
client.on("stream-added", (evt) => {
    // Subscribe to remote stream.
    client.subscribe(evt.stream, handleFail);
}, handleFail);

// After remote stream subscribed. At this point, we're receiving the remote stream. Render it to the DOM.
client.on("stream-subscribed", (evt) => {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
}, handleFail);

// Listen for streams being unpublished.
client.on("stream-removed", (evt) => {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
}, handleFail);

// Listen for users leaving video call.
client.on("peer-leave", (evt) => {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
}, handleFail);