import {
    setAudioContext,
    buffersLengths,
    dataArrays,
    analysers,
    players,
} from './entities/setAudioContext';

import Visualizer from './entities/Visualizer';
import Vector from 'victor';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const C_WIDTH = window.innerWidth;
const C_HEIGHT = window.innerHeight;

let visualizers = [];
// let frameCounter = 0;
let radians = [0, Math.PI * 2, (Math.PI * 2) / 4, (Math.PI * 2) / 2];
let isPushed = false;
let playersStarted = {
    left: false,
    right: false,
    up: false,
    down: false,
};
let limit = 12;
let timesPressed = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
};
let ended = false;

const tempo = 2100;
let tempoInterval = null;
let tick = false;
let storedClicks = [];

//helper functions
const getNotEmptyArr = arr => arr.filter(data => typeof data !== 'undefined');

const isInitialized = (notEmptyArr, originalArr) =>
    notEmptyArr.length === originalArr.length && notEmptyArr.length !== 0;

const isMusicAvailable = () => {
    const isMusicInitialized =
        isInitialized(getNotEmptyArr(dataArrays), dataArrays) &&
        isInitialized(getNotEmptyArr(buffersLengths), buffersLengths) &&
        isInitialized(getNotEmptyArr(analysers), analysers) &&
        isInitialized(getNotEmptyArr(players), players);

    return isMusicInitialized;
};

const getDirections = (x, y) => ({
    left: x <= C_WIDTH / limit,
    right: x >= C_WIDTH - C_WIDTH / limit,
    up: y <= C_HEIGHT / limit,
    down: y >= C_HEIGHT - C_HEIGHT / limit,
});

const files = {
    left: './assets/drums_conga.mp3',
    up: './assets/lead_and_noise.mp3',
    right: './assets/bass_synth.mp3',
    down: './assets/lower_rhythm_guitar.mp3',
};

const init = () => {
    ctx.canvas.width = C_WIDTH;
    ctx.canvas.height = C_HEIGHT;
    setAudioContext(files.right);
    setAudioContext(files.left);
    setAudioContext(files.up);
    setAudioContext(files.down);
};

const bubbleValues = {
    up: {
        before: {
            top: '-13%',
            height: '25%',
        },
        after: {
            top: '-9%',
            height: '16.66%',
        },
    },
    left: {
        before: {
            left: '-13%',
            width: '22%',
        },
        after: {
            left: '-9%',
            width: '16.66%',
        },
    },
    right: {
        before: {
            right: '-13%',
            width: '22%',
        },
        after: {
            right: '-9%',
            width: '16.66%',
        },
    },
    bottom: {
        before: {
            bottom: '-12%',
            height: '22%',
        },
        after: {
            bottom: '-9%',
            height: '16.66%',
        },
    },
};

const togglePlayer = direction => {
    const player = players.find(player => player.file === files[direction]);

    if (!playersStarted[direction] && !player.ended) {
        player.start();
        playersStarted[direction] = true;
    } else {
        player.stop();
        playersStarted[direction] = false;
        player.ended = true;
    }
};

const animateBubble = direction => {
    switch (direction) {
        case 'up':
            if (document.querySelector('.upper')) {
                document.querySelector('.upper').style.top =
                    bubbleValues.up.before.top;
                document.querySelector('.upper').style.height =
                    bubbleValues.up.before.height;
                setTimeout(() => {
                    if (document.querySelector('.upper')) {
                        document.querySelector('.upper').style.top =
                            bubbleValues.up.after.top;
                        document.querySelector('.upper').style.height =
                            bubbleValues.up.after.height;
                    }
                }, 200);
            }
            break;

        case 'left':
            if (document.querySelector('.left')) {
                document.querySelector('.left').style.left =
                    bubbleValues.left.before.left;
                document.querySelector('.left').style.width =
                    bubbleValues.left.before.width;
                setTimeout(() => {
                    if (document.querySelector('.left')) {
                        document.querySelector('.left').style.left =
                            bubbleValues.left.after.left;
                        document.querySelector('.left').style.width =
                            bubbleValues.left.after.width;
                    }
                }, 300);
            }
            break;

        case 'right':
            if (document.querySelector('.right')) {
                document.querySelector('.right').style.right =
                    bubbleValues.right.before.right;
                document.querySelector('.right').style.width =
                    bubbleValues.right.before.width;
                setTimeout(() => {
                    if (document.querySelector('.right')) {
                        document.querySelector('.right').style.right =
                            bubbleValues.right.after.right;
                        document.querySelector('.right').style.width =
                            bubbleValues.right.after.width;
                    }
                }, 300);
            }
            break;

        case 'down':
            if (document.querySelector('.down')) {
                document.querySelector('.down').style.bottom =
                    bubbleValues.bottom.before.bottom;
                document.querySelector('.down').style.height =
                    bubbleValues.bottom.before.height;
                setTimeout(() => {
                    if (document.querySelector('.down')) {
                        document.querySelector('.down').style.bottom =
                            bubbleValues.bottom.after.bottom;
                        document.querySelector('.down').style.height =
                            bubbleValues.bottom.after.height;
                    }
                }, 300);
            }
            break;

        default:
            break;
    }
};

const handleClick = (dir, presses) => {
    //start storing additional clicks to match tempo
    if (Object.values(dir).find(d => d === true)) {
        tempoInterval = setInterval(() => {
            tick = true;
        }, tempo);
    }
    //toggle and animate
    if (dir.left && presses.left <= 2) {
        togglePlayer('left');
        animateBubble('left');
        timesPressed.left++;
        if (document.querySelector('.left')) {
            document.querySelector('.left').classList.add('black');
            document.querySelector('.left').classList.remove('active');
        }
    } else if (dir.right && presses.right <= 2) {
        togglePlayer('right');
        animateBubble('right');
        timesPressed.right++;
        if (document.querySelector('.right')) {
            document.querySelector('.right').classList.add('black');
            document.querySelector('.right').classList.remove('active');
        }
    } else if (dir.up && presses.up <= 2) {
        togglePlayer('up');
        animateBubble('up');
        timesPressed.up++;
        if (document.querySelector('.upper')) {
            document.querySelector('.upper').classList.add('black');
            document.querySelector('.upper').classList.remove('active');
        }
    } else if (dir.down && presses.down <= 2) {
        togglePlayer('down');
        animateBubble('down');
        if (document.querySelector('.down')) {
            document.querySelector('.down').classList.add('black');
            document.querySelector('.down').classList.remove('active');
        }
        timesPressed.down++;
    }

    // hides buttons after two presses
    if (dir.left && presses.left === 2 && document.querySelector('.left')) {
        document.querySelector('.left').style.opacity = 0;
        setTimeout(() => {
            document.querySelector('.left').style.display = 'none';
        }, 200);
    }
    if (dir.right && presses.right === 2 && document.querySelector('.right')) {
        document.querySelector('.right').style.opacity = 0;
        setTimeout(() => {
            document.querySelector('.right').style.display = 'none';
        }, 200);
    }

    if (dir.up && presses.up === 2 && document.querySelector('.upper')) {
        document.querySelector('.upper').style.opacity = 0;
        setTimeout(() => {
            document.querySelector('.upper').style.display = 'none';
        }, 200);
    }
    if (dir.down && presses.down === 2 && document.querySelector('.down')) {
        document.querySelector('.down').style.opacity = 0;
        setTimeout(() => {
            document.querySelector('.down').style.display = 'none';
        }, 200);
    }
};

const addActiveClass = (dir, presses) => {
    //toggle and animate
    if (dir.left && presses.left <= 2) {
        if (document.querySelector('.left')) {
            document.querySelector('.left').classList.add('active');
        }
    } else if (dir.right && presses.right <= 2) {
        if (document.querySelector('.right')) {
            document.querySelector('.right').classList.add('active');
        }
    } else if (dir.up && presses.up <= 2) {
        if (document.querySelector('.upper')) {
            document.querySelector('.upper').classList.add('active');
        }
    } else if (dir.down && presses.down <= 2) {
        if (document.querySelector('.down')) {
            document.querySelector('.down').classList.add('active');
        }
    }
};

const onEndMouseDown = () => {
    location.reload();
};

//start incrementing / decrementing radians for angles
const setRadians = () => {
    if (radians[0] < Math.PI * 2) {
        radians[0] += (Math.PI * 2) / 180 / 4;
    } else {
        radians[0] = 0;
    }

    if (radians[1] <= Math.PI * 2) {
        radians[1] -= (Math.PI * 2) / 180 / 4;
    } else {
        radians[1] = Math.PI * 2;
    }

    if (radians[2] < Math.PI * 2) {
        radians[2] += (Math.PI * 2) / 180 / 4;
    } else {
        radians[2] = 0;
    }

    if (radians[3] <= Math.PI * 2) {
        radians[3] -= (Math.PI * 2) / 180 / 4;
    } else {
        radians[3] = Math.PI * 2;
    }
};

const initEvents = () => {
    const onMouseDown = e => {
        const x = e.clientX;
        const y = e.clientY;
        const directions = getDirections(x, y);

        addActiveClass(directions, timesPressed);

        if (!tempoInterval) {
            handleClick(directions, timesPressed);
        } else {
            if (directions.left && timesPressed.left < 2) {
                storedClicks.push({
                    dir: directions,
                    presses: timesPressed,
                });
            } else if (directions.right && timesPressed.right < 2) {
                storedClicks.push({
                    dir: directions,
                    presses: timesPressed,
                });
            } else if (directions.up && timesPressed.up < 2) {
                storedClicks.push({
                    dir: directions,
                    presses: timesPressed,
                });
            } else if (directions.down && timesPressed.down < 2) {
                storedClicks.push({
                    dir: directions,
                    presses: timesPressed,
                });
            }
        }
    };

    const onMouseMove = e => {
        const indicators = document.querySelector('.indicators.show');
        const x = e.clientX;
        const y = e.clientY;
        const directions = getDirections(x, y);
        const halfCircles = {
            left: document.querySelector('.top.left.half-circle'),
            top: document.querySelector('.upper.half-circle'),
            right: document.querySelector('.right.half-circle'),
            down: document.querySelector('.down.half-circle'),
        };

        if (indicators) indicators.classList.remove('show');

        if (document.querySelectorAll('.half-circle'))
            document.querySelectorAll('.half-circle').forEach(node => {
                node.style.opacity = 0;
            });

        if (directions.left && halfCircles.left) {
            halfCircles.left.style.opacity = 0.8;
        } else if (directions.right && halfCircles.right) {
            halfCircles.right.style.opacity = 0.8;
        } else if (directions.up && halfCircles.top) {
            halfCircles.top.style.opacity = 0.8;
        } else if (directions.down && halfCircles.down) {
            halfCircles.down.style.opacity = 0.8;
        }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
};

const update = () => {
    if (tick) {
        console.log(storedClicks);
        storedClicks.forEach(click => {
            handleClick(click.dir, click.presses);
            storedClicks.splice(0, 1);
        });
        tick = false;
    }
    requestAnimationFrame(update);

    //hide loader and draw visualizer
    //when music is available
    if (isMusicAvailable() && !isPushed) {
        document.querySelector('.loader').classList.add('hide');
        document.querySelector('.indicators').classList.add('show');

        setTimeout(() => {
            if (!isPushed) {
                //init visualizers
                //TODO: make this a for loop, or something

                //left
                visualizers.push(
                    new Visualizer(
                        analysers[0],
                        dataArrays[0],
                        buffersLengths[0],
                        Vector(0, C_HEIGHT),
                        '#E3B36F',
                        canvas.height / 4,
                    ),
                );
                //right
                visualizers.push(
                    new Visualizer(
                        analysers[1],
                        dataArrays[1],
                        buffersLengths[1],
                        Vector(C_WIDTH - 20, C_HEIGHT),
                        '#E3CA6F',
                        canvas.height / 4,
                    ),
                );
                //up
                visualizers.push(
                    new Visualizer(
                        analysers[2],
                        dataArrays[2],
                        buffersLengths[2],
                        Vector(C_WIDTH / 2 + 20, 0),
                        '#f9d586',
                        canvas.height / 4,
                    ),
                );
                //down
                visualizers.push(
                    new Visualizer(
                        analysers[3],
                        dataArrays[3],
                        buffersLengths[3],
                        Vector(C_WIDTH / 2 - 20, C_HEIGHT * 2),
                        '#FDEE7C',
                        canvas.height / 4,
                    ),
                );

                //init events
                //starts music players if user clicks at the edges of the screen

                initEvents();

                //prevents several initializations
                isPushed = true;
            }
        }, 500);
    }

    //if 4 visualizers initialized, draw them
    //TODO: make this a for loop, or something
    if (visualizers[0] && visualizers[1] && visualizers[2] && visualizers[3]) {
        setRadians();

        //draw things around a circle
        if (playersStarted.left) visualizers[0].draw(ctx, radians[0], 0);
        if (playersStarted.right) visualizers[1].draw(ctx, radians[1], 1);
        if (playersStarted.up) visualizers[2].draw(ctx, radians[2], 0);
        if (playersStarted.down) visualizers[3].draw(ctx, radians[3], 1);
    }

    if (
        timesPressed.left >= 2 &&
        timesPressed.right >= 2 &&
        timesPressed.up >= 2 &&
        timesPressed.down >= 2 &&
        !ended
    ) {
        ended = true;

        document.querySelector('.end-screen').classList.add('show');

        document
            .querySelector('.end-screen .a')
            .addEventListener('mousedown', onEndMouseDown);
        setTimeout(() => {
            document.querySelector('.end-screen .a').classList.add('show');
        }, 1000);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
};

init();
update();
