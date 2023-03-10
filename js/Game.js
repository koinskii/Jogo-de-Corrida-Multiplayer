class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")

    this.leaderBoardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")

    this.playerMove = false
    this.leftKeyActive = true
    this.blast = false
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage("car1", car1img)
    car1.addImage("blast", explosion)
    car1.scale = 0.07

    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage("car2", car2img)
    car2.addImage("blast", explosion)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group();
    coins = new Group();
    obstacles1 = new Group();
    obstacles2 = new Group();
    var obstacle1Positions = [
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },

      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
    ];

    var obstacle2Positions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },

      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprite(fuels, 4, fuelImg, 0.02)
    this.addSprite(coins, 18, coinImg, 0.09)
    this.addSprite(
      obstacles1,
      obstacle1Positions.length,
      obstacle1Image,
      0.04,
      obstacle1Positions
    );
    this.addSprite(
      obstacles2,
      obstacle2Positions.length,
      obstacle2Image,
      0.04,
      obstacle2Positions
    );

  }
  addSprite(spriteGroup, numberOfSprites, spriteImg, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      let x, y;
      if (positions.length > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImg = positions[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(- height * 4.5, height - 400)
      }


      var sprite = createSprite(x, y)
      sprite.addImage(spriteImg);
      sprite.scale = scale



      spriteGroup.add(sprite)
    }

  }

  handleElements() {
    form.titleImg.class("gameTitleAfterEffects")
    form.hide()

    this.resetTitle.html("reset")
    this.resetTitle.position(width / 2 + 240, 60)
    this.resetTitle.class("resetText")

    this.resetButton.position(width / 2 + 240, 120)
    this.resetButton.class("resetButton")

    this.leaderBoardTitle.html("placar")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width / 3 - 60, 60)

    this.leader1.class("leadersText")
    this.leader1.position(width / 3 - 50, 100)

    this.leader2.class("leadersText")
    this.leader2.position(width / 3 - 50, 150)
  }

  getState() {
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", (data) => {
      gameState = data.val()
    })
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    })

  }

  play() {
    this.handleElements()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    this.handleResetButton()


    if (allPlayers != undefined) {
      image(track, 0, -height * 5, width, height * 6)
      this.handlePlayerControls()
      this.showLeaderBoard()
      this.showLife()
      this.showFuelBar()

      var index = 0

      for (var plr in allPlayers) {
        index++
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY

        var currentLife = allPlayers[plr].life
        if (currentLife <= 0) {
          cars[index - 1].changeImage("blast")
          cars[index - 1].scale = 0.3
        }

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index == player.index) {
          fill("red")
          stroke(10)
          ellipse(x, y, 60, 60)

          camera.position.y = cars[index - 1].position.y

          this.handleFuel(index)
          this.handleCoins(index)
          this.handleObstaclesCollision(index)
          this.handleCarsCollision(index)

          if (player.life <= 0) {
            this.blast = true
            this.playerMove = false
            setTimeout(() => {
              gameState = 2
              this.gameOver2()
            }, 1000);
          }

        }

       


      }
      if (this.playerMove) {
        player.positionY += 5
        player.update()
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

  handlePlayerControls() {
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10
        this.playerMove = true
        player.update()

      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 265) {
        player.positionX += 5
        player.update()

        this.leftKeyActive = false

      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5
        player.update()
        this.leftKeyActive = true
      }
    }
  }

  handleFuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185
      collected.remove()

    })
    if (player.fuel > 0 && this.playerMove) {
      player.fuel -= 0.3
    }

    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver()

    }
  }

  handleCoins(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 21
      player.update()
      collected.remove()
    })
  }

  handleObstaclesCollision(index) {
    if (cars[index - 1].collide(obstacles1) || cars[index - 1].collide(obstacles2)) {
      if (this.leftKeyActive) {
        player.positionX += 100
      } else {
        player.positionX -= 100
      }
      if (player.life > 0) {
        player.life -= 185 / 4
      }

     
      player.update()
    }
  }

  handleCarsCollision(index){
    if(index == 1){
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100
        } else {
          player.positionX -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
  
       
        player.update()
      }
    }
    if (index == 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100
        } else {
          player.positionX -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
  
        
        player.update()
      }
    }
  }



  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: {},
        carsAtEnd: 0
      })
      window.location.reload()
    })
  }

  showLeaderBoard() {
    var lider1, lider2;
    var players = Object.values(allPlayers)

    // &emsp;    Essa etiqueta ?? usada para exibir quatro espa??os.
    if ((players[0].rank == 0 && players[1].rank == 0) || players[0].rank == 1) {
      lider1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      lider2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score

    } else if (players[1].rank == 1) {
      lider2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      lider1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
    }
    this.leader1.html(lider1)
    this.leader2.html(lider2)
  }

  showRank() {
    swal({
      title: `Parab??ns ${player.name} ${"\n"} voc?? ficou em ${player.rank} lugar`,
      text: "Voc?? cruzou a linha de chegada",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "OK"
    })
  }

  gameOver() {
    swal({
      title: `Fim de Jogo!`,
      text: "Seu combust??vel acabou",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar :)"
    })
  }

  gameOver2() {
    swal({
      title: `Fim de Jogo!`,
      text: "Sua vida acabou :(",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar :)"
    })
  }

  showLife() {
    push()
    image(lifeimage, width / 2 - 130, height - player.positionY - 350, 20, 20)
    fill("#ffffff")
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("red")
    rect(width / 2 - 100, height - player.positionY - 350, player.life, 20)
    noStroke()
    pop()
  }

  showFuelBar() {
    push()
    image(fuelImg, width / 2 - 130, height - player.positionY - 300, 20, 20)
    fill("#ffffffff")
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#ffc400")
    rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20)
    noStroke()
    pop()
  }

}


