import { GetSprite } from '../assets/loader';
import * as PIXI from 'pixi.js';
import { Player } from '../app/player'
import { SpaceDebris } from '../app/spaceDebris';


export declare type spaceObject = Player | SpaceDebris
export let listOfSpaceJunkFacts: string[] = [
    'A piece of space debris can reach speeds of 4.3 to 5 miles per second. That’s nearly 7 times faster than a bullet and just about the equivalent of being hit by a bowling ball moving at 300 miles per hour.',
    'There are about 4,700 satellites still in space, but only an approximate 1,800 are still working. All space trash!',
    'In one year, the International Space Station had to coordinate three shifts in position to avoid disastrous collisions with space debris, a feat that requires days of effort',
    'According to the National Oceanic and Atmospheric Administration, an average total between 200 – 400 tracked space debris enter Earth’s atmosphere every year',
]; 


// Prepare frames
// const playerFrames: GetSprite = spriteFrames;

export class GameApp {

    private app: PIXI.Application;

    // Set up score board
    static ScoreBoard: PIXI.Text = new PIXI.Text("Score: ", {
        fontSize: 5,
        fill: "#aaff",
        align: "center",
        stroke: "#aaaaaa",
        strokeThickness: 0
    });

    static Stage: PIXI.Container;
    static Width = 0;
    static Play: boolean = true;

    static PressedUp = false;
    static PressedDown = false;
    static PressedSpace = false;    // space bar used to start the game

    static ActiveEntites: Array<spaceObject> = [];
    static spaceDebrisSpeed = 3;

    // Variable used to check if next obstacle should be staged
    // Used to compare current score 
    // with "hypothetical" next score if user jumps the next object
    static ScoreNextObstacle = 0;

    static Score: number = 0;
    static MaxScore = 0;

    constructor(parent: HTMLElement, width: number, height: number) {

        this.app = new PIXI.Application({
            width, 
            height, 
            // TODO: change background to background image
            antialias: false,
            backgroundColor : 0xffffff,
            resolution: 3,
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        GameApp.Stage = this.app.stage;
        GameApp.Width = width - 1;

        parent.replaceChild(this.app.view, parent.lastElementChild);

        // Set keyboard event
        window.onkeydown = (ev: KeyboardEvent): any => {
            if (ev.key == " ") {
                GameApp.PressedSpace = true;
                console.log("space pressed")
            } 

            if (ev.key == "ArrowDown" || ev.key == "w") {
                GameApp.PressedDown = true;
                console.log("pressed down")
            }

            if (ev.key == "ArrowUp" || ev.key == "d") {
                GameApp.PressedUp = true;
                console.log("pressed up ")
            }
          };

        GameApp.SetUpGame();           

        this.app.ticker.add((delta) => {
            GameApp.Update(delta);

            // Update the display
            if (GameApp.Play) {
                GameApp.ScoreBoard.text = "Score: " + GameApp.Score;
            } else {
                GameApp.ScoreBoard.text = "Game Over PUNK!"
            }
        });
    }

    // Sets game stage
    static SetUpGame() {
        this.Score = 0;
        this.ActiveEntites = new Array<spaceObject>();
        this.Stage.removeChild();

        // Initalize player
        let player = new Player();
        GameApp.ActiveEntites.push(player);

        // Add score board to stage
        GameApp.Stage.addChild(GameApp.ScoreBoard);
        // GameApp.Stage.addChild(player);
        this.ScoreNextObstacle = 0;
        console.log("Setup game run")
    }

    static Update(delta: number) {
        if (this.Play) {
            console.log()
            for (let i = 0; i < GameApp.ActiveEntites.length; i++) {
                const currentEntity = GameApp.ActiveEntites[i];
                currentEntity.Update(delta, GameApp.ActiveEntites);
        
                if (currentEntity.sprite.x < -20) {
                  currentEntity.sprite.destroy();
                  GameApp.ActiveEntites.splice(i, 1);
                }
              }
            // TODO: Loop over current activity space objects
            // and Update the current entity (could be player or space debris)
           
            this.Score += delta / 6;

            // TODO: Update the score
            // TODO: Check if current score is bigger than max score then set new max score
            // TODO: Check if new space debris needs to be shown on stage

        } else {
            // When spaced pressed to start the game

            if (GameApp.PressedSpace) {
                this.Play = false;
                this.SetUpGame();
            }

            GameApp.PressedSpace = false;
        }
    }


    // Calculates the "hypothetical" score if user jumps the next space debris
    // TODO: think of a model for calculating scores
    static calculateNextSpaceDebrisScore(): number {
        
    }


    // Checks if next space debris needs to be place on screen
    // make random
    // TODO: Qiana
    static ShouldPlaceNextSpaceDebris(): boolean {
        return true;
    }

    // Add new SpaceDebris to stage
    private static AddSpaceDebris(
        spriteName: string,
        height: number,
        isSolid: boolean,
    ) {
        let spaceDebris = new SpaceDebris(
            spriteName, 
            GameApp.Width, 
            height, 
            isSolid
        );
        GameApp.ActiveEntites.push(spaceDebris);
        GameApp.Stage.addChild(spaceDebris.sprite);
    }

}
