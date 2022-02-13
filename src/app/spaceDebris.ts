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
        // this.solid = isSolid;
    }

    // TODO: function that updates the distance 
    public Update(delta: number) {
        // calculate where the junk should be placed on the screen
        let scrollSpeed = GameApp.spaceDebrisSpeed + Math.min(GameApp.Score / 15.0, 1);
        this.sprite.x -= delta * scrollSpeed
    }
}

