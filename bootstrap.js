import Game from "./class/game/Game.js";

if (!document.createElement('canvas').getContext) {
    location.href = 'https://browsehappy.com/';
}

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector('[data-play=openrider]');
/** @type {Game} */
let game;

window.addEventListener('resize', (e) => setCanvasSize());
setCanvasSize();

/**
 * Sets the canvas dimensions to those of its parent
 * Also reloads the context properties (mainly for fonts)
 */
function setCanvasSize() {
    canvas.style.width = canvas.parentElement.clientWidth + 'px';
    canvas.style.height = canvas.parentElement.clientHeight + 'px';
    canvas.width = canvas.parentElement.clientWidth * devicePixelRatio;
    canvas.height = canvas.parentElement.clientHeight * devicePixelRatio;

    setContextProperties(canvas.getContext('2d'));
}

/**
 * Sets the default drawing properties for the game
 * @param {CanvasRenderingContext2D} ctx
 */
function setContextProperties(ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = 'bold 15px Ubuntu';
}

/**
 * @param {{}} opt
 */
function newGame(opt) {
    game = new Game(canvas, opt);
    game.run();
    game.stateManager.push('parser');
}

function toggleGhost(ghostId) {
    game.stateManager.getState('track').toggleGhost(ghostId);
}

export const GAME = {
    'newGame': newGame,
    'toggleGhost': toggleGhost
};
