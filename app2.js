const TypeWriter = function(txtElement, words, wait = 3000){

    this.txtElement = txtElement;
    this.words=words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDelete = false;
    this.letterIndex = 0;

}

TypeWriter.prototype.type = function(){

    let current = this.wordIndex%this.words.length;
    let currentWord = this.words[current];
    let typeSpeed;
    //type the word
    if(this.isDelete){ // deleting the word from the screen

        if(this.txt.length != 0){
            this.txt = currentWord.substring(0, this.length-1);
            this.txtElement.textContent = this.txt;
            typeSpeed = 300;

        }else{

            this.wordIndex++;
            typeSpeed = 1000;
            this.txt = '';
            this.isDelete = false;
            
        }

        
    }else{ // adding the element to the screen
        
        if(this.txt.length != currentWord.length){

            this.txt = currentWord.substring(0, this.txt.length+1);
            this.txtElement.textContent = this.txt;
            typeSpeed = 500;

        }
        else{
            this.isDelete = true;
            // typeSpeed = 500;
        }
    }

    //delete the word

    setTimeout(()=>this.type(), typeSpeed);

}

//intialize the variable
document.addEventListener('DOMContentLoaded', Init);

//Init app
function Init(){
    const txtElement = document.querySelector('.text-type');
    const wait = txtElement.getAttribute('data-wait');
    const words = JSON.parse(txtElement.dataset.words);
   
    new TypeWriter(txtElement, words, wait);
}