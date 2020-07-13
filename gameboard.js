export class GameBoard {
  //row and column to create a grid.
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  //forms a gridContainer of a particular size [row X col]
  formGridContainer() {
    $(".board").addClass("grid-container");
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        $('<div class="grid-cell"></div>').appendTo(".grid-container");
      }
    }
  }

  //create unavailable cells in grid-container.
  formDimmedCell() {
    let randomPosArr = [];
    while (randomPosArr.length !== this.row) {
      let i = randomPosArr.length;
      let randomNo = Math.floor(Math.random() * $(".grid-cell").length);
      if (randomPosArr.indexOf(randomNo) == -1) {
        randomPosArr.push(randomNo);
        let randomPos = randomPosArr[i];
        let cellPos = document.querySelectorAll(".grid-cell")[randomPos];
        cellPos.className = "wall";
      }
    }
    console.log(randomPosArr);
  }
}
