(function(){

  class Typer {
    constructor(element, otherWords) {
      this.element          = element;
      this.otherWords       = otherWords;
      this.currentWordIndex = 1;
      this.currentWord      = element.text();
      this.displayedString  = element.text();
      this.typing           = false;

      // start it off
      setTimeout(this.run.bind(this), 200)
    }

    run() {
      // pick semi-random timeout to feel more natural
      var timeout = Math.random() * 50 + 50

      if(!this.typing && this.displayedString.length > 0){
        // we're backspacing
        this.removeLastCharacter();
        this.setAnimating(false);
      } else if(this.typing && this.displayedString.length < this.currentWord.length) {
        // we're typing
        let newChar = this.currentWord[this.displayedString.length]
        this.setAnimating(false)
        this.addCharacter(newChar)
      } else if(this.typing && this.displayedString.length === this.currentWord.length) {
        // done typing, wait a bit and start removing..
        this.typing    = false
        timeout        = 2500;

        // start animating cursor
        this.setAnimating(true)
      } else if(!this.typing && this.displayedString.length === 0){
        // done backspacing, pick new word and start over
        // increment and loop around
        if( this.currentWordIndex < this.otherWords.length -1) {
          this.currentWordIndex++;
        } else {
          this.currentWordIndex = 0;
        }

        // set new word and start typing again
        this.currentWord = this.otherWords[this.currentWordIndex];
        this.typing = true;
        this.setAnimating(false)
      }

      // recursively call itself with given timeout
      setTimeout(this.run.bind(this), timeout);
    }

    setAnimating(isAnimating) {
      this.element.toggleClass('animating', isAnimating)
    }

    removeLastCharacter(){
      this.displayedString = this.displayedString.substring(0, this.displayedString.length-1)
      this.updateLabel()
    }

    addCharacter(char){
      this.displayedString += char
      this.updateLabel()
    }

    updateLabel() {
      this.element.text(this.displayedString);
    }
  }

  new Typer($('.typer2'), ['Log','Monitor','Maintain','Debug']);
})();
