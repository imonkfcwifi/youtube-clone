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

function keyMove(e) {
    if (e.which === 32) {
        // console.log('space');
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }

}


timeline.addEventListener("change", handleTimelineSet);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", keyMove);

