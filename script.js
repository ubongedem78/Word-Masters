const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const  ROUNDS = 6;

async function init(){
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;


    const res = await fetch('https://words.dev-apis.com/word-of-the-day');//?random=1 for random guesses
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('');
    setLoading(false);
    let done = false;
    isLoading = false;


    



    function addLetter(letter){
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }


        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit(){
        if(currentGuess.length !== ANSWER_LENGTH){
            return;
        } 

        isLoading = true;
        setLoading(isLoading);
        const res = await fetch('https://words.dev-apis.com/validate-word', {
            method: "POST",
            body: JSON.stringify({word: currentGuess}),
        });
        const resObj = await res.json();
        const validWord = resObj.validWord;
        //const {validWord} = resObj;

        isLoading = false;
        setLoading(isLoading);

        if(!validWord){
            markInvalidWord();
            return;
        }

        const guessParts = currentGuess.split('');
        const map = makeMap(wordParts);
        for(let i = 0; i < ANSWER_LENGTH; i++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
                map[guessParts[i]]--
            }
        }

        for(let i = 0; i < ANSWER_LENGTH; i++){
                //mark as 
            if(guessParts[i] === wordParts[i])
            {
                //do nothing- we already did it
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]]  > 0)/*mark as close*/{
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
                map[guessParts[i]]--;
            } 
            else { 
                //mark as wrong
                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }

        currentRow++;
        //did they win or lose

        if(currentGuess === word){
            alert('You Win');
            document.querySelector('.brand').classList.add('winner');
            done = true;
            return;
        } else if (currentRow === ROUNDS){
            alert(`You lose , the word was ${word}`)
        }
        currentGuess = '';
    }

    function backspace(){
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
    }

    function markInvalidWord(){

        for(let i = 0; i< ANSWER_LENGTH; i++){
            letters[currentRow * ANSWER_LENGTH + i].classList.remove('invalid');
            // long enough for the browser to repaint without the "invalid class" so we can then add it again
            setTimeout(
                () => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
                10
              );

        }
    }


    document.addEventListener('keydown', function handleKeys(event){

        if(done || isLoading){
            //do nothing
            return;
        }
        const action = event.key;

        if(action === 'Enter'){
            commit(); //commit a guess.
        } else if(action === 'Backspace'){
            backspace(); //delete an item
        } else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }
    });

}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }


function setLoading(isLoading){
    loading.classList.toggle('show', isLoading)
}


function makeMap(array){
    const Obj = {};
    for( let i = 0; i < array.length; i++){
        const letter = array[i];
        if(Obj[letter]){
            Obj[letter]++
        }else {
            Obj[letter] = 1;
        }

    }
    return Obj; 
}

init(); 