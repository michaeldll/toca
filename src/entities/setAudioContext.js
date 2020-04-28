const BaseAudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new BaseAudioContext();

//single compressor
const compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
compressor.knee.setValueAtTime(40, audioContext.currentTime);
compressor.ratio.setValueAtTime(12, audioContext.currentTime);
compressor.attack.setValueAtTime(0, audioContext.currentTime);
compressor.release.setValueAtTime(0.25, audioContext.currentTime);

let analysers = [];
let buffersLengths = [];
let dataArrays = [];
let players = [];

const setAudioContext = file => {
  const init = buffer => {
    newPlayer.file = file;
    newPlayer.buffer = buffer;
    newPlayer.loop = true;
    //uncomment this if you want to autostart sounds

    // player.start();
    // console.log('launching sound');

    newPlayer.connect(newAnalyser);
    newAnalyser.connect(compressor);

    let newBufferLength = newAnalyser.frequencyBinCount;
    let newDataArray = new Uint8Array(newBufferLength);

    newAnalyser.getByteTimeDomainData(newDataArray);

    compressor.connect(audioContext.destination);

    players.push(newPlayer);
    buffersLengths.push(newBufferLength);
    dataArrays.push(newDataArray);
    analysers.push(newAnalyser);
  };
  /* Analyser */
  let newAnalyser = audioContext.createAnalyser();
  newAnalyser.fftSize = 1024;

  /* Music */
  let newPlayer = audioContext.createBufferSource();
  newPlayer.connect(compressor);

  fetch(file) // i.e. :'./assets/bass.mp3'
    .then(response => response.arrayBuffer())
    .then(binAudio => audioContext.decodeAudioData(binAudio))
    .then(buffer => {
      init(buffer);
    });
};

export {
  setAudioContext,
  audioContext,
  buffersLengths,
  dataArrays,
  analysers,
  players,
};
