import { GetSprite } from '../assets/loader';
import * as PIXI from 'pixi.js';
import { Player } from '../app/player'
import { SpaceDebris } from './spaceDebris';

type spaceObject = Player | SpaceDebris

// Prepare frames
// const playerFrames: GetSprite = spriteFrames;

export class GameApp {

    private app: PIXI.Application;

    // Set up score board
    static ScoreBoard: PIXI.Text = new PIXI.Text("Score: ", {
        fontSize: 7,
        align: "center",
        fill: "#ffffff",
    });

    static Stage: PIXI.Container;
    static Width = 0;
    static Play: boolean = false;

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
            backgroundColor : 0x000000,
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
                console.log("pressed arrow down")
            }

            if (ev.key == "ArrowUp" || ev.key == "s") {
                GameApp.PressedUp = true;
                console.log("pressed space pressed")
            }
          };

        GameApp.SetUpGame();            

        this.app.ticker.add((delta) => {
            GameApp.Update(delta)
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
            
            // TODO: Loop over current activity space objects
            // and Update the current entity (could be player or space debris)
           
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
