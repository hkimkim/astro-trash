import { GetSprite } from "../assets/loader"
import * as PIXI from "pixi.js"
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
    public Update() {}
}

