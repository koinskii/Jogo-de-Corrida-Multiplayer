class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
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
    this.resetTitle.position(width/2 + 240, 40)
  this.resetTitle.class("resetText")

    this.resetButton.position(width/2 +240, 100)
    this.resetButton.class("resetButton")
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
    this.handleResetButton()
  
    if (allPlayers != undefined) {
      image(track,0,-height * 5, width, height * 6)
      this.handlePlayerControls()
      
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
          players: {}
        })
        window.location.reload()
      })
    }
    
  }

