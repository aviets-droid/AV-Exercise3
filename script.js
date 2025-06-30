// Aisling Viets
// 6/28/25
// CS 491 Exercise 3
// Tic Tac Toe - Local Multiplayer

const dice = 6; 
const rows = 3;
const cols = 3;
const whitespace = "\u00A0";
const ptwochar = "X";
const ponechar = "O";
const ptwoname = "Player Two";
const ponename = "Player One";

var filehandle;
var myturn = false;
var mychar = "";
var turnorderdetermined = false;

var game = {
  state: "NewGame",
  turn: "",
  lastwinner: "",
  poneconn: false,
  ptwoconn: false,
  diceroll: 0,
  poneGuess: 0,
  ptwoGuess: 0
};

// JSON File related/internal game state functions

/** Create json file to store game state */
async function createFile() {
  resetGame();

  const opts = {
    startIn: 'desktop',
    suggestedName: 'TTTdata.json',
    types: [{
      description: 'TTT Local Save',
      accept: {
        'text/plain': ['.json'],
      }
    }]
  }

  filehandle = await window.showSaveFilePicker(opts);
  const file = await filehandle.createWritable();
  const contents = JSON.stringify(game);
  await file.write(contents);
  await file.close();
}

/** Loads file opened by user, to 'join' a game */
async function loadFile() {
  const opts1 = {
    startIn: 'desktop',
  }
  filehandle = await window.showOpenFilePicker(opts1);
}

/** Read data from json file, update internal state with read data */
async function readFile() {
  const file1 = await filehandle.getFile();
  const contents1 = await file1.text();
  const data = JSON.parse(contents1);
  game.state = data.state;
  game.turn = data.turn;
  game.lastwinner = data.lastwinner;
  game.poneconn = data.poneconn;
  game.ptwoconn = data.ptwoconn;
  game.diceroll = data.diceroll;
  game.poneGuess = data.poneGuess;
  game.ptwoGuess = data.ptwoGuess;
}

/** Stringify internal state, update json file with new data */
async function updateFile() {
  const file2 = await filehandle.createWritable();
  let contents2 = JSON.stringify(game);
  await file2.write(contents2);
  await file2.close();
}

/** Reset internal game state, clear table; use to reset the board after 1st run of game */
function resetGame() {
  game.state = "NextGame";
  game.turn = "";
  // game.lastwinner is updated separately to not overwrite previous winner
  game.diceroll = 0;
  game.poneGuess = 0;
  game.ptwoGuess = 0;
  cleartable();
}

// Computational functions

/** Roll a die with n faces*/
function rollDie(n) {
  return Math.floor(Math.random() * n) + 1;
}

function determineFirst() {
  readFile();
  let dr = rollDie(6);
  onediff = Math.abs(dr - game.poneGuess);
  twodiff = Math.abs(dr - game.ptwoGuess);

  if (onediff == twodiff) {
    updateTurnDisplay("Both players chose the same number; please make a different guess");
    turnorderdetermined = false;
  }
  else if (onediff < twodiff) {
    game.turn = ponechar;
    turnorderdetermined = true;
  }
  else {
    game.turn = ptwochar;
    turnorderdetermined = true;
  }
  updateFile();

  if (mychar == game.turn) {
    myturn = true;
  }
  else {
    myturn = false;
  }
}

/** Checks if innerText across an array of cells are equal. 
 * @param {Object[]} cellarr
 * @returns {boolean}
 */

function arrayeq(cellarr) {
  const fe = cellarr[0].innerText.trim();
  if (fe == whitespace || fe == "") {
    return false;
  }
  return Array.from(cellarr).every(cell => cell.innerText.trim() == fe);
}

/** Checks for TTT win conditions. */
function checkwin() {
  var tbl = document.getElementById("tbl");
  var tblrows = tbl.rows; // all rows
  var iswinner = false;

  for (let i=0; i<rows; i++) { // check rows
    let crow = tblrows[i].cells; // all cells in current row
    if (arrayeq(crow)) {
      for (let j=0; j<cols; j++) {
        crow[j].style.color = "red";
      }
      iswinner = true;
    }
  }

  for (let i=0; i<cols; i++) { // check columns
    let colarr = [];
    for (j=0; j<rows; j++) {
      colarr.push(tblrows[j].cells[i]);
    }
    if (arrayeq(colarr)) {
      for (let n=0; n<rows; n++) {
        colarr[n].style.color = "red";
      }
      iswinner = true;
    }
  }

  let diagarr1 = [];
  for (let i=0; i<rows; i++) { // check diagonals (x,x)
    diagarr1.push(tblrows[i].cells[i]);
  }
  if (arrayeq(diagarr1)) {
    for (let n=0; n<rows; n++) {
      diagarr1[n].style.color = "red";
    }
    iswinner = true;
  }

  let diagarr2 = [];
  let idx = rows - 1;
  for (let i=idx; i>=0; i--) {
    diagarr2.push(tblrows[i].cells[idx-i]);
  }
  if (arrayeq(diagarr2)) {
    for (let n=0; n<rows; n++) {
      diagarr2[n].style.color = "red";
    }
    iswinner = true;
  }

  return iswinner;
}

/** Sets the text content of the cell specified by row (r) and column (c) to the given string parameter (s).
 * @param {number} r
 * @param {number} c
 * @param {string} s 
 */
function setcell(r, c, s) {
  let tbl = document.getElementById("tbl");
  let ro = tbl.rows[r];
  let ce = ro.cells[c];
  ce.textContent = s;
}

/** Clears the tic tac toe board. */
function cleartable() {
  let tbl = document.getElementById("tbl");
  for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
      setcell(i, j, whitespace);
      tbl.rows[i].cells[j].style.color = "black";
    }
  }
}

/** Play */
function play() {
  if (myturn) {
    tbl.addEventListener('click', cellclick);
  }
  else {
    tbl.removeEventListener('click', cellclick);
  }
}

/** Start game, called after player presses new/load game */
function start() {
  let btn3 = document.getElementById("cs_btn");
  let ngbtn = document.getElementById("ng_btn");
  let jgbtn = document.getElementById("jg_btn");
  let sgbtn = document.getElementById("sg_btn");
  let tbl = document.getElementById("tbl");
  let playersconnected = false;

  readFile();

  if (game.poneconn && game.ptwoconn) {
    playersconnected = true;
    ngbtn.disabled = true;
    jgbtn.disabled = true;
  }

  if (playersconnected && !turnorderdetermined) {
    sgbtn.disabled = false;
  }
  else if (playersconnected && turnorderdetermined) {
    btn3.disabled = false;
  }
}

/** Responds to the user clicking on cells in the table.
 * @param {Object} event 
 */
function cellclick(event) {
  let clickedcell = event.target;
  clickedcell.textContent = mychar;

  if (checkwin()) {
    updateTurnDisplay(mychar + " wins!");
  }
  else {
    myturn = false
    readFile();
    if (mychar == ponechar) {
      game.turn = ptwochar;
    }
    else {
      game.turn = ponechar;
    }
    updateFile();
    play();
  }
}

/** Updates Clear/Start button */
function cs_buttonclick() {
  let btn = document.getElementById("cs_btn");
  if (btn.textContent == "Start") {
    btn.textContent = "Clear";
    play();
  }
  else {
    btn.textContent = "Start";
    resetGame();
  }
}

function ng_buttonclick() {
  createFile();
  if (mychar == "") {
    mychar = ponechar;
    game.poneconn = true;
  }
  updateTurnDisplay("You are " + mychar);
  start();
}

function jg_buttonclick() {
  loadFile();
  if (mychar == "") {
    mychar = ptwochar;
    game.ptwoconn = true;
  }
  updateTurnDisplay("You are " + mychar);
  start();
}

function sg_buttonclick() {
  let guesselem = document.getElementById("dg");
  let guess = guesselem.textContent;

  readFile(); // Ensure internal state is updated
  if (mychar == ponechar) {
    game.poneGuess = guess;
  }
  else {
    game.ptwoGuess = guess;
  }
  updateFile();
  determineFirst();
}

// UI functions

function updateTitle(ttxt) {
  let ttl = document.getElementById("title");
  ttl.textContent = ttxt;
}

/** Update turn display */
function updateTurnDisplay() {
  let my = document.getElementById("mt");
  if (myturn) {
    my.textContent = "It is your turn";
  }
  else {
    my.textContent = "It is your opponent's turn";
  }
}

/** Creates the table/playing board visually. */
function table() {
  let table = document.createElement("table");
  table.id = "tbl";
  // table.addEventListener('click', cellclick);
  for (let i=1; i<=rows; i++) {
    let row = table.insertRow();
    for (let j=1; j<=cols; j++) {
      let cell = row.insertCell();
      cell.appendChild(document.createTextNode(whitespace));
    }
  }
  document.body.appendChild(table);
}

/** Creates the clickable Clear/Start button. */
function cs_button() {
  let cs_button = document.createElement("button");
  cs_button.id = "cs_btn";
  cs_button.textContent = "Start";
  cs_button.disabled = true;
  cs_button.addEventListener("click", cs_buttonclick);
  document.body.appendChild(cs_button);
}

function ng_button() {
  let ng_button = document.createElement("button");
  ng_button.id = "ng_btn";
  ng_button.textContent = "New Game";
  ng_button.addEventListener("click", ng_buttonclick);
  document.body.appendChild(ng_button);
}

function jg_button() {
  let jg_button = document.createElement("button");
  jg_button.id = "cs_btn";
  jg_button.textContent = "Join Game";
  jg_button.addEventListener("click", jg_buttonclick);
  document.body.appendChild(jg_button);
}

function input_text(placeholder_value) {
  let inp = document.createElement("INPUT");
  inp.setAttribute("type", "text");
  inp.id = "dg";
  inp.setAttribute("placeholder", placeholder_value);
  document.body.appendChild(inp);
}

function sg_button() {
  let sg_button = document.createElement("button");
  sg_button.id = "sg_button";
  sg_button.textContent = "Submit Guess";
  sg_button.disabled = true;
  document.body.appendChild(sg_button);
}

/** Loads the table/playing board and Clear/Start button. */
function vis_loadpage() {
  table();
  cs_button();
  ng_button();
  jg_button();
  input_text("Enter number 1-6");
  sg_button();
}