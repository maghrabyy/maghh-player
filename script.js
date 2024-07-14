import { playlist } from  './data.js'

const bgImg = document.querySelector(".overlay-img")

//buttons
const replayBtn = document.getElementById("replay-btn")
const playPauseBtn = document.getElementById("playpause-btn")
const muteBtn = document.getElementById("mute-btn")
const backwardBtn = document.getElementById("backward-btn")
const forwardBtn = document.getElementById("forward-btn")

//music player components
const audioPlayer = document.querySelector("audio")
const songTitle = document.querySelector(".song-title")
const songThumbnail = document.querySelector(".song-thumbnail img")
const rangeNum = document.querySelector(".range-num")
const songRange = document.getElementById("song-range")

let currentIndex = 0;

const setCurrentSong = index =>{
    const songArtist = playlist[index].song.artist
    const songName = playlist[index].song.title
    bgImg.style.backgroundImage = playlist[index].bgSrc? 
        `url(assets/images/song-images/artist-bg/${playlist[index].bgSrc})`
        :
        'linear-gradient(141deg, rgba(42,39,36,1) 0%, rgba(83,72,72,1) 26%, rgba(92,81,72,1) 38%, rgba(162,160,158,1) 100%)'
    audioPlayer.setAttribute("src",`assets/audio/${playlist[index].audioSrc}`)
    songTitle.textContent = `${songArtist} - ${songName}`
    songThumbnail.setAttribute("src",playlist[index].thumbnailSrc?
         `assets/images/song-images/thumbnails/${playlist[index].thumbnailSrc}`
        :
        'assets/images/default-thumbnail.png'
        )
}
setCurrentSong(currentIndex)

const togglePlay = ()=>{
    if(audioPlayer.paused){
        audioPlayer.play()
        playPauseBtn.classList.remove("fa-play")
        playPauseBtn.classList.add("fa-pause")
    }else{
        audioPlayer.pause()
        playPauseBtn.classList.remove("fa-pause")
        playPauseBtn.classList.add("fa-play")
    }
}

playPauseBtn.addEventListener("click",togglePlay)

const replaySong = ()=>{
    audioPlayer.load()
}

replayBtn.addEventListener("click",replaySong)

const toggleMute = ()=>{
    if(!audioPlayer.muted){
        audioPlayer.muted = true
        muteBtn.classList.remove("fa-volume-high")
        muteBtn.classList.add("fa-volume-xmark")
    }else{
        audioPlayer.muted = false
        muteBtn.classList.remove("fa-volume-xmark")
        muteBtn.classList.add("fa-volume-high")
    }
}

muteBtn.addEventListener("click",toggleMute)

songRange.addEventListener("input",(e)=>{
    audioPlayer.currentTime = e.target.valueAsNumber
})

const backwardSong = ()=>{
    if(audioPlayer.currentTime > 1){
        replaySong()
    }else{
        if(currentIndex > 0){
            currentIndex--;
            setCurrentSong(currentIndex)
        }
    }
}

backwardBtn.addEventListener("click",backwardSong)

const forwardSong = ()=>{
    if(currentIndex < playlist.length-1){
        currentIndex++
        setCurrentSong(currentIndex)
    }
}

forwardBtn.addEventListener("click",forwardSong)

const convertSecondsToTimer = (time)=>{
    const minutes = Math.floor(time/60)
    const seconds = Math.floor(time - minutes * 60)
    return `0${minutes}:${seconds > 9? seconds : "0"+seconds}`
}

audioPlayer.addEventListener("timeupdate",(e)=>{
    const currentTime = convertSecondsToTimer(e.target.currentTime)
    const duration = convertSecondsToTimer(audioPlayer.duration)
    rangeNum.textContent = `${currentTime} - ${duration}`
    songRange.value = e.target.currentTime
    if( e.target.currentTime === audioPlayer.duration){
        playPauseBtn.classList.remove("fa-pause")
        playPauseBtn.classList.add("fa-play")  
    }
})

audioPlayer.addEventListener("durationchange",()=>{
    const duration = convertSecondsToTimer(audioPlayer.duration)
    rangeNum.textContent = `00:00 - ${duration}`
    songRange.setAttribute("max", audioPlayer.duration)
    playPauseBtn.classList.remove("fa-pause")
    playPauseBtn.classList.add("fa-play")    
    if(!isElementOverflowing(songTitle)){
        songTitle.style.animation = 'none'
    }else{
        songTitle.style.animation = 'marquee 10s linear infinite'
    }
})


document.addEventListener("keydown",(e)=>{
    if(e.code === 'Space')
        togglePlay()
    if(e.code === 'KeyM')
        toggleMute()
    if(e.code === 'KeyR')
        replaySong()
    if(e.code === "MediaTrackNext")
        forwardSong()
    if(e.code === "MediaTrackPrevious")
        backwardSong()
})

function isElementOverflowing(element) {
    var overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;
    return (overflowX || overflowY);
}
