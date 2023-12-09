// ----- Audio Sources
const highAcc = new Tone.Player({
  url: "https://car-sound-gen.s3.ap-northeast-2.amazonaws.com/highAcc.wav",
}).toDestination();

const highDec = new Tone.Player({
  url: "https://car-sound-gen.s3.ap-northeast-2.amazonaws.com/highDec.wav",
}).toDestination();

const lowAcc = new Tone.Player({
  url: "https://car-sound-gen.s3.ap-northeast-2.amazonaws.com/lowAcc.wav",
}).toDestination();

const lowDec = new Tone.Player({
  url: "https://car-sound-gen.s3.ap-northeast-2.amazonaws.com/lowDec.wav",
}).toDestination();

// ----- Environmental Variables
var pitchMultiplier = 0.8;
var lowPitchMin = 1;
var lowPitchMax = 6;
var highPitchMultiplier = 0.25;

// ----- Variables
var pitch = 0;
var accFade = 0;
var decFade = 1;
var highFade = 0;
var lowFade = 1;

// ----- Car Variables
var carEngineREV = 0; // 0 to 1
var carAccelInput = 0; // -1 to 1

// ----- HTML Elements
var playButton = document.getElementById("playButton");
var revInput = document.getElementById("revInput");
var accelInput = document.getElementById("accelInput");
var revDisplay = document.getElementById("revInputDisplay");
var accelDisplay = document.getElementById("accelInputDisplay");

highAcc.loop = true;

// ----- Functions
const setup = () => {
  highAcc.loop = true;
  highDec.loop = true;
  lowAcc.loop = true;
  lowDec.loop = true;

  playButton.addEventListener("click", async () => {
    Tone.start();
    highAcc.start();
    highDec.start();
    lowAcc.start();
    lowDec.start();
  });

  revInput.addEventListener("input", (e) => {
    carEngineREV = e.target.value / 100;
    revDisplay.innerHTML = carEngineREV;
  });

  accelInput.addEventListener("input", (e) => {
    carAccelInput = e.target.value / 50 - 1;
    accelDisplay.innerHTML = carAccelInput;
  });
};

const fixedUpdate = () => {
  pitch = lerp(lowPitchMin, lowPitchMax, carEngineREV);

  highAcc.playbackRate = pitch * pitchMultiplier * highPitchMultiplier;
  highDec.playbackRate = pitch * pitchMultiplier * highPitchMultiplier;
  lowAcc.playbackRate = pitch * pitchMultiplier;
  lowDec.playbackRate = pitch * pitchMultiplier;

  accFade = Math.abs(carAccelInput);
  decFade = 1 - accFade;

  highFade = reverseLerp(0.2, 0.8, carEngineREV);
  lowFade = 1 - highFade;

  highFade = 1 - (1 - highFade) * (1 - highFade);
  lowFade = 1 - (1 - lowFade) * (1 - lowFade);
  accFade = 1 - (1 - accFade) * (1 - accFade);
  decFade = 1 - (1 - decFade) * (1 - decFade);

  lowAcc.volume = lowFade * accFade;
  lowDec.volume = lowFade * decFade;
  highAcc.volume = highFade * accFade;
  highDec.volume = highFade * decFade;
};

const lerp = (a, b, t) => {
  return a + t * (b - a);
};

const reverseLerp = (a, b, v) => {
  return (v - a) / (b - a);
};

// ----- Main
setup();
setInterval(() => {
  fixedUpdate();
}, 50);
