// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGussArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

function bestScoresToDOM() {
  bestScores.forEach((bestScore, index)=>{
    const bestScoreEL = bestScore;
    bestScoreEL.textContent = `${bestScoreArray[index].bestScore}`;
  });
}

function getSaveedBestScores() {
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay }
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGussArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

function showScorePage() {
  setTimeout(()=>{
    playAgainBtn.hidden = false;
  }, 1000);
  scorePage.hidden = false;
  gamePage.hidden= true;
}

function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);

  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();

  itemContainer.scrollTo({ top: 0, behavior: 'instant'})
  showScorePage()
}

function checkRime() {
  if(playerGussArray.length == questionAmount){
    console.log(playerGussArray);
    clearInterval(timer);
    equationsArray.forEach((equation, index)=>{
      if(equation.evaluated === playerGussArray[index]){
        // Do nothing
      } else {
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
    console.log("timePlayed: ", timePlayed, " penaltyTime: ", penaltyTime,  " finalTime: ", finalTime)
  }
}

function addTime(){
  timePlayed += 0.1;
  checkRime();
}

function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer)
}

function select(gussedTrue) {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  
  return gussedTrue ? playerGussArray.push('true') : playerGussArray.push('false');
  
}

function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomNumber(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('correctEquations: ', correctEquations, " wrongEquations: ",wrongEquations)
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNumber(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  // equationsToDOM()
}

function equationsToDOM(){
  equationsArray.forEach(equation=>{
    const item = document.createElement('div');
    item.classList.add('item');

    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function countdownStart() {
  countdown.textContent = 3;
  setTimeout(()=>{
    countdown.textContent = 2;
  }, 1000);
  setTimeout(()=>{
    countdown.textContent = 1;
  }, 2000);
  setTimeout(()=>{
    countdown.textContent = 'Go!';
  }, 3000);
}

function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(()=>{
    showGamePage();
  },4000);
}

function getRadioValue() {
  let radioValue;
  radioInputs.forEach(radioInput=>{
    if(radioInput.checked){
      radioValue = radioInput.value
    }
  })
  return radioValue;
}

function selectQuestionAmount(e){
  e.preventDefault();
  questionAmount = getRadioValue();
  questionAmount ? showCountdown() : alert('Select a question amount');
}

startForm.addEventListener('click', ()=>{
  radioContainers.forEach(radioEL=>{
    radioEL.classList.remove('selected-label');
    if(radioEL.children[1].checked){
      radioEL.classList.add('selected-label');
    }
  });
});


startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer)

// On Load
getSaveedBestScores();