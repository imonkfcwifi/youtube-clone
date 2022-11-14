const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
let volumeValue = 0.5;
video.volume = volumeValue;


const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substring(11, 19);


// const formatTime 에서 중괄호를 없애야해요.
// 보통 { }로 객체를 만드는데,
// new Date를 쓰면 그 자체로 새로운 객체를 만드는것이니까요!
// {} 를 쓰실거라면 {}안에서 return new Date()이런식으로 리턴을 해줘야합니다

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};


let videoPlayStatus = false;
let setVideoPlayStatus = false;

const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    if (!setVideoPlayStatus) {
        videoPlayStatus = video.paused ? false : true;
        setVideoPlayStatus = true;
    }
    video.pause();
    video.currentTime = value;
};

const handleTimelineSet = () => {
    videoPlayStatus ? video.play() : video.pause();
    setVideoPlayStatus = false;
}

//이 함수가 스페이스 키를 눌렀을 때도 작동하도록



(function () {
    var k = function (action) {
        var eventObj = document.createEvent("Events");

        eventObj.event("keydown", true, true);
        eventObj.keyCode = 75;
        eventObj.which = 75;

        document.body.dispatchEvent(eventObj);
    };

    var killSpaceBar = function (evt) {

        var target = evt.target || {},
            isInput = ("INPUT" == target.tagName || "TEXTAREA" == target.tagName || "SELECT" == target.tagName || "EMBED" == target.tagName);

        // if we're an input or not a real target exit
        if (isInput || !target.tagName) return;

        // if we're a fake input like the comments exit
        if (target && target.getAttribute && target.getAttribute('role') === 'textbox') return;

        // ignore the space and send a 'k' to pause
        if (evt.keyCode === 32) {
            if (video.paused) {
                video.play()
            } else {
                video.pause()
            }

            evt.preventDefault();
            k();
        }
    };

    document.addEventListener("keydown", killSpaceBar, false);

})();

const handleVideoEnded = () => {
    video.currentTime = 0;
    playBtn.innerText = "Play";
};

video.addEventListener("ended", handleVideoEnded);
timeline.addEventListener("change", handleTimelineSet);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", keyMove);

