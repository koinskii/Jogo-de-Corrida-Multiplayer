class Form {
  constructor() {
    this.input = createInput('').attribute('placeholder',"Digite seu nome")
    this.playButton = createButton('Play')
    this.titleImg = createImg('./assets/TITULO.png','nome do jogo')
    this.greeting = createElement('h2')
  }

  setElementsPosition(){
    this.input.position(width/2-110,height/2-80)
    this.playButton.position(width/2-90,height/2-20)
    this.titleImg.position(120,0)
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyle(){
    this.titleImg.class('gameTitle')
    this.input.class('customInput')
    this.playButton.class('customButton')
    this.greeting.class('greeting')
  }

  hide(){
    this.playButton.hide()
    this.input.hide()
    this.greeting.hide()
  }

  display(){
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }

  handleMousePressed(){
    this.playButton.mousePressed(
      ()=>{
        this.input.hide();
        this.playButton.hide();
        var message = `Bem-Vindo ${this.input.value()}!!<br> 
        Aguarde os próximos jogadores!`
        this.greeting.html(message);
        playerCount += 1

        player.name = this.input.value();
        player.index = playerCount;
        player.updateCount(playerCount)
        player.addPlayer()
        player.getDistance()
      }
    )
  }
}
