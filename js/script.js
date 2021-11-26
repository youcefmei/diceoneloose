
var game = null

/**
 * Class representing a Dice
 */
class Dice{
    /**
     * Create a dice with 6 faces
     * @param {string} id id of the dice
     * @param {string} dotClassName class of the dots
     * @param {string} currentFace initial face to show
     */
    constructor(id="dice",dotClassName="dice-dot",currentFace="one"){
        this.id = id
        this.currentFace = currentFace
        this.dotClassName = dotClassName
    }
    
    get dotNumberPossible(){
        return ["one","two","three","four","five","six"]
    } 

    get element(){
        return document.getElementById(this.id)    
    } 

    get dotsElements(){
        return document.getElementsByClassName(this.dotClassName)
    } 

    get face(){
        return this.currentFace
    }

    get faceNb(){
        return this.dotNumberPossible.indexOf(this.currentFace) +1   
    }

        /**
     * Set the dice face
     * @param {("one"|"two"|"three"|"four"|"five"|"six")} face - a face of the dice, random face if param not in "this.dotNumberPossible"
     */
    set face(f){
        // random face if f is not in "dotNumberPossible"
        if (!this.dotNumberPossible.includes(f)){
            let numberIdx = Math.floor(Math.random() * this.dotNumberPossible.length)
            f= this.dotNumberPossible[numberIdx]
        }

        if ((f!==this.currentFace) && (this.dotNumberPossible.includes(f)) ){
            this.currentFace = f
            for(let dot of this.dotsElements ) {
                if ( dot.classList.contains(`dice-${f}`) && dot.classList.contains("hide") ){
                    dot.classList.toggle("hide")
                }
                else if (!dot.classList.contains("hide") && !dot.classList.contains(`dice-${f}`)){
                    dot.classList.add("hide")
                }
            }
        } 
    }

    /**
     * Set the dice face
     * @param {("one"|"two"|"three"|"four"|"five"|"six")} face - a face of the dice
     * @returns the number associate to the face
     */
    setCurrentFace(face) {
        if ((face!==this.currentFace) && (this.dotNumberPossible.includes(face)) ){
            this.currentFace = face
            for(let dot of this.dotsElements ) {
                if ( dot.classList.contains(`dice-${face}`) && dot.classList.contains("hide") ){
                    dot.classList.toggle("hide")
                }
                else if (!dot.classList.contains("hide") && !dot.classList.contains(`dice-${face}`)){
                    dot.classList.add("hide")
                }
            }
        } 
        return  this.faceNb    
    }
    
    /**
     * Set a random dice face
     * @returns the number associate to the face
     */
    setRandom(){
        let numberIdx = Math.floor(Math.random() * this.dotNumberPossible.length)
        let face = this.dotNumberPossible[numberIdx]
        return this.setCurrentFace(face)
    }
}

class Player{
    /**
     * Create a new player
     * @param {string} name name of the player
     * @param {string} scoreId player's score id
     * @param {string} scoreTempId player's temporary score id
     * @param {string} dotId dot id of the element showing if it's player's turn
     */
    constructor(name="player 1",scoreId="player-one-score",scoreTempId="player-one-score-temp",dotId="player-one-dot" ){
        this.name = name
        this.scoreId = scoreId
        this.scoreTempId = scoreTempId
        this.dotId = dotId
        // elements
        this.dotElement = document.getElementById(this.dotId)
        this.scoreElement = document.getElementById(this.scoreId)
        this.scoreTempElement = document.getElementById(this.scoreTempId)
        // init scores
        this.initScores()
    }

    get score(){
        return parseInt(this.scoreElement.textContent)
    }
    
    get scoreTemp(){
        return parseInt(this.scoreTempElement.textContent)  
    }

    set score(s){
        this.scoreElement.textContent =`${s}` 
    }

    set scoreTemp(s){
        this.scoreTempElement.textContent =`${s}` 
    }

    addTemporaryScore(num){
        this.scoreTemp += num
        return this.scoreTemp
    }

    holdTemp(){
        this.score += this.scoreTemp
        this.clearTemporaryScore()
    }

    clearTemporaryScore(){
        this.scoreTemp = 0 
    }
    
    initScores(){
        this.scoreTemp = 0 
        this.score = 0
    }

}
/**
 * Class representing the game "Dice one loose"
 */
class GameDice{
    /**
     * Create a new game "Dice one loose"
     * @param {Player} pOne  - player 1
     * @param {Player} pTwo  - player 2
     * @param {Dice} dice  - a dice
     * @param {string} btnRollDiceIconId - html id targeting roll icon
     * @param {string} btnHoldDiceIconId - html id targeting hold icon
     * @param {string} groupRollHoldCls - html class targeting the group(roll + hold)
     */
    constructor(pOne,pTwo,dice,btnRollDiceIconId = "roll-dice-icon",btnHoldDiceIconId = "hold-icon",groupRollHoldCls =".wrapper-dice-btns .game-btn-wrapper" ){
        this.pOne = pOne
        this.pTwo = pTwo
        this.groupRollHoldCls = groupRollHoldCls        
        this.dice = dice        
        this.btnRollDice = document.getElementById(btnRollDiceIconId)
        this.btnHoldDice = document.getElementById(btnHoldDiceIconId)
        this.btnRollDice.addEventListener("click",this.rollDice.bind(this))
        this.btnHoldDice.addEventListener("click",this.pushedHold.bind(this))
        this.init()
    }

    /**
     * game initialisation
     */
     init(){
        this.winner = null
        //init dice
        this.dice.face = "one"
        // show buttons
        this.grouBtnsElements = document.querySelectorAll(this.groupRollHoldCls)
        for (const btnTemp of this.grouBtnsElements) {
            btnTemp.classList.remove("hide")
        }
         // pOne begin
        this.playerTurn = this.pOne
        this.pOne.dotElement.classList.remove("hide")
        this.pTwo.dotElement.classList.add("hide")
        // scores init
        this.pOne.initScores()
        this.pTwo.initScores()
    }


    /**
     * Minimum score to win the game
     */
    get scoreToWin(){
        return 100
    }

    checkPlayerWin(){
        if (this.pOne.score >=this.scoreToWin){
            this.winner = this.pOne
        }
        else if (this.pTwo.score >=this.scoreToWin){
            this.winner = this.pTwo
        }
        return this.winner
    }
    
    pushedHold(){
        // hold only if there's no winner
        if (this.winner){
            return
        }
        this.playerTurn.holdTemp()
        // check if winner
        const playerWinner = this.checkPlayerWin()
        if (playerWinner){
            let playerWin =  document.getElementById('player-win')
            playerWin.textContent = `${this.playerTurn.name} wins`
            let modal = new bootstrap.Modal(document.getElementById('modal-winner'))
            for (const btnTemp of this.grouBtnsElements) {
                btnTemp.classList.add("hide")
            }
            modal.show()
        }
        else{
            this.switchPlayer()
        }
    }
    
    rollDice(){
        // roll only if there's no winner
        if (this.winner){
            return
        }
        console.log("pOne",this.pOne.score,this.pOne.scoreTemp,)
        console.log("pTwo",this.pTwo.score,this.pTwo.scoreTemp,)
        this.dice.face = "random"
        let diceNumber = this.dice.faceNb
        if (diceNumber!== 1){    
            this.playerTurn.addTemporaryScore(diceNumber)      
        }
        else{            
            this.switchPlayer()
        }
    }

    switchPlayer(){
        this.playerTurn.clearTemporaryScore()
        if (this.playerTurn===this.pOne){  
            this.playerTurn.dotElement.classList.add("hide")
            this.playerTurn=this.pTwo
            this.playerTurn.dotElement.classList.remove("hide")
        }
        else if (this.playerTurn===this.pTwo){
            this.playerTurn.dotElement.classList.add("hide")
            this.playerTurn=this.pOne
            this.playerTurn.dotElement.classList.remove("hide")
        }
    }
}

window.addEventListener("load",(event)=>{
    // console.log("loaded")
    const btnNewGame = document.getElementById("new-game-icon")

    btnNewGame.addEventListener("click",(event)=>{
        if (!game){
            let playerOne= new Player()
            let playerTwo= new Player("player 2","player-two-score","player-two-score-temp","player-two-dot")
            let dice = new Dice()
            game = new GameDice(playerOne,playerTwo,dice)
        }
        else{            
            game.init()
        }
        
    })  

})