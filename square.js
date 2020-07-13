export class Square {
  createSquare() {
    let gridCellLength = $(".grid-cell").length;
    console.log(gridCellLength);
    $(".grid-cell").each((index, element) => {
      let square = document.createElement("div");
      square.id = "square";
      element.append(square);
      this.getSquarePosition();
    });
  }

  getSquarePosition() {
    let squareDiv = $(".grid-cell #square");
    let $squareDiv = $(squareDiv);
    let squarePos = $squareDiv.position();
  }
}
