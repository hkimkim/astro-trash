import { GetSprite } from "../assets/loader"
import * as PIXI from 'pixi.js';
import { GameApp } from "./app"; 
import { spaceObject } from "./app";

// TODO: not sure if this will lead to a circular import error

export class Player {
    sprite: PIXI.AnimatedSprite;
    speed: number;

    public constructor() {
        this.sprite = GetSprite("astronaut");
        // starting position of the astronaut
        this.sprite.x = 20; 
        this.sprite.y = 100;
        this.speed = 1;
        this.sprite.anchor.set(0, 1);
        this.sprite.animationSpeed = 0.05;
        this.sprite.play();

        GameApp.Stage.addChild(this.sprite);
    }

    private checkCollide(otherSprite: PIXI.Sprite) {
        if (this.sprite == otherSprite){
            return false;
        }

        let playerBounds = this.sprite.getBounds();
        let SpaceDebrisBounds = otherSprite.getBounds();

        // return true if it is in bound and false if out of bounds
        return !(
            playerBounds.x > SpaceDebrisBounds.x + SpaceDebrisBounds.width ||
            playerBounds.x + playerBounds.width < SpaceDebrisBounds.x ||
            playerBounds.y + playerBounds.height < SpaceDebrisBounds.y ||
            playerBounds.y > SpaceDebrisBounds.y + SpaceDebrisBounds.height
          );
    }


    public Update(delta: number, activeEntities: Array<spaceObject>) {

        // TODO: Set boundaries so that it doesn't go out of the screen

        // check if key pressed down and move downwards
        /*if (GameApp.PressedDown) {
            // this is just an inital number
            this.sprite.y += delta * 5; 
            this.sprite.x += delta * 2;
            GameApp.PressedDown = false;
        }

        // check if the key pressed up and move upwards
        if (GameApp.PressedUp) {
            this.sprite.y -= delta * 5;
            this.sprite.x += delta * 2;
            GameApp.PressedUp = false;
        }*/

        // check if user is colliding with any of the entity
        // for (const currentEntity of GameApp.ActiveEntites) {
        //     if (this.checkCollide(currentEntity.sprite)) {
        //         GameApp.Play = false;
        //     }
        // }
        
        if (this.sprite.y > GameApp.Size || this.sprite.y < this.sprite.height + 5){
            this.speed *= -1;
            console.log(this.speed);
        }
        else{
            if ((GameApp.PressedDown && this.speed < 0) || (GameApp.PressedUp && this.speed > 0)){
                this.speed *= -1;
            }
        }
        
        GameApp.PressedUp = false;
        GameApp.PressedDown = false;
        console.log(this.speed);
        this.sprite.y += this.speed * delta;
         
        for (const currentEntity of GameApp.ActiveEntites) {
            if (this.checkCollide(currentEntity.sprite)) {
                GameApp.Play = false;
            }
        }
    }
}