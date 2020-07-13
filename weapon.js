export class Weapon {
  constructor(title, damage, avatarClass) {
    this.title = title;
    this.damage = damage;
    this.avatarClass = avatarClass;
  }

  //set all weapons on the grid-container.
  setWeapon() {
    let availableCellCount = $(".grid-cell").length - $("wall").length;
    let randomPlace = Math.floor(Math.random() * availableCellCount);
    $(".grid-cell:eq(" + randomPlace + ")").addClass(this.avatarClass);
  }