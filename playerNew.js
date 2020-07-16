import { World } from "./world.js";
import { Weapon } from "./weapon.js";

export class Player {
  constructor(name, score, playerClass, weapon) {
    this.name = name;
    this.score = score;
    this.playerClass = playerClass;
    this.weapon = weapon;
    this.canMove = false;
    this.playerPosition = [];
    this.inFightMode = false;
    this.defaultWeapon = "";
  }

  //get players position randomly and return its positions.
  getPlayerPos() {
    let weaponIndexList = $(".grid-cell.weapon");
    let gridCellList = $(".grid-cell");
    $.each(weaponIndexList, (index, value) => {
      let checkIndex = $.inArray(value, gridCellList);
      gridCellList.splice(checkIndex, 1);
    });
    console.log(gridCellList);

    let availableCellCount = gridCellList.length;
    let randomPlayerPos = Math.floor(Math.random() * availableCellCount);
    console.log(randomPlayerPos);
    let newplayer = $(gridCellList[randomPlayerPos]);
    return newplayer;
  }
  //set players on the grid-container
  setPlayer(newPlayerPos) {
    if (this.playerClass == "boardplayer1") {
      newPlayerPos[0].addClass(this.playerClass);
    } else {
      newPlayerPos[1].addClass(this.playerClass);
    }
  }

  //get active player and check its valid moves or fight mode.
  getPlayerActive(playerActive, destination, turnVal, playersArr, weaponsArr) {
    let source = $(`.${playerActive.playerClass}`);
    let defaultWeaponClass = this.weapon;
    this.checkValidMoves(source, destination, defaultWeaponClass, weaponsArr);
    let playersPosition = this.allPlayersPos(playersArr);
    this.inFightMode = this.activateFightMode();
    if (this.inFightMode == true) {
      this.displayPlayerData(turnVal, playersArr, weaponsArr);
    } else {
      if (playerActive.name == "Player 1") {
        $(".player2").append('<p class="messageBox">Move your turn</p>');
        $(".player1 .messageBox").hide();
      } else {
        $(".player1").append('<p class="messageBox">Move your turn</p>');
        $(".player2 .messageBox").hide();
      }
    }
  }

  // display player Data as per active Player in the player Container.
  displayPlayerData(turn, playersVal, weaponsVal) {
    var $playerContainer, playerScoreUpdate, winnerPlayer;
    if (turn == 0) {
      $playerContainer = $(".player2");
      playerScoreUpdate = playersVal[1].score;
      winnerPlayer = playersVal[0].name;
      console.log($playerContainer);
    } else {
      $playerContainer = $(".player1");
      playerScoreUpdate = playersVal[0].score;
      winnerPlayer = playersVal[1].name;
      console.log($playerContainer);
    }
    let $playerSection = $('<div class="playerSection"></div>');
    $playerSection.css("margin", "1rem");
    let $attackBtn = $('<button class="playerattack">Attack</button>');
    let $defendBtn = $('<button class="playerdefend">Defend</button>');
    $playerContainer.append($playerSection);
    $playerSection.append($attackBtn);
    $playerSection.append($defendBtn);
    let $btn = $("button");
    console.log(playersVal);
    let scoreCard = $playerContainer.find(".score span");
    scoreCard.text(playerScoreUpdate);
    if (scoreCard.text() == 0) {
      $("button").hide();
      document.getElementById("overlay").style.display = "block";
      document.getElementById(
        "text"
      ).textContent = `Congratulations ${winnerPlayer} Wins!!`;
    }
    //attack or defend based on click
    $btn.click((event) => {
      let $btnType = event.target.className;
      $playerSection.remove();
      let changePlayerContainer = this.changePlayerContainer.bind(this);
      let updatedScore = this.attackPlayer(
        turn,
        playersVal,
        weaponsVal,
        $btnType,
        changePlayerContainer
      );
    });
  }

  attackPlayer(playerTurn, playersValArr, weaponsValArr, $btnClass, callback) {
    let attackedPlayer = playersValArr[playerTurn];
    let attackedPlayerScore = attackedPlayer.score;
    playerTurn = (playerTurn + 1) % 2;
    let attackingPlayer = playersValArr[playerTurn];
    var damageVal;
    // let weaponVal = fightPlayer.weapon;
    //console.log(this);
    let weaponValue = this.getWeaponValue(weaponsValArr, attackingPlayer);
    if ($btnClass == "playerattack") {
      console.log(weaponValue);
      damageVal = weaponValue[0].damage;
    } else if ($btnClass == "playerdefend") {
      damageVal = weaponValue[0].damage / 2;
    }
    attackedPlayerScore = attackedPlayerScore - damageVal;
    if (attackedPlayerScore < 0) {
      attackedPlayerScore = 0;
    }
    attackedPlayer.score = attackedPlayerScore;
    //let opponent = valueArr[value];
    //let opponentScore = opponent.score;

    callback(playerTurn, playersValArr, weaponsValArr);
    return attackedPlayerScore;
  }
  //change the playerContainer by turn.
  changePlayerContainer(playerTurnVal, playersValArr, weaponsValArr) {
    this.displayPlayerData(playerTurnVal, playersValArr, weaponsValArr);
  }

  //Return a particular weapon object
  getWeaponValue(weaponObjValues, playerActive) {
    let playerActiveWeapon = playerActive.weapon;
    console.log(playerActiveWeapon);
    var filteredWeapon = weaponObjValues.filter((weaponTurn) => {
      if (playerActiveWeapon.startsWith("grid-cell")) {
        return "grid-cell" + " " + weaponTurn.avatarClass == playerActiveWeapon;
      } else {
        return weaponTurn.avatarClass == playerActiveWeapon;
      }
    });
    return filteredWeapon;
  }
  //Return position of both players
  allPlayersPos(players) {
    $.each(players, (index, value) => {
      this.playerPosition[index] = $(`.${value.playerClass}`).position();
    });
    return this.playerPosition;
  }

  //check if players in adjacent position activate the fight mode.
  activateFightMode() {
    let player1Pos = this.playerPosition[0];
    let player2Pos = this.playerPosition[1];
    let dx = Math.abs(Math.round(player1Pos.top - player2Pos.top));
    let dy = Math.abs(Math.round(player1Pos.left - player2Pos.left));
    if ((dx == 0 && dy == 70) || (dx == 70 && dy == 0)) {
      return true;
    } else {
      return false;
    }
  }

  getClassName(srcClass) {
    if (srcClass.hasClass("boardplayer1")) {
      return "boardplayer1";
    } else {
      return "boardplayer2";
    }
  }
  //return container of a particular player to display its data.
  getPlayerContainer(activePlayer) {
    if (activePlayer == "boardplayer1") {
      return $(".player1");
    } else {
      return $(".player2");
    }
  }
  // check valid moves of a player on the basis of turn and move the player from source to destination.
  checkValidMoves(src, dest, weaponClass, weaponsArr) {
    let srcPos = src.position();
    let destPos = dest.position();
    let activePlayerClass = this.getClassName(src);
    let activePlayerContainer = this.getPlayerContainer(activePlayerClass);
    let moveH;
    let checkObstacles = this.checkObstacles.bind(this);

    if (srcPos.top == destPos.top) {
      moveH = true;

      this.getObstacles(
        src,
        dest,
        srcPos,
        destPos,
        moveH,
        weaponClass,
        weaponsArr,
        activePlayerContainer,
        checkObstacles
      );

      if (this.canMove == true) {
        let posDiff = Math.round(srcPos.top - destPos.top);
        let absolutePos = Math.abs(posDiff);
        console.log(absolutePos);
        let numberOfMoves = absolutePos / 70;
        //check number of moves
        if (numberOfMoves > 3) {
          window.alert("Invalid Move");
        } else {
          src.removeClass(activePlayerClass);
          srcPos.top = destPos.top;
          srcPos.left = destPos.left;
          dest.addClass(activePlayerClass);
          if (this.defaultWeapon != undefined || this.defaultWeapon != null) {
            src.addClass(this.defaultWeapon);
            localStorage.removeItem(`${this.name}`);
          }
        }
      }
    }
    //check valid moves vertically.
    else if (srcPos.left == destPos.left) {
      moveH = false;

      this.getObstacles(
        src,
        dest,
        srcPos,
        destPos,
        moveH,
        weaponClass,
        weaponsArr,
        activePlayerContainer,
        checkObstacles
      );
      if (this.canMove == true) {
        let posDiff = Math.round(srcPos.top - destPos.top);
        let absolutePos = Math.abs(posDiff);
        console.log(absolutePos);
        let numberOfMoves = absolutePos / 70;
        //check number of moves
        if (numberOfMoves > 3) {
          console.log("Invalid Move");
        } else {
          src.removeClass(activePlayerClass);
          srcPos.top = destPos.top;
          srcPos.left = destPos.left;
          dest.addClass(activePlayerClass);
          if (this.defaultWeapon != undefined || this.defaultWeapon != null) {
            src.addClass(this.defaultWeapon);
            localStorage.removeItem(`${this.name}`);
          }
        }
      }
    }
  }
  //return the obstacles in between source and destination of a player.
  getObstacles(
    source,
    destination,
    sourcePos,
    destinationPos,
    direction,
    defaultWeaponClassName,
    weaponsObj,
    activePlayerContainer,
    callback
  ) {
    let updateWeapon = this.updateWeapon.bind(this);
    if (direction == true) {
      //Get Obstacles Horizontally
      if (sourcePos.left > destinationPos.left) {
        let tiles = $(source).prevUntil(destination);
        console.log(tiles);
        console.log(defaultWeaponClassName);
        callback(
          tiles,
          defaultWeaponClassName,
          weaponsObj,
          activePlayerContainer,
          destination,
          updateWeapon
        );
      } else {
        let tiles = $(source).nextUntil(destination);
        console.log(tiles);
        console.log(defaultWeaponClassName);
        callback(
          tiles,
          defaultWeaponClassName,
          weaponsObj,
          activePlayerContainer,
          destination,
          updateWeapon
        );
      }
    } else {
      //Get Obstacles Vertically
      if (sourcePos.top > destinationPos.top) {
        let newbox = $(source).prevUntil(destination);
        let tilesArr = [];
        $.each(newbox, (index, value) => {
          let val = $(value).position();
          if (val.left == sourcePos.left) {
            console.log(val);
            console.log(index, value);
            tilesArr.push(value);
          }
        });
        let tiles = $(tilesArr);
        callback(
          tiles,
          defaultWeaponClassName,
          weaponsObj,
          activePlayerContainer,
          destination,
          updateWeapon
        );
      } else {
        let newbox = $(source).nextUntil(destination);
        let tilesArr = [];
        $.each(newbox, (index, value) => {
          let val = $(value).position();
          if (val.left == sourcePos.left) {
            console.log(val);
            console.log(index, value);
            tilesArr.push(value);
          }
        });
        let tiles = $(tilesArr);
        callback(
          tiles,
          defaultWeaponClassName,
          weaponsObj,
          activePlayerContainer,
          destination,
          updateWeapon
        );
      }
    }
  }
  /**
   * callback to check if obstacle is a player or unavailable cell or weapon.
   * if a player or unavailable cell is in between , player won't move.
   * if a weapon is in between, then replace the default weapon with the onboard weapon.
   */

  checkObstacles(
    tiles,
    defaultWeaponClassName1,
    weaponsObjVal,
    playerContainer,
    playerDest,
    callback
  ) {
    console.log(tiles);
    if (
      tiles.is(".wall") ||
      tiles.is(".boardplayer1") ||
      tiles.is(".boardplayer2")
    ) {
      this.canMove = false;
      //if there is a weapon in between source and destination
    } else if (tiles.is(".weapon")) {
      this.canMove = true;
      let weaponName = tiles.filter(".weapon");
      let weaponClass = weaponName.attr("class");
      let defaultGridWeapon = "grid-cell" + " " + defaultWeaponClassName1;
      weaponName.removeClass(weaponClass).addClass(defaultGridWeapon);
      callback(weaponClass, weaponsObjVal, playerContainer);
      //if there is no weapon in bewteen source and destination
    } else if (tiles.length == 0 || !tiles.is(".weapon")) {
      this.canMove = true;
      let playerClassList = playerDest;
      console.log(playerClassList);
      let a = playerClassList.prop("classList");
      console.log(a);
      //if destination has a weapon,pick it up.
      if (a.contains("weapon")) {
        var defaultGridWeapon;
        let weaponClass = a.value;
        console.log(weaponClass);
        if (defaultWeaponClassName1.startsWith("grid-cell")) {
          defaultGridWeapon = defaultWeaponClassName1;
        } else {
          defaultGridWeapon = "grid-cell" + " " + defaultWeaponClassName1;
        }
        playerClassList.removeClass(weaponClass);
        //if(localStorage[`${this.name}`] !== undefined)
        this.storeWeapon(defaultGridWeapon);
        callback(weaponClass, weaponsObjVal, playerContainer);
        //if destination has any player, can't move.
      } else if (a.contains("boardplayer1") || a.contains("boardplayer2")) {
        this.canMove = false;
        //if destination has no weapon but has a backup weapon from a previous step.
      } else if (
        !a.contains("weapon") &&
        defaultWeaponClassName1 == "weapon defaultWeapon"
      ) {
        this.defaultWeapon = undefined;
      } else {
        this.defaultWeapon = localStorage.getItem(`${this.name}`);
      }
    } else {
      this.canMove = true;
    }
  }
  //store weapon value in localStorage.
  storeWeapon(valueWeapon) {
    localStorage.setItem(`${this.name}`, valueWeapon);
  }
  //update Weapon value in instance and in player container.
  updateWeapon(newWeapon, weaponsObjVal, playerContainer) {
    console.log(this.weapon);
    this.weapon = newWeapon;
    let obj = weaponsObjVal.find((element) => {
      let weaponAvatar = element.avatarClass;
      let weaponAvatarGrid = "grid-cell" + " " + weaponAvatar;
      return weaponAvatarGrid == newWeapon;
    });
    playerContainer.find("#weaponStyle").attr("class", obj.avatarClass);
    playerContainer.find(".weaponDetail span").text(obj.damage);
  }
}
