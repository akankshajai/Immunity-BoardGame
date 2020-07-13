import { GameBoard } from "./gameboard.js";
import { Weapon } from "./weapon.js";
import { Player } from "./playerNew.js";
import { Square } from "./square.js";
export class World {
  constructor(players, weapons, playerTurn, changeTurn) {
    this.players = [];
    this.weapons = [];
    this.playerTurn = 0;
    this.changeTurn = this.changeTurn;
    this.checkPositions = [];
    let storePlayerPos = this.storePlayerPos.bind(this);
    this.player = new Player();
    this.validatePos = false;
  }

  // Forms a GameBoard for all players to play.
  formGameBoard() {
    const gameboard = new GameBoard(10, 10);
    gameboard.formGridContainer();
    gameboard.formDimmedCell();
  }

  //create player Instances and stores it in array.
  createPlayer(name, score, playerClass, weapon) {
    let playerInstance = new Player(name, score, playerClass, weapon);
    this.players.push(playerInstance);
    return this.players;
  }

  //return all players in the container.
  get allPlayers() {
    return this.players;
  }

  //adjusting each player position and set both players in the grid container.
  adjustPlayerPos() {
    this.players.forEach(player => {
      let rVal = player.getPlayerPos();
      world.checkPositions.push(rVal);
      world.storePlayerPos();
    });
    if (this.validatePos == true) {
      this.checkPositions = [];
      this.adjustPlayerPos();
    } else {
      this.players.forEach(player => {
        player.setPlayer(this.checkPositions);
      });
    }
  }

  /**
   *  store player Positions as per criteria(if two players are not conciding
   and two players are not in the fight mode on game load) and return valid response to adjustPlayerPos() 
  */

  storePlayerPos() {
    if (this.checkPositions.length == 2) {
      let player1Pos = this.checkPositions[0].position();
      let player2Pos = this.checkPositions[1].position();
      let playerdx = Math.abs(Math.round(player1Pos.top - player2Pos.top));
      let playerdy = Math.abs(Math.round(player1Pos.left - player2Pos.left));
      console.log(playerdx, playerdy);
      if (playerdx == 0 && playerdy == 0) {
        this.validatePos = true;
      } else if (
        (playerdx == 0 && playerdy == 70) ||
        (playerdx == 70 && playerdy == 0)
      ) {
        this.validatePos = true;
      } else {
        this.validatePos = false;
      }
    } else {
      return;
    }
  }

  //create weapon Instances and stores it in array.
  createWeapon(title, damage, avatarClass) {
    let weaponInstance = new Weapon(title, damage, avatarClass);
    this.weapons.push(weaponInstance);
    return this.weapons;
  }

  //get all weapons
  get allWeapons() {
    return this.weapons;
  }

  showSquare() {
    const square = new Square();
    square.createSquare();
  }
  //handle each click on game board and call to player initialization and change Player turn.
  handleBoardClick() {
    // let activeTurnPlayer = playerActive.name;
    $(".activeTurn h2").text(`ActivePlayer : Player 1`);
    let board = $(".grid-cell");
    board.on("click", event => {
      console.log(event.target);
      let playerTurn = this.playerTurn;
      let destination = $(event.target);
      let changeTurn = this.changeTurn.bind(this);
      this.initializePlayer(playerTurn, destination, changeTurn);
    });
  }

  //initailize the active player based on their turn.
  initializePlayer(playerTurnValue, destTarget, callback) {
    console.log(this.player);
    this.player = this.players[0];
    if (playerTurnValue == 0) {
      this.player = this.players[0];
      console.log(this.player.weapon);
      console.log("Player 1 clicked");
    } else {
      this.player = this.players[1];
      console.log("Player2 clicked");
    }
    callback(this.player, destTarget, playerTurnValue);
  }

  //change player turn and call playerActive method to move.
  changeTurn(activePlayer, activeDestination, activeTurn) {
    this.playerTurn = (this.playerTurn + 1) % 2;
    let playersStore = this.allPlayers;
    let weaponsStore = this.allWeapons;
    this.player.getPlayerActive(
      activePlayer,
      activeDestination,
      activeTurn,
      playersStore,
      weaponsStore
    );
    console.log(this.player);
    let activeTurnPlayer = this.players[this.playerTurn];
    console.log(activeTurnPlayer);
    $(".activeTurn h2").text(`ActivePlayer: ${activeTurnPlayer.name}`);
  }
}

const world = new World();
world.formGameBoard();
world.showSquare();
world.createWeapon("Sword", 60, "weapon weapon1");
world.createWeapon("Utensil", 50, "weapon weapon2");
world.createWeapon("Animals", 40, "weapon weapon3");
world.createWeapon("Bomb", 30, "weapon weapon4");
world.createWeapon("Hammer", 10, "weapon defaultWeapon");
world.weapons.forEach(weapon => {
  weapon.setWeapon();
});
world.createPlayer("Player 1", 100, "boardplayer1", "weapon defaultWeapon");
world.createPlayer("Player 2", 100, "boardplayer2", "weapon defaultWeapon");
world.adjustPlayerPos();
world.handleBoardClick();
