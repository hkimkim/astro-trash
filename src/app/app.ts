import { GetSprite } from '../assets/loader';
import * as PIXI from 'pixi.js';
import { Player } from '../app/player'
import { SpaceDebris } from '../app/spaceDebris';


export declare type spaceObject = Player | SpaceDebris

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

    static startMessage = new PIXI.Text('Press Space to Start', {
        fill : 0x000000,
        align : 'center',
        height: 20,
        width: 30,
        fontSize: 7,
    });


    static Stage: PIXI.Container;
    static Width = 0;
    static Size = 0;
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
            // TODO: change background
            backgroundColor : 0xffffff,
            resolution: 3,
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        GameApp.Stage = this.app.stage;
        GameApp.Width = width - 1;
        GameApp.Size = height;

        parent.replaceChild(this.app.view, parent.lastElementChild);

        // Set keyboard event
        window.onkeydown = (ev: KeyboardEvent): any => {
            if (ev.key == " ") {
                GameApp.PressedSpace = true;
                console.log("pressed space")
            } 

            if (ev.key == "ArrowDown" || ev.key == "s") {
                GameApp.PressedDown = true;
                console.log("pressed down")
            }

            if (ev.key == "ArrowUp" || ev.key == "w") {
                GameApp.PressedUp = true;
                console.log("pressed up ")
            }
          };

        GameApp.SetUpGame();           

        this.app.ticker.add((delta) => {
            GameApp.Update(delta);

            // Update the display
            if (!GameApp.Play && GameApp.Score != 0 ) {
                GameApp.ScoreBoard.text = "Game Over PUNK!"
            } else {
                GameApp.ScoreBoard.text = "Score: " + GameApp.Score;
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

        // Add start screen
        GameApp.startMessage.position.x = 120;
        GameApp.startMessage.position.y = 60;
        GameApp.Stage.addChild(GameApp.startMessage);

        // Add score board to stage
        GameApp.Stage.addChild(GameApp.ScoreBoard);
        this.ScoreNextObstacle = 0;
        console.log("Game setup done")
    }

    static Update(delta: number) {

        if (this.PressedSpace) {
            GameApp.Stage.removeChild(GameApp.startMessage)
            this.Play = true;
            this.PressedSpace = false;
        }

        if (this.Play) {

            // update entities in current frame
            for (let i = 0; i < GameApp.ActiveEntites.length; i++) {
                const currentEntity = GameApp.ActiveEntites[i];
                currentEntity.Update(delta, GameApp.ActiveEntites);
        
                if (currentEntity.sprite.x < -20) {
                  currentEntity.sprite.destroy();
                  GameApp.ActiveEntites.splice(i, 1);
                }
            }
           
            this.Score += delta / 50;
            
            // Add space debris obstacles
            if (GameApp.ShouldPlaceNextSpaceDebris()) {
                // TODO: this doesn't work!
                let obstacleList = ['obstacle1', 'obstacle2', 'obstacle3', 'obstacle4'];
                let randomValue = obstacleList[Math.floor(obstacleList.length * Math.random())];

                GameApp.AddSpaceDebris('obstacle2', 60, true);
            }

            // Add star image
            // GameApp.AddSpaceDebris("astronaut", 20, false);


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
    // currently cp the code
    static calculateNextSpaceDebrisScore(): number {
        // let's have a minimum distance so objects don't appear next to each other
        let minimumDistance = 25;

        // we can define a level of difficulty to make it harder as we go on (limit is 5)
        let difficulty = Math.min(this.Score / 100, 5);

        // define the random value based on values above
        return (Math.random() * 10 - (difficulty * 4)) + minimumDistance;
    }


    // Checks if next space debris needs to be place on screen
    // make random
    // TODO: Qiana
    static ShouldPlaceNextSpaceDebris(): boolean {
        // return (this.Score >=  this.ScoreNextObstacle);

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
