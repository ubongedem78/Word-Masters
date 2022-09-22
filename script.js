const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;



async function init() {
    let currentGuess = '';
    let currentRow = 0;

    //response
    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json(); //or const {word} = awaot res.json(); (destructuring)
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('')
    setLoading(false);


    console.log(word)



    function addLetter(letter) {
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter; //add letter to the end
        } else{
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter; // remove last letter and replace with new letter.
        }

        letters[ANSWER_LENGTH*currentRow + currentGuess.length - 1].innerText = letter;
    }



    async function commit(action){
        if(currentGuess.length != ANSWER_LENGTH){
            return; //do nothing
        } 


        //TODO
        //TODO validate the word
        //TODO make the markings correct, close or worng

        const guessParts = currentGuess.split('');
        for (let i = 0; i < ANSWER_LENGTH; i++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letters[currentRow*ANSWER_LENGTH+i].classList.add('correct');
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++){
            //mark as c
            if(guessParts[i] === wordParts[i]){
                //do nothing
            } else if (wordParts.includes(guessParts[i])) /* TODO MAKE THIS MORE ACCURATE*/ {
                letters[currentRow*ANSWER_LENGTH+i].classList.add('close');
            } else{
                letters[currentRow*ANSWER_LENGTH+i].classList.add('wrong');
            }
        }
        //TODO did they win or lose

        currentRow++;
        currentGuess = '';
        return;
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH*currentRow + currentGuess.length].innerText = '';        
    }
    
    document.addEventListener('keydown', function handleKeyStroke(event){
        //store key press
        const action = event.key;
        
        if(action === 'Enter'){
            commit(); //commit a guess
        } else if (action === 'Backspace') {
            backspace(); 
        } else if (isLetter(action)){
            addLetter(action.toUpperCase());
        } else{
            //do nothing
            // return;
        }
    })
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}


function setLoading(isLoading){
    loading.classList.toggle('show', isLoading);
}


init();