const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicContainer = wrapper.querySelector(".img-area"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");
musicFavoriteBtn = wrapper.querySelector("#music-favorite");
darkModeBtn = wrapper.querySelector("#dark-mode-btn")
expandBtn = wrapper.querySelector("#expand-btn")
moreBtn = wrapper.querySelector("#more-btn")
volumeContainer = wrapper.querySelector("#volume-container")
volumePlus = wrapper.querySelector("#volume-plus")
volumeMinus = wrapper.querySelector("#volume-minus")
volumeBar = wrapper.querySelector(".volume-bar")
const ulTag = wrapper.querySelector("ul");
let allMusic = [];

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);


isMusicPaused = true;
var audioVolume = 0.5

window.addEventListener("load", ()=>{
  fetchMusicList().then(data => {
    allMusic = data;
    loadMusic(musicIndex);
    playingSong();
    renderMusicList();
  })
});

async function fetchMusicList() {
    const response = await fetch("music-list.json")
    const data = await response.json()
    return data
}

const gradientElement = document.body
let gradientIndex = 0;

// animateGradient = function() {
//   setInterval(changeGradientColor, 100);
// }

//animateGradient()

// function changeGradientColor() {
//   if (gradientIndex === 360) {
//     gradientIndex = 0;
//   } else {
//     gradientIndex += 10;
//   }
//   const pinkColor = getComputedStyle(document.documentElement).getPropertyValue('--pink');
//   const violetColor = getComputedStyle(document.documentElement).getPropertyValue('--violet');
//   const newGradientColor = `linear-gradient(${gradientIndex}deg, ${pinkColor} 0%, ${violetColor} 100%)`;
//   gradientElement.style.background = newGradientColor;
// }

// function loadMusic(indexNumb){
//   musicName.innerText = allMusic[indexNumb - 1].name;
//   musicArtist.innerText = allMusic[indexNumb - 1].artist;
//   musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
//   mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
//   mainAudio.volume = audioVolume;
// }

const loadMusic = (indexNumb) => {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
  mainAudio.volume = audioVolume;
};


musicContainer.addEventListener('click', () => {
  //add shake-animation for img
  musicContainer.classList.add('shake-animation');
  // Remove the shake-animation class after 1 second
  setTimeout(() => {
    musicContainer.classList.remove('shake-animation');
  }, 1000); 
});


darkModeBtn.addEventListener("click", () => {
  const root = document.documentElement;
  let currentIndex = 0;

  // create an array for themes
  const classNames = ["theme0", "theme1"];

  //  get the current class index
  const currentClassIndex = classNames.indexOf(
      Array.from(root.classList).find(className => /theme\d+/g.test(className))
  );

  // if the existing class is found
  if (currentClassIndex > -1) {
    // get the next class index for the found class
    currentIndex =
        currentClassIndex === classNames.length - 1 ? 0 : currentClassIndex + 1;
  } else {
    // if no existing class is found, use the first class from the list
    currentIndex = 0;
  }

  // add class based on the current index
  const newClass = classNames[currentIndex];
  root.classList.remove(classNames[currentClassIndex]);
  root.classList.add(newClass);
});


let isLarge = true;
expandBtn.addEventListener("click", () => {
  // Get all elements with class name "large"
  const largeElements = document.querySelectorAll('.large');
  // Set their visibility style to "hidden" or "block" depending on isLarge value
  largeElements.forEach(element => {
    element.style.display = isLarge ? 'none' : 'block';
  });
  // Change the text of the expand button depending on the isLarge value
  expandBtn.innerText = isLarge ? "expand_more" : "expand_less"
  isLarge = !isLarge
})

//play music function
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music function
function prevMusic(){
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//next music function
function nextMusic(){
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// play or pause button event
playPauseBtn.addEventListener("click", ()=>{
  togglePlayMusic()
});

function togglePlayMusic() {
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
}

//prev music button event
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//next music button event
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //getting playing song currentTime
  const duration = e.target.duration; //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //calling playMusic function
  playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", ()=>{
  //  do according to the icon means if user has set icon to
  // loop song then repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

musicFavoriteBtn.addEventListener("click", ()=>{
  const currentLi = ulTag.querySelectorAll("li")[musicIndex-1]
  const favoriteBtn = currentLi.querySelectorAll(".favorite-icon")[0]
  if (musicFavoriteBtn.classList.contains('favorite-icon-true')) {
    musicFavoriteBtn.classList.remove('favorite-icon-true');
    musicFavoriteBtn.classList.add('favorite-icon-false');
    favoriteBtn.classList.remove('favorite-icon-true');
    favoriteBtn.classList.add('favorite-icon-false');
  } else {
    musicFavoriteBtn.classList.remove('favorite-icon-false');
    musicFavoriteBtn.classList.add('favorite-icon-true');
    favoriteBtn.classList.remove('favorite-icon-false');
    favoriteBtn.classList.add('favorite-icon-true');
  }
})


function renderMusicList() {
// let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    // pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                 <div class="music-name-container">
                    <span>${allMusic[i].name}</span>
                    <i class="material-icons favorite-icon favorite-icon-false">favorite</i>
                  </div>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration"> </span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      }
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }
}

//play particular song from the list onclick of li tag
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function and add favorite icon
// function clicked(element){
//   let getLiIndex = element.getAttribute("li-index");
//   musicIndex = getLiIndex; //updating current song index with clicked li index
//   if (element.querySelectorAll(".favorite-icon")[0].classList.contains('favorite-icon-true')) {
//     musicFavoriteBtn.classList.remove('favorite-icon-false');
//     musicFavoriteBtn.classList.add('favorite-icon-true');
//   } else {
//     musicFavoriteBtn.classList.remove('favorite-icon-true');
//     musicFavoriteBtn.classList.add('favorite-icon-false');
//   }
//   loadMusic(musicIndex);
//   playMusic();
//   playingSong();
// }

//particular li clicked function and add favorite icon
const clicked = (element) => {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
 // toggle favorite icon class based on its current state
  if (element.querySelectorAll(".favorite-icon")[0].classList.contains('favorite-icon-true')) {
    musicFavoriteBtn.classList.remove('favorite-icon-false');
    musicFavoriteBtn.classList.add('favorite-icon-true');
  } else {
    musicFavoriteBtn.classList.remove('favorite-icon-true');
    musicFavoriteBtn.classList.add('favorite-icon-false');
  }
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};


//handle clicking on volume button to expand/collapse volume control  
moreBtn.addEventListener("click", () => {
  if (volumeContainer.style.display === "none") {
    volumeContainer.style.display = "block";
  } else {
    volumeContainer.style.display = "none";
  }
})

//presses a space bar to play
document.addEventListener("keydown", function(event) {
  if (event.key === " ") {
    togglePlayMusic()
  }
});

// allow the user to increase or decrease the volume 
// by clicking on the volumePlus and volumeMinus elements. 
volumeMinus.addEventListener("click", function() {
  audioVolume -= 0.1
  if (audioVolume < 0) {
    audioVolume = 0
  }
  volumeBar.style.width = audioVolume * 100 + "%";
  mainAudio.volume = audioVolume;
})

volumePlus.addEventListener("click", function() {
  audioVolume += 0.1
  if (audioVolume > 1) {
    audioVolume = 1
  }
  volumeBar.style.width = audioVolume * 100 + "%";
  mainAudio.volume = audioVolume;
})