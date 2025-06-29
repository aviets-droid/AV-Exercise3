// Aisling Viets
// 6/28/25
// CS 491 Exercise 3
// Tic Tac Toe - Local Multiplayer

const rows = 3;
const cols = 3;
const whitespace = "\u00A0";
const ptwochar = "X";
const ponechar = "O";
const ptwoname = "Player Two";
const ponename = "Player One";
var filehandle;
var myturn;

// Data

/** Create json file to store game state */
async function createFile() {

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
  const contents = '{"gamestate": -1},"ponechoice": 0,"ptwochoice": 0';
  await file.write(contents);
  await file.close();
}

/** Load file */
// async function readData() {
//   const fs = require('fs').promises;
//   try {
//     const data = await 
//   }
// }

// Computational functions

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

  if (iswinner) {
    document.getElementById("title").innerHTML = gamestate + " wins";
    gamestate = "GameWin";
    tbl.removeEventListener('click', com_cellclick);
  }
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

/** Responds to the user clicking on cells in the table.
 * @param {Object} event 
 */
function cellclick(event) {
  let clickedcell = event.target;
  if (clickedcell.textContent != ptwochar && clickedcell.textContent != ponechar) {
    clickedcell.textContent = ponechar;
  }
}

/** Updates Clear/Start button based on game state. */
function cs_buttonclick() {
  let btn = document.getElementById("cs_btn");
  let tbl = document.getElementById("tbl");
  if (btn.textContent == "Start") {
    btn.textContent = "Clear";
    createFile();
  }
  else {
    btn.textContent = "Start";
    document.getElementById("title").innerHTML = "Tic Tac Toe";
    cleartable();
  }
}

function ng_buttonclick() {
  //
}

function jg_buttonclick() {
  //
}

// UI functions

/** Creates the table/playing board visually. */
function table() {
  let table = document.createElement("table");
  table.id = "tbl";
  table.addEventListener('click', cellclick);
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

/** Loads the table/playing board and Clear/Start button. */
function vis_loadpage() {
  table();
  cs_button();
  ng_button();
  jg_button();
}