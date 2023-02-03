class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.fuel = 180;
    this.life = 180;
    this.rank = 0;
    this.score = 0;
  }

  getCount(){
    database.ref("playerCount").on("value",data => {
      playerCount = data.val()
    })

  }

  updateCount(count){
    database.ref("/").update({
      playerCount: count
    })
  }

  addPlayer(){
    if (this.index == 1) {
      this.positionX = width/2 - 100
    } else {
      this.positionX = width/2 + 100
    }
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY
    })

  }

  getDistance(){
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).on("value", (data) => {
      var data = data.val()
      this.positionX = data.positionX
      this.positionY = data.positionY
    })

  }
  update(){
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY
    })
  }
  
  static getPlayersInfo(){
    database.ref("players").on("value", (data) =>{
      allPlayers = data.val()
    })
  }

}

