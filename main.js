

const depbtn = document.querySelector('#depbtn')
const betbtn = document.querySelector('#betbtn');
let list = document.getElementById("myList");

depbtn.addEventListener('click', function() {
    deposit();
    console.log(bal);
    update();
});

betbtn.addEventListener('click', function () {
    console.log(bal);
    const lines = getLines();
    const bet = getbet(lines);
    const spinres = spin();

    displayspin(spinres);
    checkbet(spinres, lines, bet);

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

    for (let i=1; i<4; i++){
        const l = spin;
        const c = l.slice(i*3-3, i*3);
        let li = document.createElement('li');
        li.innerText = c[0]+c[1]+c[2];
        list.appendChild(li);
    }
}


//const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    C : 6,
    D : 10
}
const SYMBOLS_VALUES = {
    "A" : 5,
    "B" : 4,
    "C" : 3,
    "D" : 2
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

const getLines = () => {
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

const getbet = (lines) => {
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
    for (let i = 0; i<9; i++){
        const randomIndex = Math.floor(Math.random() * symbols.length);
        res.push(symbols[randomIndex]);
        symbols.splice(randomIndex, 1);
    }

    console.log(res);
    return res;

}

const allEqual = arr => arr.every( v => v === arr[0] )

const checkbet = (spinres, lines, betamount) => {
    let correctlines = 0;
    const correctsymbols = [];

    for (let i=1; i<4; i++){
        const l = spinres;
        const c = l.slice(i*3-3, i*3);
        console.log(c);
        if (allEqual(c)){
            correctsymbols.push(c[0]);
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

    console.log(lineswon);
    console.log(correctsymbols);

    if (lineswon > 0){
        let win = 0;
        for (const s of correctsymbols){
            win += SYMBOLS_VALUES[s]*betamount;
            bal += win;
        }
        document.getElementById("result").innerHTML = "You won " + win + "$";
    }
    else{
        document.getElementById("result").innerHTML = "You lost";
    }
    return 0;
}

