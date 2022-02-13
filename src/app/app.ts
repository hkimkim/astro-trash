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

    static startScreen: PIXI.Sprite;
    static background: PIXI.Sprite;
    static popUp: PIXI.Sprite;

    static Stage: PIXI.Container;
    static Width = 0;
    static Size = 0;
    static Play: boolean = false;
    static flag: boolean;

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
            } 

            if (ev.key == "ArrowDown" || ev.key == "s") {
                GameApp.PressedDown = true;
            }

            if (ev.key == "ArrowUp" || ev.key == "w") {
                GameApp.PressedUp = true;
            }
          };

        GameApp.flag = true;
        GameApp.SetUpGame(GameApp.flag);           

        this.app.ticker.add((delta) => {
            GameApp.Update(delta);

            // Update the display
            if (!GameApp.Play && GameApp.Score != 0 ) {
                GameApp.ScoreBoard.text = "Game Over PUNK!"
                GameApp.Stage.addChild(GameApp.popUp);
            } else {
                GameApp.ScoreBoard.text = "Score: " + GameApp.Score.toFixed(0);
            }
        });
    }

    // Sets game stage
    static SetUpGame(flag: boolean) {
        this.Score = 0;
        this.ActiveEntites = new Array<spaceObject>();
        this.Stage.removeChildren();

        // Creates background
        GameApp.background = GetSprite("background");
        GameApp.background.x = 0;
        GameApp.background.y = 0;
        GameApp.background.width = (this.Width + 1);
        GameApp.background.height = this.Size;
        GameApp.Stage.addChild(GameApp.background);

        // Initalize player
        let player = new Player();
        GameApp.ActiveEntites.push(player);

        // Add score board to stage
        GameApp.Stage.addChild(GameApp.ScoreBoard);
        this.ScoreNextObstacle = 0;

        // Set up for pop-up facts
        GameApp.popUp = GetSprite("popup");
        GameApp.popUp.x = (this.Width + 1) / 3 + 10;
        GameApp.popUp.y = this.Size / 3 - 10;

        if (flag){
            // Add start screen background
            GameApp.startScreen = GetSprite("start");
            GameApp.startScreen.x = 0;
            GameApp.startScreen.y = 0;
            GameApp.startScreen.width = (this.Width + 1);
            GameApp.startScreen.height = this.Size;
            GameApp.Stage.addChild(GameApp.startScreen);

            // Add start screen
            GameApp.startMessage.position.x = ((this.Width + 1) / 2) - 30;
            GameApp.startMessage.position.y = (this.Size / 2) + 5;
            GameApp.Stage.addChild(GameApp.startMessage);
        }
    }

    static Update(delta: number) {

        if (this.Play){
            if (GameApp.flag){
                GameApp.Stage.removeChild(GameApp.startMessage)
                GameApp.Stage.removeChild(GameApp.startScreen);
            }
            else{
                GameApp.Stage.removeChild(GameApp.popUp);
            }

            // update entities in current frame
            for (let i = 0; i < GameApp.ActiveEntites.length; i++) {
                const currentEntity = GameApp.ActiveEntites[i];
                currentEntity.Update(delta, GameApp.ActiveEntites);
        
                if (currentEntity.sprite.x < -20) {
                  currentEntity.sprite.destroy();
                  GameApp.ActiveEntites.splice(i, 1);
                }
            }
           
            this.Score += delta / 40;
            
            // Add space debris obstacles
            if (GameApp.ShouldPlaceNextSpaceDebris()) {
                // TODO: this doesn't work!
                let obstacleList = ['obstacle1', 'obstacle2', 'obstacle3', 'obstacle4'];
                let randomObstacle= obstacleList[Math.floor(obstacleList.length * Math.random())];
                let randomPosition = this.getRandomInt(0, 180);

                console.log("chosen obstcle: ", randomObstacle);
                console.log("chosen position: ", randomPosition);
                GameApp.AddSpaceDebris(randomObstacle, randomPosition, true);

                this.ScoreNextObstacle += this.calculateNextSpaceDebrisScore();
                console.log("game score:" + GameApp.Score);
                console.log("next score: " + this.ScoreNextObstacle);
            }

            // Add star image
            // GameApp.AddSpaceDebris("starimage", 20, false);


        } else {
            // When spaced pressed to start the game

            if (GameApp.PressedSpace) {
                GameApp.flag = false;
                GameApp.SetUpGame(GameApp.flag);
                GameApp.Play = true;
            }
        }
        GameApp.PressedSpace = false;
    }

    private static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max); 
        return Math.floor(Math.random() * (max - min)) + min; 
    } 

    // Calculates the "hypothetical" score if user jumps the next space debris
    static calculateNextSpaceDebrisScore(): number {
        // let's have a minimum distance so objects don't appear next to each other
        let minimumDistance = 1;

        // we can define a level of difficulty to make it harder as we go on (limit is 5)
        let difficulty = Math.min(this.Score / 100, 5);

        // define the random value based on values above
        // console.log( (Math.random() * 10 - (difficulty * 4)) + minimumDistance);
        return (Math.random() - (difficulty * 1)) + minimumDistance;
    }


    // Checks if next space debris needs to be place on screen
    static ShouldPlaceNextSpaceDebris(): boolean {
        return (this.Score >=  this.ScoreNextObstacle);
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
