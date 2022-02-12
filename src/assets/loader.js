/**
 * Loads game assets
 */
import astronaut from './images/Space/astronaut.png';
import spaceDebrisOne from './images/Space/spaceDebrisOne.png';
import spaceDebrisTwo from './images/Space/spaceDebrisTwo.png';
import spaceDebrisThree from './images/Space/spaceDebrisThree.png';
import spaceDebrisFour from './images/Space/spaceDebrisFour.png';
// import hackbeanpot from './images/Space/hackbeanpot.jpeg';
// import jetpack from './images/Bomberman/Left/*.png';
import * as PIXI from "pixi.js"

// Load game assets from image paths
const spriteFrames = {
    astronaut: Object.values(astronaut),
    spaceDebrisOne: Object.values(spaceDebrisOne),
    spaceDebrisTwo: Object.values(spaceDebrisTwo),
    spaceDebrisThree: Object.values(spaceDebrisThree),
    spaceDebrisFour: Object.values(spaceDebrisFour),
    hackbeanpot: Object.values(hackbeanpot)
};

// Adds texture to game assets
export function GetSprite(name) {
    return new PIXI.AnimatedSprite(
        spriteFrames[name].map((path) => PIXI.Texture.from(path))
    );
}