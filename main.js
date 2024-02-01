const depbtn = document.querySelector('#depbtn')
const form = document.querySelector('form')
let list = document.getElementById("myList");

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const lines = document.querySelector('#lines').value;
    const betamount = document.querySelector('#betamount').value;
    console.log(`Lines: ${lines}, betamount: ${betamount}`);

    const nlines = parseFloat(lines);
    if (isNaN(nlines) || nlines<1 || nlines>3 ){
        console.log("Lines must be between 1-3");
        return;
    }

    const nbetamount = parseFloat(betamount);
    if (isNaN(nbetamount) || nbetamount<= 0 || nbetamount*lines > bal){
        console.log("Invalid amount");
        return;
    }else{
        bal -= nbetamount*lines;
    }

    const spinres = spin();
    displayspin(spinres);

    checkbet(spinres, lines, betamount);
    console.log(bal);
    update();

});


depbtn.addEventListener('click', function() {
    deposit();
    console.log(bal);
    update();
});

const update = () => {
    document.getElementById("balance").innerHTML = "balance: " + bal + "$";
}

const displayspin = (spin) => {
    while (list.firstChild) {   //remove previous spin
        list.removeChild(list.firstChild)
    }

    for (reel of spin){
        let li = document.createElement('li');
        li.innerText = reel[0] +" "+ reel[1]+" "+reel[2];
        list.appendChild(li);
    }
}


//const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A : 2,
    B : 4,
    C : 6,
    D : 8
}
const SYMBOLS_VALUES = {
    A : 20,
    B : 12,
    C : 7,
    D : 4
}

let bal = 0;
const deposit = () => {
    while(true){
        const dpamount = prompt("Enter deposit amount: ");
        const ndpamount = parseFloat(dpamount);
        if (isNaN(ndpamount) || ndpamount <= 0 ){
            console.log("Invalid amount");
        }else{
            bal += ndpamount;
            return bal;
        }
    }
};

const getLines = () => { //not used
    while(true){
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        const nlines = parseFloat(lines);
        if (isNaN(nlines) || nlines<1 || nlines>3 ){
            console.log("Lines must be between 1-3");
        }else{
            return nlines;
        }
    }
}

const getbet = (lines) => { //not used
    while(true){
        const betamount = prompt("Enter amount to bet per line: ");
        const nbetamount = parseFloat(betamount);
        if (isNaN(nbetamount) || nbetamount<= 0 || nbetamount*lines > bal){
            console.log("Invalid amount");
        }else{
            bal -= nbetamount*lines;
            return nbetamount;
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const[symbol,count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i<count; i++){
            symbols.push(symbol)
        }
    }

    const res = [];
    for (let i = 0; i<COLS; i++){
        res.push([]);
        const reelsymbols = [...symbols];
        for (let j = 0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelsymbols.length);
            res[i].push(reelsymbols[randomIndex]);
            reelsymbols.splice(randomIndex, 1);
        }
    }

    const tranres = []; //transpose res
    for (let i = 0; i<ROWS; i++){
        tranres.push([]);
        for (let j = 0; j<COLS; j++){
            tranres[i].push(res[j][i]);
        }
    }

    return tranres;

}

const allEqual = arr => arr.every( v => v === arr[0] )

const checkbet = (spinres, lines, betamount) => {
    let correctlines = 0;
    const correctsymbols = [];

    for (reel of spinres){
        if (allEqual(reel)){
            correctsymbols.push(reel[0]);
            correctlines += 1;
        }
    }

    let lineswon = 0;
    if (correctlines==0){
        lineswon = 0;
    }
    else if (correctlines >= lines){
        lineswon = lines;
        for(let i=0; i<correctlines-lines; i++){
            correctsymbols.pop();
        }
    }
    else { //correctlines < lines
        lineswon = correctlines;
    }

    if (lineswon > 0){
        let win = 0;
        for (const s of correctsymbols){
            win += SYMBOLS_VALUES[s]*betamount;
            bal += win;
        }
        document.getElementById("result").innerHTML = "You won " + win + "$";
    }
    else{
        document.getElementById("result").innerHTML = "You lost " + "-"+ betamount*lines + "$";
    }
    return 0;
}

