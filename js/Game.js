class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")

    this.leaderBoardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();

    car1 = createSprite(width/2 - 50, height - 100)
    car1.addImage("car1", car1img)
    car1.scale = 0.07

    car2 = createSprite(width/2 + 100, height - 100)
    car2.addImage("car2", car2img)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group();
    coins = new Group();

    this.addSprite(fuels, 4, fuelImg, 0.02)
    this.addSprite(coins, 18, coinImg, 0.09)
  }
  addSprite(spriteGroup, numberOfSprites, spriteImg, scale){
    for(var i = 0; i < numberOfSprites; i ++){
      let x, y;
      x = random(width/2 + 150, width/2 - 150)
      y = random(- height * 4.5, height - 400)

      var sprite = createSprite(x,y)
      sprite.addImage(spriteImg);
      sprite.scale =scale

      spriteGroup.add(sprite)
    }

  }

  handleElements(){
    form.titleImg.class("gameTitleAfterEffects")
    form.hide()

    this.resetTitle.html("reset")
    this.resetTitle.position(width/2 + 240, 60)
  this.resetTitle.class("resetText")

    this.resetButton.position(width/2 +240, 120)
    this.resetButton.class("resetButton")

    this.leaderBoardTitle.html("placar")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width/3 - 60, 60)

    this.leader1.class("leadersText")
    this.leader1.position(width/3 - 50, 100)

    this.leader2.class("leadersText")
    this.leader2.position(width/3 - 50, 150)
  }

  getState(){
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value",  (data) => {
      gameState = data.val()
    })
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    })

  }

  play(){
    this.handleElements()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    this.handleResetButton()
    
  
    if (allPlayers != undefined) {
      image(track,0,-height * 5, width, height * 6)
      this.handlePlayerControls()
      this.showLeaderBoard()
      
      var index = 0

      for (var plr in allPlayers ) {
        index++
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index == player.index) {
          fill("red")
          stroke(10)
          ellipse(x,y,60,60)

          camera.position.y = cars[index -1].position.y

          this.handleFuel(index)
          this.handleCoins(index)
          
        }

      }
      const finishLine = height * 6 - 100
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      } 

      drawSprites()

      }
      
    }

    handlePlayerControls(){
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10
        player.update()
        
      }
      if (keyIsDown(RIGHT_ARROW)&& player.positionX < width/2 +265) {
        player.positionX += 5
        player.update()
        
      }
      if (keyIsDown(LEFT_ARROW)&& player.positionX > width/3 -50) {
        player.positionX -= 5
        player.update()
      }
    }

    handleFuel(index){
      cars[index - 1].overlap(fuels, function (collector, collected) {
        player.fuel = 185
        collected.remove()

      })
    }

    handleCoins(index){
      cars[index - 1].overlap(coins, function (collector, collected) {
        player.score += 21
        player.update()
        collected.remove()
      })
    }

    handleResetButton(){
      this.resetButton.mousePressed(() =>{
        database.ref("/").set({
          gameState: 0,
          playerCount: 0,
          players: {},
          carsAtEnd: 0
        })
        window.location.reload()
      })
    }

    showLeaderBoard(){
      var lider1, lider2;
      var players = Object.values(allPlayers)

       // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      if ((players[0].rank == 0 && players[1].rank == 0) || players[0].rank == 1) {
        lider1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
        lider2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score

      } else if(players[1].rank == 1) {
        lider2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
        lider1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
      }
      this.leader1.html(lider1)
      this.leader2.html(lider2)
    }

    showRank(){
      swal({
        title: `Parabéns ${player.name} ${"\n"} você ficou em ${player.rank} lugar`,
        text: "Você cruzou a linha de chegada",
        imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "OK"
      })
    }
    
  }

