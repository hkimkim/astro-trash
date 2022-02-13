import { GetSprite } from "../assets/loader"
import * as PIXI from 'pixi.js';
import { GameApp } from "./app"; 

export class SpaceDebris {
    sprite: PIXI.AnimatedSprite;
    solid: boolean = true;
    
    public constructor(spriteName: string, xPosition: number, yPosition: number, isSolid: boolean) {
        this.sprite = GetSprite(spriteName);
        this.sprite.x = xPosition; 
        this.sprite.y = yPosition;
        this.solid = isSolid;
    }

    // TODO: function that updates the distance 
    public Update(delta: number) {
        let baseScrollSpeed = (this.solid) ? GameApp.spaceDebrisSpeed : GameApp.spaceDebrisSpeed - 1;

        // modifier for speed depending on score so that it gets more difficult
        let scrollSpeed = baseScrollSpeed + Math.min(GameApp.Score / 100 , 1);
  
        // move to the left, watch out!
        this.sprite.x -= delta * (scrollSpeed);
    }
}

