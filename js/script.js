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
let finalTimeDisplay = '0.0s';

// Scroll
let valueY = 0;

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