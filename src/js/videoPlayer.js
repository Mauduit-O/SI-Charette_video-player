////////// ELEMENTS //////////
const $video = document.querySelector('.video');

const $playButton = document.getElementById('buttonPlay');
const $playSvg = document.getElementById('svgPlay');
const $mainPlay = document.querySelector('.mainPlay');
const $previousButton = document.getElementById('buttonPrevious');
const $nextButton = document.getElementById('buttonNext');
const $nextEpisode = document.getElementById('nextEpisode');

const $volumeWrapper = document.querySelector('.controller__sound');
const $soundButton = document.getElementById('buttonSound');
const $soundSvg = document.getElementById('svgSound');
const $volumeSlider = document.getElementById('controller__soundSlider');

const $durationBar = document.getElementById('durationBar');
const $progressBar = document.getElementById('progressTime');
const $progressBarIndicator = document.getElementById('indicatorTime');
const $timeContainer = document.getElementById('videoTimeHover');

const progressElements = [
  $durationBar,
  $progressBar,
  $progressBarIndicator
]

const $currentTimeWrapper = document.getElementById('currentTime');
const $timeWrapper = document.getElementById('time');


////////// ACTIONS //////////

$video.onloadedmetadata = function() {
  
  const togglePlay = () => {
      if(!$video.paused && !$video.ended){
          $video.pause();
          $playSvg.setAttribute('href', '#play');
          $mainPlay.classList.remove('is-hidden');
      }else{
          $video.play();
          $volumeSlider.value = $video.volume * 100;
          $playSvg.setAttribute('href', '#pause');
          $mainPlay.classList.add('is-hidden');
      }
  }

  const isMuted = () => {
    let volumeNow = $video.volume;
    if($video.muted != true){
        $video.muted = true;
        $volumeSlider.value = 0;
        $soundSvg.setAttribute('href', '#mute');
    }else{
        $video.muted = false;
        $volumeSlider.value = volumeNow * 100;
        $soundSvg.setAttribute('href', '#soundon');
    }
  }

  const clickedBar = (e) => {
    let mouseX = e.offsetX;
    let newTime = mouseX / ($durationBar.offsetWidth / $video.duration);
    $video.currentTime = newTime;    
  }

  //Transformation du temps => mminutes : secondes
  const transformTime = (time) => {
      let minutes;
      let seconds;
      if(time < 60){
          seconds = time >= 10 ? time.toString() : `0${time.toString()}`;
          minutes = '00';
      }else if(time >= 60){
          let calculMinutes = Math.floor(time / 60);
          let calculSeconds = time - 60 * calculMinutes;
          seconds = calculSeconds >= 10 ? calculSeconds.toString() : `0${calculSeconds.toString()}`;
          minutes = calculMinutes >= 10 ? calculMinutes.toString() : `0${calculMinutes.toString()}`;
      }
      return `${minutes} : ${seconds}`;
  }

  //Màj du temps sur videoTimeHover
  const setTime = (e) => {
    let mouseX = e.offsetX;
    let videoTimeSeconds = mouseX * $video.duration / $durationBar.offsetWidth;
    $timeContainer.innerHTML = transformTime(Math.floor(videoTimeSeconds));
    $timeContainer.classList.add('isHover');
    let halfWidth = $timeContainer.offsetWidth / 2;
    let stopMove = $durationBar.offsetWidth - halfWidth;
    if(mouseX < stopMove){
      $timeContainer.style.left = mouseX - halfWidth + 'px';
    }
  }

  const isHover = (e) => {
      if (e.type == 'mouseover') {
          $durationBar.classList.add('durationBar-is-hover');
          $progressBar.classList.add('durationBar-is-hover');
          $progressBarIndicator.classList.add('indicator-is-hover');
      }
      if (e.type == 'mouseout') {
          $durationBar.classList.remove('durationBar-is-hover');
          $progressBar.classList.remove('durationBar-is-hover');
          $timeContainer.classList.remove('isHover');
          $progressBarIndicator.classList.remove('indicator-is-hover');
      }
  }

  ////////// EVENNEMENTS //////////

  // PLAY
  $video.addEventListener('click', () => {
    togglePlay();
 })

 $playButton.addEventListener('click', () => {
  togglePlay();
  })

  // SOUND 
  $volumeSlider.addEventListener('input', (e) => {
    let value = e.target.value;
    $video.volume = value / 100;
    $video.muted = false;
    if(value == 0){
      $soundSvg.setAttribute('href', '#mute');
    }else{
      $soundSvg.setAttribute('href', '#soundon');
    }
  })

  $soundButton.addEventListener('click', () => {
    isMuted();
  })

  // Mise à jour des éléments playButton et progressBar selon le temps de vidéo atteint
  $video.addEventListener('timeupdate', () => {
    if($video.ended){
      $playSvg.setAttribute('href', '#play');
      $mainPlay.classList.remove('is-hidden');
    }else{
      const progress = ($video.currentTime / $video.duration) * 100; //récupération du pourcentage de progression
      $progressBar.style.width = progress + '%';
      $currentTimeWrapper.textContent = transformTime(Math.floor($video.currentTime))
    }
  })

  // DURATIONBAR
  $durationBar.addEventListener('click', clickedBar);

  progressElements.forEach(element => {
    element.onmouseover = element.onmouseout = isHover;
  });

  $durationBar.addEventListener('mousemove', (e) => {
    setTime(e);
  })

  // RETOUR 10S
  $previousButton.addEventListener('click', () => {
    if($video.currentTime - 10 >= 0) {
      $video.currentTime -= 10
    } else {
      $video.currentTime = 0;
    }
  })
  
  // AVANCE 10S
  $nextButton.addEventListener('click', () => {
    if($video.currentTime + 10 <= $video.duration) {
      $video.currentTime += 10
    } else {
      $video.currentTime = $video.duration
    }
  })

  $timeWrapper.textContent = transformTime(Math.floor($video.duration));
}

//INACTIVTÉ

let timeoutInMiliseconds = 10000;
let timeoutId; 
const $header = document.getElementById('headerPlayer');
const $settingBar = document.getElementById('settingBar');
  
const startTimer = () => { 
    timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds)
}

const doInactive = () => {
    $header.classList.add('headerPlayer-transition');
    $settingBar.classList.add('settingBar-transition');
    $progressBarIndicator.classList.add('is-hidden')
}

const resetTimer = () => { 
    window.clearTimeout(timeoutId)
    $header.classList.remove('headerPlayer-transition')
    $settingBar.classList.remove('settingBar-transition');
    $progressBarIndicator.classList.remove('is-hidden');

    startTimer();
}
 
const setupTimers = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
     
    startTimer();
}

setupTimers();

// EXIT
const $exitButton = document.getElementById('buttonExit');


// FULLSCREEN


// MENU EPISODES
const $episodeButton = document.getElementById('episodeButton');
const $menuPlayer = document.getElementById('menuPlayer');
const $buttonExitMenuPlayer = document.getElementById('buttonExitMenuPlayer');

$episodeButton.addEventListener('click', () => {
  $menuPlayer.classList.add('is-open');
});

$buttonExitMenuPlayer.addEventListener('click', () => {
  $menuPlayer.classList.remove('is-open');
});
