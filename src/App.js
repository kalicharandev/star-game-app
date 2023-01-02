import './App.css';
import React , {useState , useEffect} from 'react';

const StarsDisplay = props =>(
<>
  {utils.range(1, props.count).map(starId =>
    <div 
    className="star"
    key={starId} />
)}
 </>
);

const PlayNumber = props => (
  <button  
  className="number"
  style={{ backgroundColor: colors[props.status]}}
  onClick={() => props.onClick(props.number, props.status)}>
  {props.number}
  </button>

);

const PlayAgain = props =>(
  <div className='game-done'>
    <div 
    className='message'
    style ={{ color:props.gameStatus === 'lost' ? 'red' : 'green'}}>
      {props.gameStatus === 'lost' ? 'Gameover': 'well Done'}
    </div>
      <button 
      onClick={props.onClick}>PlayAgain</button>
      </div>
);
const useGameState = () => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [avaliableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondLeft, setSecondLeft] = useState(10);
  
   useEffect(()=>{
    if(secondLeft > 0 && avaliableNums.length > 0){
      const timerid = setTimeout(() =>{
      setSecondLeft(secondLeft - 1);
    }, 1000);
    return () => clearTimeout(timerid);  
  
  }});

   const setGameState = (newCandidateNums) => {
    if(utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums);
    }else{ 
      const newAvaliableNums = avaliableNums.filter(
        n => !newCandidateNums.includes(n)
      );  
      setStars(utils.randomSumIn(newAvaliableNums, 9));
      setAvailableNums(newAvaliableNums);
      setCandidateNums([]);
    }

   };

return {stars, avaliableNums, candidateNums, secondLeft, setGameState};

  };

const Game = (props) => {
const{
  stars, 
  avaliableNums, 
  candidateNums, 
  secondLeft, 
  setGameState
 } = useGameState();


const candidatesAreWrong = utils.sum(candidateNums) > stars;
const gameStatus = avaliableNums.length === 0 ? 'win' : secondLeft === 0 ? 'lost' : 'active';


const numberStatus = (number) => {
    if (!avaliableNums.includes(number)) {
      return 'used';  
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';

  }
  const onNumberClick = (number, currentStatus) =>{
    if(gameStatus !=='active' || currentStatus === 'used') {
      return ;
    }

  const newCandidateNums = currentStatus === 'available' 
    ? candidateNums.concat(number)      //you can unpick the candidate  numbers and wrong numbers
    : candidateNums.filter(cn => cn !== number);

    setGameState(newCandidateNums);
};
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? 
          <PlayAgain
           onClick={props.startNewGame}
            gameStatus={gameStatus}/> :(
            <StarsDisplay count={stars}/>
            )
          }
        </div>
        <div className="right">
         {utils.range(1, 9).map(number =>
         <PlayNumber 
         key={number} 
         status = {numberStatus(number)}
         number ={number}
         onClick ={onNumberClick}
         />
         )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondLeft}</div>
    </div>
  );
};

const StarMatch = () => {
 const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;

}
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};


export default StarMatch;
