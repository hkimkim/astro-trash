/**
 * Loads game assets
 */
import astronaut from './images/Space/astronaut/*.png';
import obstacle1 from './images/Space/obstacle1/*.png';
import obstacle2 from './images/Space/obstacle2/*.png';
import obstacle3 from './images/Space/obstacle3/*.png';
import obstacle4 from './images/Space/obstacle4/*.png';
import starimage from './images/Space/starimage/*.png';
import starimage_color from './images/Space/starimage-color/*.png';
import * as PIXI from 'pixi.js'

// Load game assets from image paths
const spriteFrames = {
    astronaut: Object.values(astronaut),
    obstacle1: Object.values(obstacle1),
    obstacle2: Object.values(obstacle2),
    obstacle3: Object.values(obstacle3),
    obstacle4: Object.values(obstacle4),
    starimage: Object.values(starimage),
    starimage_color: Object.values(starimage_color),
};

// Adds texture to game assets
export function GetSprite(name) {
    return new PIXI.AnimatedSprite(spriteFrames[name].map(path => PIXI.Texture.from(path)))
}

