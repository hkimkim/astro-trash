import { GetSprite } from "../assets/loader"
import * as PIXI from "pixi.js"
import { GameApp } from "./app"; 
// TODO: not sure if this will lead to a circular import error

export class Player {
    sprite: PIXI.AnimatedSprite;
    // isMidPlane: Boolean; 

    public constructor() {
        this.sprite = GetSprite("astronaut");
        // starting position of the astronaut
        this.sprite.x = 5; 
        // this.sprite.y = GameApp.yPosition;
        this.sprite.animationSpeed = 0.05;
        this.sprite.play();

        GameApp.Stage.addChild(this.sprite);
    }

    private checkCollide(otherSprite: PIXI.Sprite) {
        let playerBounds = this.sprite.getBounds();
        let SpaceDebrisBounds = otherSprite.getBounds();

        // return true if it is in bound and false if out of bounds
        return true
    }


    public Update() {
        // check if key pressed down and move downwards
        if (GameApp.PressedDown) {
            // this is just an inital number
            this.sprite.y = -5; 
        }

        // check if the key pressed up and move upwards
        if (GameApp.PressedUp) {
            this.sprite.y = +5
        }

        // check if user is colliding with any of the entity
    }
}