
//React 
import { useState, useCallback, useEffect } from 'react';

//CSS
import './App.css';


//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
//Data
import {wordsList } from "./Data/word";


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessedQty = 5

function App() {
  
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [word] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessedQty)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
     
    //  pick a random category 
     const categories = Object.keys(word)
     const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
     console.log(category);
     
     // pick random word
     const wor = word[category][Math.floor(Math.random() * word[category].length)]
     console.log(wor);
     return { wor,category   }
  },[word]) 

  
  
  
  const startGame =  useCallback(() => {
    clearLetterStates();
    
    const {wor, category } = pickWordAndCategory(); 

    let wordLetters = wor.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    
   
    console.log(wor,category) 
    console.log(wordLetters)
    setGameStage(stages[1].name);

    setPickedWord(wor)
    setPickedCategory(category)
    setLetters(wordLetters)


  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter)||
       wrongLetters.includes(normalizedLetter)){
      return;
    }
  

  if(letters.includes(normalizedLetter)){
    setGuessedLetters((actualGuessedLetters) => [
      ...actualGuessedLetters,
      normalizedLetter
    ])
  } else {
    setWrongLetters((actualWrongLetters) => [
      ...actualWrongLetters,
      normalizedLetter
    ]);

    setGuesses((actualGuesses) => actualGuesses-1    );
  }

};

const clearLetterStates = () => {
  setGuessedLetters([]);
  setWrongLetters([]);
}


//Monitorar algun dado
 useEffect(() => {
    if(guesses <= 0){
      clearLetterStates();
      setGameStage(stages[2].name);
    }
 }, [guesses]);

 useEffect(() => {

  const uniqueLetters = [...new Set(letters)]

  if(guessedLetters.length === uniqueLetters.length){
    setScore((actualScore) => actualScore += 100);
    startGame();
  }
  console.log(uniqueLetters);
}, [guessedLetters, letters, startGame]) 
   

  const retry = () => {
    
    setScore(0)
    setGuesses(guessedQty)
    
    setGameStage(stages[0].name);
  }
  
  
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
