let oppbid1, oppbid2, oppbid1Adj, oppbid2Adj;
let yourbid1, yourbid2;
let trick1, trick2;
let line1, line2, line3, line4;
let cpu = 0;
let youradj = [];
let oppadj = [];
let oppscore = 0;
let yourscore = 0;
let oppmatch = 0;
let yourmatch = 0;
let loop = 0;
let count = 0;
let rule = 0;
let scorerev = 0;
let cbuttons = document.getElementsByClassName("cbutton");
let buttons = document.getElementsByClassName("button");

// variables specific to computer player //
let scorediff, roundmod, trickdiff, trickavg;
let compavg, youravg; 
let comphigh, yourhigh;
let compcards = [];
let yourcards = [];
let csum = 0;
let ysum = 0;

// variables specific to retrieving/displaying user data //
let data =[];
let ranknum = ['gprank', 'winsrank', 'winperrank'];
let statrank;
let obj, user, key;
let gp, wins, losses, ties, abs, winper;

// variable specific to not yet implemented new comp strategy //
let lowspread = 0;

// variable specific to not yet implemented Gauntlet Mode //
let gauntlet = 0;
let strikecount = 0;
let mod, adj;

// general functions that get called by a variety of others //
function btnDisabler(){
    for (let i = 0; i < arguments.length; i++){
        document.getElementById(arguments[i]).disabled = true;
    }
}

function btnEnabler(){
    for (let i = 0; i < arguments.length; i++){
        document.getElementById(arguments[i]).disabled = false;
    }
}

function displayNone(){
    for (let i = 0; i < arguments.length; i++){
        document.getElementById(arguments[i]).style.display = "none";
    }
}

function blankInnerHTML(){
    for (let i = 0; i < arguments.length; i++){
        document.getElementById(arguments[i]).innerHTML = '';
        }
}

function greeting(){
    rule++
    document.getElementById("rulespar").innerHTML = ("Welcome to Bid-to-Win, <span style='color: blue'>"+user+"</span>!" + "<br><br>" +
        "You stats will all be saved, and you can view and retrieve them at anytime." + "<br>" +
        " Your current ranking in the database for games played, wins, and win% is also displayed." + "<br><br>" +
        " I hope you enjoy the game!")
    document.getElementById("rulespar").style.backgroundColor = "lightgray";
    document.getElementById("rulebtn").style.backgroundColor = "black";
    document.getElementById("rulebtn").style.color = "white";
}

function gameReset(){
    loop = 0;
    count = 0;
    youradj = [];
    oppadj = [];
    yourcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    compcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yourscore = 0;
    oppscore = 0;
    document.getElementById("scoreboard").innerHTML = "0 - 0";
    document.getElementById("scoreboard").style.background = "lightgray";
    document.getElementById("scoreboard").style.color = "black";
    blankInnerHTML('oppbid1', 'oppbid2', 'yourbid1', 'yourbid2', 'trick1', 'trick2');
    document.getElementById("trick1").style.backgroundColor = "white";
    document.getElementById("trick2").style.backgroundColor = "white";
    document.getElementById("trick1").style.color = "black";
    document.getElementById("trick2").style.color = "black";
    btnEnabler('newround');
    btnDisabler('newgame');

    for (i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundColor = "rgb(140, 140, 255)";
        cbuttons[i].style.backgroundColor = "rgb(255, 140, 140)";
    }
}

function userRanks(){
    statrank = ranknum.shift();

    baseURL2 = `https://bid-to-win.herokuapp.com/user_stats/1.0.0/${statrank}/:Username?Username=${user}`
    fetch(baseURL2)
    .then(response => response.json())
    .then(result => {
        if(result.data.length == 0){
            alert("Unable to retrieve stats for current user.")
        } else {            
            obj = result.data[0];
            let rem = obj.row_num % 10;

            if(obj.row_num > 10 && obj.row_num < 14){// this doesn't currently deal the teens in the hundreds correctly//
                document.getElementById(statrank).innerHTML = obj.row_num+'th';
            } else if (rem == 1){
                document.getElementById(statrank).innerHTML = obj.row_num+'st';
            } else if (rem == 2){
                document.getElementById(statrank).innerHTML = obj.row_num+'nd';
            } else if (rem == 3){
                document.getElementById(statrank).innerHTML = obj.row_num+'rd';
            } else {
                document.getElementById(statrank).innerHTML = obj.row_num+'th';
            }

            if(ranknum.length > 0){
                userRanks();
            } else {
                ranknum = ['gprank', 'winsrank', 'winperrank'];
            };
        };
    });
}

function gameStart(){
    const baseURL = 'https://bid-to-win.herokuapp.com/user/1.0.0/game_started';
        fetch(baseURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: user,
            })
        });
}

function userWin(){
    wins++
    winper = Math.round(((wins)*100)/(wins + losses));
    const baseURL = 'https://bid-to-win.herokuapp.com/user/1.0.0/win';
    fetch(baseURL, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: user,
            WinPerc: winper
        })
    });
}

function userLoss(){
    losses++
    winper = Math.round((wins * 100)/(wins + losses));
    const baseURL = 'https://bid-to-win.herokuapp.com/user/1.0.0/loss';
    fetch(baseURL, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: user,
            WinPerc: winper
        })
    }); 
}

function userTie(){
    ties++
    if(wins + losses != 0){
        winper = ((wins * 100)/(wins + losses));
    } else {
        winper = 0;
    }
    const baseURL = 'https://bid-to-win.herokuapp.com/user/1.0.0/tie';
    fetch(baseURL, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: user,
            WinPerc: winper
        })
    });
}

function gauntletWin(){
    console.log('gauntletWin');
}

function gauntletLoss(){
    console.log('gauntletLoss');
}

function gauntletTie(){
    console.log('gauntletTie');
}

function userButtons(){
    for (i = 0; i < buttons.length; i++){//enables all player buttons
        buttons[i].disabled = false;
    }
    
    for (i = 0; i < youradj.length; i++){//disables used player buttons
        youradj[i].disabled = true;
    }
}

function compButtons() {
    for (i = 0; i < cbuttons.length; i++){
        cbuttons[i].disabled = false;
    }        
    for (i = 0; i < oppadj.length; i++){
        oppadj[i].disabled = true;
    }
}

function firstBid(){
    document.getElementById("yourbid1").innerHTML = yourbid1;
    line1 = document.getElementById("card"+yourbid1);
}

function secondBid(){
    document.getElementById("yourbid2").innerHTML = yourbid2;
    line2 = document.getElementById("card"+yourbid2);
}

function p2FirstBid(){
    document.getElementById("oppbid1").innerHTML = oppbid1;
    line3 = document.getElementById("opp"+oppbid1);
}

function p2SecondBid(){
    document.getElementById("oppbid2").innerHTML = oppbid2;
    line4 = document.getElementById("opp"+oppbid2);
}

function resultRecorder(){
    if(cpu == 1 && yourscore > oppscore && user != null){
        userWin();    
    } else if(cpu == 1 && youradj.length == 10 && yourscore < oppscore && user != null){
        userLoss();
    } else if (cpu == 1 && youradj.length == 10 && yourscore == oppscore && user != null){
        userTie(); 
    } else {};
}

function gauntletRecorder(){
    if(cpu == 1 && yourscore > oppscore && user != null){
        gauntletWin();    
    } else if(cpu == 1 && yourscore < oppscore && user != null){
        gauntletLoss();
    } else if (cpu == 1 && yourscore == oppscore && user != null){
        gauntletTie(); 
    } else {};
}

function gauntletAdj(){
    for (i = 0; i < cbuttons.length && i < yourmatch; i++){
        cbuttons[i].value = i + 1 +'.5';
    }
}

function gauntletBids(){
    for (i = 0; i < Math.ceil(yourmatch/10); i++){
        if (oppbid1 <= yourmatch - (10 * i)){
            oppbid1 = oppbid1 + 0.5;
        }
    }

    for (i = 0; i < Math.ceil(yourmatch/10); i++){
        if (oppbid2 <= yourmatch - (10 * i)){
            oppbid2 = oppbid2 + 0.5;
        }
    }
}

function oppbid1SizeAdjust(){
    if (Math.floor(oppbid1) <= yourmatch && oppbid1 <= 10){
        document.getElementById('oppbid1').style.width = '7.7vw';
    } else if (Math.floor(oppbid1) <= yourmatch){
        document.getElementById('oppbid1').style.width = '7.7vw';
    } else{}
}

function oppbid2SizeAdjust(){
    if (Math.floor(oppbid2) <= yourmatch && oppbid2 <= 10){
        document.getElementById('oppbid2').style.width = '7.7vw';
    } else if (Math.floor(oppbid2) <= yourmatch){
        document.getElementById('oppbid2').style.width = '7.7vw';
    } else{}
}

//start of login/create user functions//
function logBox() {
    if (youradj.length == 0){
    btnDisabler('login', 'playcomp', 'play2p', 'viewlead');
    displayNone('newuser', 'leaderdiv', 'leaderboard', 'leaderkey');     
    document.getElementById("logindiv").style.display = 'inline-block';
    } else {
        newGame();
        logBox();
    }
}

function createUser(){
    btnDisabler('playcomp', 'play2p', 'viewlead');
    displayNone('newuser', 'login','leaderdiv', 'leaderboard', 'leaderkey');     
    document.getElementById("logindiv").style.display = 'inline-block';
    document.getElementById("logbtn").onclick = newUser;
}

function signIn(){
    user = document.getElementById("Username").value;
    key = document.getElementById("Password").value;
    btnEnabler('playcomp', 'play2p', 'viewlead');

    const baseURL = `https://bid-to-win.herokuapp.com/user/1.0.0/:Username/:Password?Username=${user}&Password=${key}`;
    fetch(baseURL)
        .then(response => response.json())
        .then(result => {
            obj = result.data[0];
            if (obj.msg == null){
                gp = obj.GP;
                wins = obj.Wins;
                losses = obj.Losses;
                ties = obj.Ties;
                abs = obj.Abandons;
                winper = obj.WinPerc;
                document.getElementById("userstats").style.display = "inline";
                displayNone('logindiv');
                btnEnabler('login');
                document.getElementById("login").innerHTML = "Sign Out";
                document.getElementById("login").onclick = signOut;
                document.getElementById("p1").innerHTML = user;
                document.getElementById('rulebtn').innerHTML = 'The Rules';
            } else {
                loginFail();
                blankInnerHTML('rulespar');
                document.getElementById('rulespar').innerHTML = obj.msg;
            }
        });
}

function newUser(){
    user = document.getElementById("Username").value;
    key = document.getElementById("Password").value;

    const baseURL = 'https://bid-to-win.herokuapp.com/user/1.0.0/create';
    fetch(baseURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: user,
            Password: key
        })})
        .then(response => response.json())
        .then(result => {
            if (result.data == null){
                nowLogin();
            } else {
                loginFail();
                blankInnerHTML('rulespar');
                for(i = 0; i < result.data.length; i++){
                    obj = result.data[i];
                    document.getElementById('rulespar').innerHTML += obj.msg+'<br><br>';
                }
            }
        })
}

function nowLogin(){
    displayNone('logindiv');
    document.getElementById('rulebtn').innerHTML = 'The Rules';
    document.getElementById("userstats").style.display = "inline";
    document.getElementById("login").style.display = "inline";
    document.getElementById("login").innerHTML = "Sign Out";
    document.getElementById("login").onclick = signOut;
    btnEnabler('playcomp', 'play2p', 'viewlead');
    greeting();
    document.getElementById("p1").innerHTML = user;
    gp = 0;
    wins = 0;
    losses = 0;
    ties = 0;
    abs = 0;
    winper = 0;
}

function loginFail(){
    rule++

    document.getElementById('rulebtn').innerHTML = 'Clear';
    document.getElementById("login").style.display = "inline";
    btnEnabler('playcomp', 'play2p', 'viewlead', 'login');
    document.getElementById("rulespar").style.backgroundColor = "lightgray";
    document.getElementById("rulebtn").style.backgroundColor = "black";
    document.getElementById("rulebtn").style.color = "white";
    document.getElementById("login").innerHTML = "Reset";
    document.getElementById("login").onclick = signOut;
}

function signOut(){
    location.reload();
}

//end of login/create user functions//
function userStats(){
    displayNone('leaderdiv', 'leaderboard', 'leaderkey');
    userRanks();
    document.getElementById("userstats").innerHTML = "Refresh Stats";
    blankInnerHTML('rulespar');
    document.getElementById("userhead").innerHTML = user;
    document.getElementById("gpdisp").innerHTML = gp;
    document.getElementById("winsdisp").innerHTML = wins;
    document.getElementById("lossesdisp").innerHTML = losses;
    document.getElementById("tiesdisp").innerHTML = ties;
    document.getElementById("abandonsdisp").innerHTML = abs;
    document.getElementById("winperdisp").innerHTML = winper+'%';
    document.getElementById("statdisplay").style.display = "inline-flex";
    document.getElementById('stattable').style.display = '';
}

function leaderboard(){
    displayNone('stattable', 'statdisplay');
    blankInnerHTML('rulespar');
    document.getElementById("rulespar").style.backgroundColor = "transparent";
    document.getElementById("rulebtn").style.backgroundColor = "white";
    document.getElementById("rulebtn").style.color = "black";
    document.getElementById("userstats").innerHTML = "User Stats";

    const baseURL = 'https://bid-to-win.herokuapp.com/user_stats/1.0.0/leaderboard';
    fetch(baseURL)
        .then(response => response.json())
        .then(result => {
            for (i = 0; i < 10 && i < result.data.length; i++){
                obj = result.data[i];
                j = i + 1;
                document.getElementById("user"+j).innerHTML = obj.Username;
                document.getElementById("gp"+j).innerHTML = obj.GP;
                document.getElementById("wins"+j).innerHTML = obj.Wins;
                document.getElementById("losses"+j).innerHTML = obj.Losses;
                document.getElementById("ties"+j).innerHTML = obj.Ties;
                document.getElementById("winper"+j).innerHTML = obj.WinPerc;
                document.getElementById("abs"+j).innerHTML = obj.Abandons;
            }

            document.getElementById("leaderdiv").style.display = "inline-flex";
            document.getElementById('leaderboard').style.display = '';
            document.getElementById("leaderkey").style.display = "inline-flex";
        });
}

function Rules() {
    rule++

    if (rule %2 != 0){
    document.getElementById("rulespar").innerHTML = ("1. Both players have 10 buttons numbered 1-10." + "<br><br>" + 
        "2. A round begins with two randomly generated 'Tricks' between 1-10 being placed up for bid." + "<br><br>" +  
        "3. First, the Blue player must choose their two bids. The first number they click will be for the trick on the left. Red must look away until Blue clicks 'Commit Bids'!" + "<br><br>" +
        "4. After Red makes their selections, the bids are revealed." + "<br><br>" + 
        "5. The player that bids the highest on a trick, wins that many points." + "<br><br>" + 
        "6. Each game consists of five rounds of bidding." + "<br><br>" + 
        "7. Each button can only be used once a game." + "<br><br>" +           
        "8. The player with the most points after 5 rounds is the winner!" + "<br><br>" + 
        "9. The Match Tally keeps track of total wins for each player. Enjoy!");
    document.getElementById("rulespar").style.backgroundColor = "lightgray";
    document.getElementById("rulebtn").style.backgroundColor = "black";
    document.getElementById("rulebtn").style.color = "white";
    } else {
        blankInnerHTML('rulespar');
        document.getElementById("rulespar").style.backgroundColor = "transparent";
        document.getElementById("rulebtn").style.backgroundColor = "white";
        document.getElementById("rulebtn").style.color = "black";
    }
}

function playComp(){
    cpu = 1;
    document.getElementById("player2").src = "images/comp_player.png";
    document.getElementById("p2").innerHTML = "COMPUTER";
    compcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yourcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    document.getElementById("playcomp").value = 'Normal Mode';
    document.getElementById("playcomp").onclick = normComp;
    document.getElementById("play2p").value = 'Gauntlet Mode';
    document.getElementById("play2p").onclick = theGauntlet;
}

function normComp(){
    btnDisabler('playcomp', 'play2p');
    btnEnabler('newround');
}

function theGauntlet(){
    gauntlet = 1;

    document.getElementById('tally').innerHTML = 'Wins';
    document.getElementById('matchscore').innerHTML = 0;

    btnDisabler('playcomp', 'play2p');
    btnEnabler('newround');
}

function play2p(){
    btnDisabler('playcomp', 'play2p');
    btnEnabler('newround');
    alert("User data currently does not get recorded for two-player games.");
}

function undo(){
    btnDisabler('commit');

    if (cpu == 0 && loop == 1 && count % 2 != 0){
        blankInnerHTML('oppbid1');
        line3.disabled = false;
        oppadj.pop();
        loop = 0;
    } else if (cpu == 0 && loop == 2 && count % 2 != 0){
        blankInnerHTML('oppbid1', 'oppbid2');
        oppadj.pop();
        oppadj.pop();
        loop = 0;
        compButtons();
    } else if (loop == 1){
        blankInnerHTML('yourbid1');
        line1.disabled = false;
        youradj.pop();
        loop = 0;
    } else {
        blankInnerHTML('yourbid1', 'yourbid2');
        youradj.pop();
        youradj.pop();
        loop = 0;
        userButtons();
    }    
}

function trickGen(){
    let a = Math.floor((Math.random() * 10) + 1);
    let b = Math.floor((Math.random() * 10) + 1);

    if (a != b && a > b){//generates and places the tricks
        trick1 = b;
        trick2 = a;
    } else if (a != b && a < b){
        trick1 = a;
        trick2 = b;
    } else if (a == b && a % 2 == 0){
        trick1 = a - 1;
        trick2 = b;
    } else {
        trick1 = a;
        trick2 = b + 1;
    }

    if (cpu == 0){//if vs. comp, sets cbidboxes to ?
        blankInnerHTML('oppbid1', 'oppbid2');
    } else {
        document.getElementById('oppbid1').style.width = '5.85vw';
        document.getElementById('oppbid2').style.width = '5.85vw';
        document.getElementById("oppbid1").innerHTML = "?";
        document.getElementById("oppbid2").innerHTML = "?";
    }
    
    document.getElementById("trick1").style.backgroundColor = "white";//displays the tricks, erases the last bids
    document.getElementById("trick2").style.backgroundColor = "white";
    document.getElementById("trick1").style.color = "black";
    document.getElementById("trick2").style.color = "black";
    blankInnerHTML('yourbid1', 'yourbid2');
    document.getElementById("trick1").innerHTML = trick1;    
    document.getElementById("trick2").innerHTML = trick2;    

    btnDisabler('newround');//disables Next Round
    userButtons();

    if(cpu == 1 && youradj.length == 0 && user != null){
        gp++
        abs++
        gameStart();    
    } else {}

    compStrat();
}

function Commit(){
    loop = 0;
    scorerev = 0;
    yourcards.splice(yourcards.indexOf(yourbid1), 1);
    yourcards.splice(yourcards.indexOf(yourbid2), 1);
    btnDisabler('undo', 'commit');

    if (cpu == 0) {
        count++;        
        if (count % 2 != 0){
            document.getElementById("yourbid1").innerHTML = "?";      
            document.getElementById("yourbid2").innerHTML = "?";
            compButtons();      
        } else {}
    } else {}

    if (cpu == 0 && count % 2 != 0){
        let e = 0;
    } else {
        setTimeout(scoreReveal, 800);
    }
}

function scoreReveal(){
    scorerev++

    if (scorerev == 1){
        oppbid1Adj = oppbid1;
        oppbid2Adj = oppbid2;
        gauntletBids();
    } else {}

    if (cpu == 0 && scorerev == 1){
        document.getElementById("yourbid1").innerHTML = yourbid1;
        line1.style.backgroundColor = "black";
        line3.style.backgroundColor = "black";
    } else if (cpu == 1 && scorerev == 1){
        document.getElementById("oppbid1").innerHTML = oppbid1;
        line1.style.backgroundColor = "black";
        document.getElementById("opp"+oppbid1Adj).style.backgroundColor = "black";
    } else if (scorerev == 2){
        if (yourbid1 > oppbid1){
            yourscore = yourscore + trick1;
            document.getElementById("trick1").style.backgroundColor = "blue";
            document.getElementById("trick1").style.color = "white";
            document.getElementById("scoreboard").innerHTML = yourscore + " - " + oppscore;
        } else if (yourbid1 < oppbid1){
            oppscore = oppscore + trick1;
            document.getElementById("trick1").style.backgroundColor = "red";
            document.getElementById("trick1").style.color = "white";
            document.getElementById("scoreboard").innerHTML = yourscore + " - " + oppscore;
        } else {
            document.getElementById("trick1").style.backgroundColor = "lightgray";
        };
        if (yourscore > oppscore){
            document.getElementById("scoreboard").style.background = "blue";
            document.getElementById("scoreboard").style.color = "white";
        } else if (yourscore < oppscore){
            document.getElementById("scoreboard").style.background = "red";
            document.getElementById("scoreboard").style.color = "white";
        } else {
            document.getElementById("scoreboard").style.background = "lightgray";
            document.getElementById("scoreboard").style.color = "black";
        }
    } else if (cpu == 0 && scorerev == 3){
        document.getElementById("yourbid2").innerHTML = yourbid2;
        line2.style.backgroundColor = "black";
        line4.style.backgroundColor = "black";
    } else if (cpu == 1 && scorerev == 3){
        document.getElementById("oppbid2").innerHTML = oppbid2;
        line2.style.backgroundColor = "black";
        document.getElementById("opp"+oppbid2Adj).style.backgroundColor = "black";
    } else {
        if (yourbid2 > oppbid2){
            yourscore = yourscore + trick2;
            document.getElementById("trick2").style.backgroundColor = "blue";
            document.getElementById("trick2").style.color = "white";
            document.getElementById("scoreboard").innerHTML = yourscore + " - " + oppscore;
        } else if (yourbid2 < oppbid2){
            oppscore = oppscore + trick2;
            document.getElementById("trick2").style.backgroundColor = "red";
            document.getElementById("trick2").style.color = "white";
            document.getElementById("scoreboard").innerHTML = yourscore + " - " + oppscore;
        } else {
            document.getElementById("trick2").style.backgroundColor = "lightgray";
        };
        if (yourscore > oppscore){
            document.getElementById("scoreboard").style.background = "blue";
            document.getElementById("scoreboard").style.color = "white";
        } else if (yourscore < oppscore){
            document.getElementById("scoreboard").style.background = "red";
            document.getElementById("scoreboard").style.color = "white";
        } else {
            document.getElementById("scoreboard").style.background = "lightgray";
            document.getElementById("scoreboard").style.color = "black";
        }
    }

    if (scorerev == 1){
        oppbid1SizeAdjust();
    } else if (scorerev == 3){
        oppbid2SizeAdjust();
    } else {}

    if (scorerev >= 4 && youradj.length != 10){    
        btnEnabler('newround');
    } else if (scorerev >= 4 && youradj.length == 10){
        abs--        
        btnEnabler('newgame');
        if (gauntlet == 0){
            resultRecorder();
        } else {
            strike();
            gauntletRecorder();
        }
    } else {
        setTimeout(scoreReveal, 800);
    };
}

function newGameRoute(){
    if (gauntlet == 0){
        newGame();
    } else {
        newGauntlet()
    }
}

function newGame(){
    if (yourscore > oppscore){
        yourmatch++
        document.getElementById("matchscore").innerHTML = (yourmatch + " - " + oppmatch);
    } else if (yourscore < oppscore){
        oppmatch = oppmatch + 1;
        document.getElementById("matchscore").innerHTML = (yourmatch + " - " + oppmatch);
    } else {};

    if (yourmatch > oppmatch){
        document.getElementById("matchscore").style.background = "blue";
        document.getElementById("matchscore").style.color = "white";
    } else if (yourmatch < oppmatch){
        document.getElementById("matchscore").style.background = "red";
        document.getElementById("matchscore").style.color = "white";
    } else {
        document.getElementById("matchscore").style.background = "lightgray";
        document.getElementById("matchscore").style.color = "black";
    }

    gameReset();
}

function newGauntlet(){
    if (yourscore > oppscore){
        yourmatch++
    } else {}

    document.getElementById('matchscore').style.backgroundColor = 'lightgray';
    document.getElementById('matchscore').innerHTML = yourmatch;
    gauntletAdj();
    gameReset();
}

function strike(){
    strikecount++

    document.getElementById('matchscore').innerHTML = `STRIKE ${strikecount}`;
    document.getElementById('matchscore').style.backgroundColor = 'red';
    document.getElementById('matchscore').style.color = 'blue';

    if (strikecount >= 3){
        document.getElementById('newround').value = 'See Results';
        document.getElementById('newround').onclick = gauntletResults;
    }
}

function gauntletResults(){// this function will query the database to return rankings for the trial
    console.log('gauntletResults');// it will need to reset page after recording/displaying
}

// the beginning of the player button functions //
function Card1(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card1');
    youradj.push(document.getElementById("card1"));

    if (loop === 1){
        yourbid1 = 1;
        firstBid();
    } else {
        yourbid2 = 1;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card2(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card2');
    youradj.push(document.getElementById("card2"));

    if (loop === 1){
        yourbid1 = 2;
        firstBid();
    } else {
        yourbid2 = 2;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card3(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card3');
    youradj.push(document.getElementById("card3"));

    if (loop === 1){
        yourbid1 = 3;
        firstBid();
    } else {
        yourbid2 = 3;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card4(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card4');
    youradj.push(document.getElementById("card4"));

    if (loop === 1){
        yourbid1 = 4;
        firstBid();
    } else {
        yourbid2 = 4;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card5(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card5');
    youradj.push(document.getElementById("card5"));

    if (loop === 1){
        yourbid1 = 5;
        firstBid();
    } else {
        yourbid2 = 5;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card6(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card6');
    youradj.push(document.getElementById("card6"));

    if (loop === 1){
        yourbid1 = 6;
        firstBid();
    } else {
        yourbid2 = 6;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card7(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card7');
    youradj.push(document.getElementById("card7"));

    if (loop === 1){
        yourbid1 = 7;
        firstBid();
    } else {
        yourbid2 = 7;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card8(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card8');
    youradj.push(document.getElementById("card8"));

    if (loop === 1){
        yourbid1 = 8;
        firstBid();
    } else {
        yourbid2 = 8;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card9(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card9');
    youradj.push(document.getElementById("card9"));

    if (loop === 1){
        yourbid1 = 9;
        firstBid();
    } else {
        yourbid2 = 9;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Card10(){
    loop++;
    btnEnabler('undo');
    btnDisabler('card10');
    youradj.push(document.getElementById("card10"));

    if (loop === 1){
        yourbid1 = 10;
        firstBid();
    } else {
        yourbid2 = 10;
        btnEnabler('commit');
        secondBid();      

        for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        }
    }
}
function Opp1(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp1');
    oppadj.push(document.getElementById("opp1"));

    if (loop === 1){
        oppbid1 = 1;
        p2FirstBid();
    } else {
        oppbid2 = 1;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp2(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp2');
    oppadj.push(document.getElementById("opp2"));

    if (loop === 1){
        oppbid1 = 2;
        p2FirstBid();
    } else {
        oppbid2 = 2;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp3(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp3');
    oppadj.push(document.getElementById("opp3"));

    if (loop === 1){
        oppbid1 = 3;
        p2FirstBid();
    } else {
        oppbid2 = 3;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp4(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp4');
    oppadj.push(document.getElementById("opp4"));

    if (loop === 1){
        oppbid1 = 4;
        p2FirstBid();
    } else {
        oppbid2 = 4;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp5(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp5');
    oppadj.push(document.getElementById("opp5"));

    if (loop === 1){
        oppbid1 = 5;
        p2FirstBid();
    } else {
        oppbid2 = 5;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp6(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp6');
    oppadj.push(document.getElementById("opp6"));

    if (loop === 1){
        oppbid1 = 6;
        p2FirstBid();
    } else {
        oppbid2 = 6;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp7(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp7');
    oppadj.push(document.getElementById("opp7"));

    if (loop === 1){
        oppbid1 = 7;
        p2FirstBid();
    } else {
        oppbid2 = 7;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp8(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp8');
    oppadj.push(document.getElementById("opp8"));

    if (loop === 1){
        oppbid1 = 8;
        p2FirstBid();
    } else {
        oppbid2 = 8;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp9(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp9');
    oppadj.push(document.getElementById("opp9"));

    if (loop === 1){
        oppbid1 = 9;
        p2FirstBid();
    } else {
        oppbid2 = 9;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp10(){
    loop++;
    btnEnabler('undo');
    btnDisabler('opp10');
    oppadj.push(document.getElementById("opp10"));

    if (loop === 1){
        oppbid1 = 10;
        p2FirstBid();
    } else {
        oppbid2 = 10;
        btnEnabler('commit');
        p2SecondBid();

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}

// the beginning of the computer strategy codes //

function compStrat(){// Not yet implemented fully; just a mediary right now //
    let a = Math.floor((Math.random() * 2));
    scorediff = oppscore - yourscore;
    roundmod = (compcards.length / 2);
    trickdiff = trick2 - trick1;
    trickavg = (trick1 + trick2)/2;

    comphigh = compcards[compcards.length - 1];
    yourhigh = yourcards[yourcards.length - 1];

    stratNorm();
}

function stratNorm(){
    let a = Math.floor((Math.random() * 100) + 1);
    let b = Math.floor(Math.random() * 2);
    let c = Math.floor(Math.random() * 2);
    let d = Math.floor(Math.random() * 2);
    let c0 = compcards[0];
    csum = 0;
    ysum = 0;
    
    for (i = 0; i < compcards.length; i++){
        csum += compcards[i];
    }

    for (i = 0; i < yourcards.length; i++){
        ysum += yourcards[i];
    }
    
    compavg = csum / compcards.length;
    youravg = ysum / yourcards.length;

    if (roundmod === 5 && trickdiff <= 3 && trickavg <= 5 && a <= 70){
        if (trick1 == 1 && trick2 == 2){
            oppbid1 = 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(0, 1);
        } else if (trick1 == 1 && b == 0){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }           
    } else if (roundmod === 5 && trickdiff <= 3 && trickavg <= 5 && 70 < a <=90){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 2;
            compcards.splice(0, 2);
        } else {
            oppbid1 = trick1;
            oppbid2 = 1;            
            compcards.splice([trick1 - 1], 1);
            compcards.splice(0, 1);
        }        
    } else if (roundmod === 5 && trickdiff <= 3 && trickavg <= 5 && 90 < a) {
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = trick2 + b + c;
            compcards.splice([trick2 + b + c - 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = 2;
            oppbid2 = 1;
            compcards.splice(0, 2);
        }
    } else if (roundmod === 5 && 4 <= trickdiff && trickavg <= 5 && a <= 70) {
        if (trick1 == 1 && trick2 < 9){
            oppbid1 = 1;
            oppbid2 = trick2 + b + c;
            compcards.splice([trick2 + b + c - 1], 1);
            compcards.splice(0, 1);
        } else if (trick1 == 1 && trick2 == 9){
            oppbid1 = 1
            oppbid2 = 10
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else {//potential issue with this piece??//
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (roundmod === 5 && 4 <= trickdiff && trickavg <= 5 && 70 < a <= 90){
        if (trick1 == 1){
            oppbid1 = 2;
            oppbid2 = 1;
            compcards.splice(0, 2);
        } else {
            oppbid1 = trick1;
            oppbid2 = 1;
            compcards.splice([trick1 - 1], 1);
            compcards.splice(0, 1);
        }
    } else if (roundmod === 5 && 4 <= trickdiff && trickavg <= 5 && 90 < a){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 2 + b + c;
            compcards.splice([b + c + 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = trick1 - b;
            oppbid2 = trick2 + 2;
            compcards.splice([trick2 + 1], 1);
            compcards.splice([trick1 - b - 1], 1);
        }
    } else if (roundmod === 5 && trickdiff <= 3 && 5 < trickavg && a <= 50){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = trick1 + b;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 + b - 1], 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = 9;
            oppbid2 = 10;
            compcards.splice(8, 2);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (roundmod === 5 && trickdiff <= 3 && 5 < trickavg && 50 < a <= 75){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = b + c + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([b + c], 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = 10;
            oppbid2 = b + c + 1;
            compcards.splice(9, 1);
            compcards.splice(b + c, 1);
        } else {
            oppbid1 = trick1 + b + c;
            oppbid2 = d + 1;
            compcards.splice([trick1 + b + c - 1], 1);
            compcards.splice(d, 1);
        }
    } else if (roundmod === 5 && trickdiff <= 3 && 5 < trickavg && 75 < a){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = 9;
            oppbid2 = 1;
            compcards.splice(8, 1);
            compcards.splice(0, 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = b + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(b, 1);
        } else {
            oppbid1 = trick1 + b - c;
            oppbid2 = trick2 + d;
            compcards.splice([trick2 + d - 1], 1);
            compcards.splice([trick1 + b - c - 1], 1);
        }
    } else if (roundmod === 5 && 4 <= trickdiff && 5 < trickavg && a <= 50){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else if (trick2 == 10 && trickdiff > 6){
            oppbid1 = b + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(b, 1);
        } else if (trick2 == 10){
            oppbid1 = trick1 + b - c;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 + b - c - 1], 1);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (roundmod === 5 && 4 <= trickdiff && 5 < trickavg && 50 < a <= 75){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else if (trick2 == 10 && trickdiff > 6){
            oppbid1 = trick1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 - 1], 1);
        } else if (trick2 == 10){
            oppbid1 = b + c + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([b + c], 1);
        } else {
            oppbid1 = trick1 + b - c;
            oppbid2 = trick2 + d;
            compcards.splice([trick2 + d - 1], 1);
            compcards.splice([trick1 + b - c - 1], 1);
        } 
    } else if (roundmod === 5 && 4 <= trickdiff && 5 < trickavg && 75 < a){
            if (trick1 == 1){
                oppbid1 = 1;
                oppbid2 = 10;
                compcards.splice(9, 1);
                compcards.splice(0, 1);
            } else if (trick2 == 10 && trickdiff > 6){
                oppbid1 = b + 1;
                oppbid2 = 10;
                compcards.splice(9, 1);
                compcards.splice(b, 1);//
            } else if (trick2 == 10){
                oppbid1 = trick1 + b;
                oppbid2 = 10;
                compcards.splice(9, 1);
                compcards.splice([trick1 + b - 1], 1);
            } else {
                oppbid1 = 1;
                oppbid2 = 10;
                compcards.splice(9, 1);
                compcards.splice(0, 1);
            }
    } else if ((roundmod === 3 || roundmod === 4) && trickdiff <=3 && trickavg <= 5 && a <= 70){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){// for lower percents divide this up according to avgs //
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            oppbid2 = compcards.shift();
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2 + 1) != -1){                
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if ((roundmod === 3 || roundmod === 4) && trickdiff <=3 && trickavg <= 5 && 70 < a){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){// for lower percents divide this up according to avgs //
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            if (compcards[1] <= trick2 + 1){
                oppbid2 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2) != -1){                
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);                    
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if ((roundmod === 3 || roundmod === 4) && 4 <= trickdiff && trickavg <= 5 && a <= 70){
        if (7 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else {
            oppbid1 = compcards.shift();
            if (7 < trick2 && yourhigh < comphigh){
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){//compavg and/or youravg not defined properly??//
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if ((roundmod === 3 || roundmod === 4) && 4 <= trickdiff && trickavg <= 5 && 70 < a){
        oppbid1 = compcards.shift();
        if (7 < trick2 && comphigh < yourhigh){            
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else {            
            if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if ((roundmod === 3 || roundmod === 4) && trickdiff <= 3 && 5 < trickavg && a <= 65){
        if (8 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            if (compcards.indexOf(trick1 + 1) != -1){
                oppbid1 = trick1 + 1;
                compcards.splice(compcards.indexOf(trick1 + 1), 1);                
            } else if (compcards.indexOf(trick1) != -1 && compcards[compcards.length- 2] >= yourcards[yourcards.length - 3]){
                oppbid1 = trick1;
                compcards.splice(compcards.indexOf(trick1), 1);
            } else {
                oppbid1 = compcards[b + c];
                compcards.splice(b + c, 1);
            }
        } else if (8 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] >= yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards.pop();
        } else if (8 < trick2){
            oppbid1 = compcards.pop();
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else if (7 < trick2 && yourhigh <= comphigh){
            oppbid2 = compcards.pop();
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (compcards.indexOf(trick2 + 1 + b) != -1){
            oppbid2 = trick2 + 1 + b;
            compcards.splice(compcards.indexOf(trick2 + 1 + b), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if ((roundmod === 3 || roundmod === 4) && trickdiff <= 3 && 5 < trickavg && 65 < a){
        if (8 < trick2 && comphigh < yourhigh){  
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 3] && b == 0){
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else {
                oppbid1 = compcards[c];
                compcards.splice(c, 1);
            }      
        } else if (8 < trick2 && yourhigh < comphigh){
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
                oppbid2 = compcards.pop();
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = compcards[1 + b + c];
                compcards.splice(1 + b + c, 1);
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] > yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[1 + b + c];
            compcards.splice(1 + b + c, 1);
        } else if (8 < trick2){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (7 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards[1 + b];
            compcards.splice(1 + b, 1);
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (7 < trick2 && yourhigh >= comphigh){
            oppbid2 = compcards.shift();
            if (compcards[compcards.length - 3] <= yourcards[yourcards.length - 3]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards[1 + b];
                compcards.splice(1 + b, 1);
            }
        } else if (compavg <= youravg){
            oppbid2 = compcards.shift();
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick2 + 1) != -1){
            oppbid2 = trick2 + 1
            compcards.splice(compcards.indexOf(trick2 + 1), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if ((roundmod === 3 || roundmod === 4) && 4 <= trickdiff && 5 < trickavg && a <= 70){
        if (comphigh >= yourhigh){
            oppbid2 = compcards.pop();
                if  (trick1 >= 4 && compcards.indexOf(trick1 + b) != -1){
                    oppbid1 = trick1 + b;
                    compcards.splice(compcards.indexOf(trick1 + b), 1);      
                } else {
                    oppbid1 = compcards.shift();
                }           
        } else if (trick1 > 4 && compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if ((roundmod === 3 || roundmod === 4) && 4 <= trickdiff && 5 < trickavg && 70 < a){
        if (comphigh >= yourhigh){
            if  (trick1 >= 4){//could probably modify a little. There are situations (e.g. 4-8 tricks with 8-9-10 still remaining), where it makes little sense)//
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
            } else {
                oppbid1 = compcards.shift();
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            }           
        } else if (comphigh < yourhigh){
            oppbid2 = compcards.pop();
            if (trick1 >= 3 && compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (trick1 >= 3 && compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards.shift();
            }
        }
    } else if (roundmod === 2 && a <= 70){
        if (yourhigh < comphigh){
            if (trick2 > 6){
                oppbid2 = compcards.pop();
                if (trick1 > 5 && compcards[2] >= yourcards[3]){
                    oppbid1 = compcards.pop();
                } else if (2 < trick1 <=5 && compcards[1] <= trick1) {
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[2] >= trick2){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else if (yourhigh > comphigh){
            if (trick2 > 6){
                if (compcards[2] >= trick2){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    if (compcards[1] <= trick1){
                        oppbid1 = compcards[1];
                        compcards.splice(1, 1);
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else {
                    oppbid2 = compcards.shift();
                    if (compcards[2] >= yourcards[2] && trick1 > 5){
                        oppbid1 = compcards[2];
                        compcards.splice(2, 1);
                    } else {
                        oppbid1 = compcards.shift();
                    }
                }
            } else if (compcards[2] >= trick2){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else {
            if (trick2 > 7){
                oppbid2 = compcards.pop();
                if (trick1 < 5){
                    oppbid1 = compcards.shift();
                } else if (compcards[2] >= yourcards[2]){
                    oppbid1 = compcards.pop();
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (4 < trick2 <= 7){
                if (compcards[2] >= trick2){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    oppbid1 = compcards.shift();
                } else if (compcards[1] >= yourcards[1]){
                    oppbid1 = compcards.shift();
                    oppbid2 = compcards.shift();
                } else {
                    oppbid2 = compcards.shift();
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        }
    } else if (roundmod === 2 && 70 < a){
        if (yourhigh < comphigh){
            if (trick2 > 6){
                if (compcards[1] > yourcards[0]){
                    oppbid2 = compcards[1];
                    compcards.splice(1, 1);
                    if (trick1 > 4){
                        oppbid1 = compcards.pop();
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else if (compcards[2] > yourcards[0]){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    if (trick1 > 4){
                        oppbid1 = compcards.pop();
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else {
                    oppbid2 = compcards.pop();
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[2] >= yourcards[3]){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[2] >= yourcards[2]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else if (yourhigh > comphigh){
            if (trick2 > 6){
                oppbid2 = compcards.shift();
                if (compcards[1] >= yourcards[2]){
                    oppbid1 = compcards[1];
                    compcards.splice(1, 1);
                } else if (trick1 > 5){
                    oppbid1 = compcards.pop();
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else {
            if (trick2 > 6 && trickdiff <= 3){
                oppbid2 = compcards.shift();
                if (compcards[1] > yourcards[2]){
                    oppbid1 = compcards[1];
                    compcards.splice(1, 1);
                } else {
                    oppbid1 = compcards.pop();
                }
            } else if (trick2 > 6){
                oppbid2 = compcards.pop();
                oppbid1 = compcards.shift();
            } else if (trick2 > 3 && compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
                oppbid1 = compcards.shift();
            } else if (trick2 > 3 && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        }
    
    } else if (scorediff == 0){
        oppbid2 = compcards.pop();
        oppbid1 = c0;
    } else if (scorediff > 0){
        if (comphigh < yourhigh && c0 < yourcards[0] && comphigh > yourcards[0]){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh == yourhigh && c0 < yourcards[0] && trick1 > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh < yourhigh && c0 == yourcards[0] && [trick2 - trick1] < scorediff && trick1 <= scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh < yourhigh && c0 == yourcards[0] && [trick2 - trick1] < scorediff && trick1 > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else {
            oppbid2 = compcards.pop();
            oppbid1 = c0;
        } 
    } else {
        if (comphigh > yourhigh && c0 != yourcards[0] && yourhigh >= c0 && [trick1 - trick2] > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh == yourhigh && c0 > yourcards[0] && trick1 >= Math.abs(scorediff)){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh > yourhigh && c0 == yourcards[0] && trickdiff < Math.abs(scorediff)){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else {
            oppbid2 = compcards.pop();
            oppbid1 = c0;
        }
    } 
}

//not yet implemented attempt to break the computer strategy down to several functions that incorporate more variables//
function stratRoundOne(){
    if (trickdiff <= 3 && trickavg <= 5 && a <= 70){
        if (trick1 == 1 && trick2 == 2){
            oppbid1 = 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(0, 1);
        } else if (trick1 == 1 && b == 0){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }           
    } else if (trickdiff <= 3 && trickavg <= 5 && 70 < a <=90){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 2;
            compcards.splice(0, 2);
        } else {
            oppbid1 = trick1;
            oppbid2 = 1;            
            compcards.splice([trick1 - 1], 1);
            compcards.splice(0, 1);
        }        
    } else if (trickdiff <= 3 && trickavg <= 5 && 90 < a) {
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = trick2 + b + c;
            compcards.splice([trick2 + b + c - 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = 2;
            oppbid2 = 1;
            compcards.splice(0, 2);
        }
    } else if (4 <= trickdiff && trickavg <= 5 && a <= 70) {
        if (trick1 == 1 && trick2 < 9){
            oppbid1 = 1;
            oppbid2 = trick2 + b + c;
            compcards.splice([trick2 + b + c - 1], 1);
            compcards.splice(0, 1);
        } else if (trick1 == 1 && trick2 == 9){
            oppbid1 = 1
            oppbid2 = 10
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (4 <= trickdiff && trickavg <= 5 && 70 < a <= 90){
        if (trick1 == 1){
            oppbid1 = 2;
            oppbid2 = 1;
            compcards.splice(0, 2);
        } else {
            oppbid1 = trick1;
            oppbid2 = 1;
            compcards.splice([trick1 - 1], 1);
            compcards.splice(0, 1);
        }
    } else if (4 <= trickdiff && trickavg <= 5 && 90 < a){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 2 + b + c;
            compcards.splice([b + c + 1], 1);
            compcards.splice(0, 1);
        } else {
            oppbid1 = trick1 - b;
            oppbid2 = trick2 + 2;
            compcards.splice([trick2 + 1], 1);
            compcards.splice([trick1 - b - 1], 1);
        }
    } else if (trickdiff <= 3 && 5 < trickavg && a <= 50){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = trick1 + b;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 + b - 1], 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = 9;
            oppbid2 = 10;
            compcards.splice(8, 2);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (trickdiff <= 3 && 5 < trickavg && 50 < a <= 75){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = b + c + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([b + c], 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = 10;
            oppbid2 = b + c + 1;
            compcards.splice(9, 1);
            compcards.splice(b + c, 1);
        } else {
            oppbid1 = trick1 + b + c;
            oppbid2 = d + 1;
            compcards.splice([trick1 + b + c - 1], 1);
            compcards.splice(d, 1);
        }
    } else if (trickdiff <= 3 && 5 < trickavg && 75 < a){
        if (trick1 != 9 && trick2 == 10){
            oppbid1 = 9;
            oppbid2 = 1;
            compcards.splice(8, 1);
            compcards.splice(0, 1);
        } else if (trick1 == 9 && trick2 == 10){
            oppbid1 = b + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(b, 1);
        } else {
            oppbid1 = trick1 + b - c;
            oppbid2 = trick2 + d;
            compcards.splice([trick2 + d - 1], 1);
            compcards.splice([trick1 + b - c - 1], 1);
        }
    } else if (4 <= trickdiff && 5 < trickavg && a <= 50){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else if (trick2 == 10 && trickdiff > 6){
            oppbid1 = b + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(b, 1);
        } else if (trick2 == 10){
            oppbid1 = trick1 + b - c;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 + b - c - 1], 1);
        } else {
            oppbid1 = b + 1;
            oppbid2 = trick2 + c;
            compcards.splice([trick2 + c - 1], 1);
            compcards.splice(b, 1);
        }
    } else if (4 <= trickdiff && 5 < trickavg && 50 < a <= 75){
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else if (trick2 == 10 && trickdiff > 6 && c == 1){
            oppbid2 = 1;
            oppbid1 = trick1 + 1;
            compcards.splice(trick1, 1);
            compcards.shift();
        } else if (trick2 == 10 && trickdiff > 6){
            oppbid1 = trick1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 - 1], 1);
        } else if (trick2 == 10){
            oppbid1 = b + c + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([b + c], 1);
        } else {
            oppbid1 = trick1 + b - c;
            oppbid2 = trick2 + d;
            compcards.splice([trick2 + d - 1], 1);
            compcards.splice([trick1 + b - c - 1], 1);
        } 
    } else {
        if (trick1 == 1){
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        } else if (trick2 == 10 && trickdiff > 6){
            oppbid1 = trick1 + 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(trick1, 1);
        } else if (trick2 == 10){
            oppbid1 = trick1 + b;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice([trick1 + b - 1], 1);
        } else {
            oppbid1 = 1;
            oppbid2 = 10;
            compcards.splice(9, 1);
            compcards.splice(0, 1);
        }
    }    
}

function stratRoundTwo(){
    if (trickdiff <=3 && trickavg <= 5 && a <= 70){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            oppbid2 = compcards.shift();
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2 + 1) != -1){                
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if (trickdiff <=3 && trickavg <= 5 && 70 < a){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            if (compcards[1] <= trick2 + 1){
                oppbid2 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2) != -1){                
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);                    
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if (4 <= trickdiff && trickavg <= 5 && a <= 70){
        if (7 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else {
            oppbid1 = compcards.shift();
            if (7 < trick2 && yourhigh < comphigh){
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){//compavg and/or youravg not defined properly??//
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if (4 <= trickdiff && trickavg <= 5 && 70 < a){
        oppbid1 = compcards.shift();
        if (7 < trick2 && comphigh < yourhigh){            
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else {            
            if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if (trickdiff <= 3 && 5 < trickavg && a <= 65){
        if (8 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            if (compcards.indexOf(trick1 + 1) != -1){
                oppbid1 = trick1 + 1;
                compcards.splice(compcards.indexOf(trick1 + 1), 1);                
            } else if (compcards.indexOf(trick1) != -1 && compcards[compcards.length- 2] >= yourcards[yourcards.length - 3]){
                oppbid1 = trick1;
                compcards.splice(compcards.indexOf(trick1), 1);
            } else {
                oppbid1 = compcards[b + c];
                compcards.splice(b + c, 1);
            }
        } else if (8 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] >= yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards.pop();
        } else if (8 < trick2){
            oppbid1 = compcards.pop();
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else if (7 < trick2 && yourhigh <= comphigh){
            oppbid2 = compcards.pop();
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (compcards.indexOf(trick2 + 1 + b) != -1){
            oppbid2 = trick2 + 1 + b;
            compcards.splice(compcards.indexOf(trick2 + 1 + b), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if (trickdiff <= 3 && 5 < trickavg && 65 < a){
        if (8 < trick2 && comphigh < yourhigh){  
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 3] && b == 0){
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else {
                oppbid1 = compcards[c];
                compcards.splice(c, 1);
            }      
        } else if (8 < trick2 && yourhigh < comphigh){
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
                oppbid2 = compcards.pop();
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = compcards[1 + b + c];
                compcards.splice(1 + b + c, 1);
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] > yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[1 + b + c];
            compcards.splice(1 + b + c, 1);
        } else if (8 < trick2){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (7 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards[1 + b];
            compcards.splice(1 + b, 1);
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (7 < trick2 && yourhigh >= comphigh){
            oppbid2 = compcards.shift();
            if (compcards[compcards.length - 3] <= yourcards[yourcards.length - 3]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards[1 + b];
                compcards.splice(1 + b, 1);
            }
        } else if (compavg <= youravg){
            oppbid2 = compcards.shift();
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick2 + 1) != -1){
            oppbid2 = trick2 + 1
            compcards.splice(compcards.indexOf(trick2 + 1), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if (4 <= trickdiff && 5 < trickavg && a <= 70){
        if (comphigh >= yourhigh){
            oppbid2 = compcards.pop();
                if  (trick1 >= 4 && compcards.indexOf(trick1 + b) != -1){
                    oppbid1 = trick1 + b;
                    compcards.splice(compcards.indexOf(trick1 + b), 1);      
                } else {
                    oppbid1 = compcards.shift();
                }           
        } else if (trick1 > 4 && compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else {
        if (comphigh >= yourhigh){
            if  (trick1 >= 4){
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
            } else {
                oppbid1 = compcards.shift();
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            }           
        } else if (comphigh < yourhigh){
            oppbid2 = compcards.pop();
            if (trick1 >= 3 && compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (trick1 >= 3 && compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards.shift();
            }
        }
    }
}

function stratRoundThree(){
    if (trickdiff <=3 && trickavg <= 5 && a <= 70){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            oppbid2 = compcards.shift();
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2 + 1) != -1){                
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if (trickdiff <=3 && trickavg <= 5 && 70 < a){
        if (trick2 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick2 == 2) {
            oppbid1 = compcards.shift();    
            oppbid2 = compcards.shift();
        } else if (trick1 == 1 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();            
        } else if (trick1 == 1){
            oppbid1 = compcards.shift();
            if (compcards[1] <= trick2 + 1){
                oppbid2 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else if (trick1 == 2 && compcards[1] < yourcards[1]){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else if (trick1 == 2){
            oppbid1 = compcards.shift();
            if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else {
                oppbid2 = compcards.shift();
            }
        } else {
            if (compcards.indexOf(trick2) != -1){                
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
                if (c0 < trick1){
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);                    
                } else {
                    oppbid1 = compcards.shift();
                }
            } else {
                oppbid2 = compcards.shift();
                if (compcards.indexOf(b + trick1) != -1){
                    oppbid1 = b + trick1;
                    compcards.splice(compcards.indexOf(b + trick1), 1);                    
                } else if (compcards.indexOf(trick1) != -1){
                    oppbid1 = trick1;
                    compcards.splice(compcards.indexOf(trick1), 1);        
                } else {
                    oppbid1 = compcards.shift();
                }
            }
        }
    } else if (4 <= trickdiff && trickavg <= 5 && a <= 70){
        if (7 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        } else {
            oppbid1 = compcards.shift();
            if (7 < trick2 && yourhigh < comphigh){
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){//compavg and/or youravg not defined properly??//
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if (4 <= trickdiff && trickavg <= 5 && 70 < a){
        oppbid1 = compcards.shift();
        if (7 < trick2 && comphigh < yourhigh){            
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else {            
            if (7 < trick2){
                oppbid2 = compcards.pop();
            } else if (compavg > youravg && compcards.indexOf(trick2) != -1){
                oppbid2 = trick2;
                compcards.splice(compcards.indexOf(trick2), 1);
            } else if (compavg > youravg && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
            } else {
                if (compcards[b] <= trick2){
                    oppbid2 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid2 = compcards.shift();
                }
            }
        }
    } else if (trickdiff <= 3 && 5 < trickavg && a <= 65){
        if (8 < trick2 && comphigh < yourhigh){
            oppbid2 = compcards.shift();
            if (compcards.indexOf(trick1 + 1) != -1){
                oppbid1 = trick1 + 1;
                compcards.splice(compcards.indexOf(trick1 + 1), 1);                
            } else if (compcards.indexOf(trick1) != -1 && compcards[compcards.length- 2] >= yourcards[yourcards.length - 3]){
                oppbid1 = trick1;
                compcards.splice(compcards.indexOf(trick1), 1);
            } else {
                oppbid1 = compcards[b + c];
                compcards.splice(b + c, 1);
            }
        } else if (8 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] >= yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards.pop();
        } else if (8 < trick2){
            oppbid1 = compcards.pop();
            oppbid2 = compcards[b + c];
            compcards.splice(b + c, 1);
        } else if (7 < trick2 && yourhigh <= comphigh){
            oppbid2 = compcards.pop();
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (compcards.indexOf(trick2 + 1 + b) != -1){
            oppbid2 = trick2 + 1 + b;
            compcards.splice(compcards.indexOf(trick2 + 1 + b), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if (trickdiff <= 3 && 5 < trickavg && 65 < a){
        if (8 < trick2 && comphigh < yourhigh){  
            oppbid2 = compcards.pop();
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 3] && b == 0){
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            } else {
                oppbid1 = compcards[c];
                compcards.splice(c, 1);
            }      
        } else if (8 < trick2 && yourhigh < comphigh){
            if (compcards[compcards.length - 3] >= yourcards[yourcards.length - 2]){
                oppbid1 = compcards.pop();
                oppbid2 = compcards.pop();
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = compcards[1 + b + c];
                compcards.splice(1 + b + c, 1);
            }
        } else if (8 < trick2 && compcards[compcards.length - 3] > yourcards[yourcards.length - 3]){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[1 + b + c];
            compcards.splice(1 + b + c, 1);
        } else if (8 < trick2){
            oppbid2 = compcards.pop();
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (7 < trick2 && yourhigh < comphigh){
            oppbid2 = compcards[1 + b];
            compcards.splice(1 + b, 1);
            if (compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards[d];
                compcards.splice(d, 1);
            }
        } else if (7 < trick2 && yourhigh >= comphigh){
            oppbid2 = compcards.shift();
            if (compcards[compcards.length - 3] <= yourcards[yourcards.length - 3]){
                oppbid1 = compcards.pop();
            } else {
                oppbid1 = compcards[1 + b];
                compcards.splice(1 + b, 1);
            }
        } else if (compavg <= youravg){
            oppbid2 = compcards.shift();
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick2 + 1) != -1){
            oppbid2 = trick2 + 1
            compcards.splice(compcards.indexOf(trick2 + 1), 1);
            if (compcards[1] <= trick1){
                oppbid1 = compcards[1];
                compcards.splice(1, 1);
            } else {
                oppbid1 = compcards.shift();
            }
        } else if (compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards[c];
            compcards.splice(c, 1);
        } else if (compcards.indexOf(trick2) != -1){
            oppbid2 = trick2;
            compcards.splice(compcards.indexOf(trick2), 1);
            oppbid1 = compcards[b];
            compcards.splice(b, 1);
        } else if (compcards.indexOf(trick2 + 2) != -1){
            oppbid2 = trick2 + 2;
            compcards.splice(compcards.indexOf(trick2 + 2), 1);
            oppbid1 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else if (4 <= trickdiff && 5 < trickavg && a <= 70){
        if (comphigh >= yourhigh){
            oppbid2 = compcards.pop();
                if  (trick1 >= 4 && compcards.indexOf(trick1 + b) != -1){
                    oppbid1 = trick1 + b;
                    compcards.splice(compcards.indexOf(trick1 + b), 1);      
                } else {
                    oppbid1 = compcards.shift();
                }           
        } else if (trick1 > 4 && compcards.indexOf(trick1 + b) != -1){
            oppbid1 = trick1 + b;
            compcards.splice(compcards.indexOf(trick1 + b), 1);
            oppbid2 = compcards.shift();
        } else {
            oppbid2 = compcards.shift();
            oppbid1 = compcards.shift();
        }
    } else {
        if (comphigh >= yourhigh){
            if  (trick1 >= 4){
                oppbid1 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);      
            } else {
                oppbid1 = compcards.shift();
                oppbid2 = compcards[compcards.length - 3];
                compcards.splice(compcards.length - 3, 1);
            }           
        } else if (comphigh < yourhigh){
            oppbid2 = compcards.pop();
            if (trick1 >= 3 && compcards.indexOf(trick1 + b) != -1){
                oppbid1 = trick1 + b;
                compcards.splice(compcards.indexOf(trick1 + b), 1);
            } else if (trick1 >= 3 && compcards.indexOf(trick1 - c) != -1){
                oppbid1 = trick1 - c;
                compcards.splice(compcards.indexOf(trick1 - c), 1);
            } else {
                oppbid1 = compcards.shift();
            }
        }
    }
}

function stratRoundFour(){
    if (a <= 70){
        if (yourhigh < comphigh){
            if (trick2 > 6){
                oppbid2 = compcards.pop();
                if (trick1 > 5 && compcards[2] >= yourcards[3]){
                    oppbid1 = compcards.pop();
                } else if (2 < trick1 <=5 && compcards[1] <= trick1) {
                    oppbid1 = compcards[b];
                    compcards.splice(b, 1);
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[2] >= trick2){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else if (yourhigh > comphigh){
            if (trick2 > 6){
                if (compcards[2] >= trick2){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    if (compcards[1] <= trick1){
                        oppbid1 = compcards[1];
                        compcards.splice(1, 1);
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else {
                    oppbid2 = compcards.shift();
                    if (compcards[2] >= yourcards[2] && trick1 > 5){
                        oppbid1 = compcards[2];
                        compcards.splice(2, 1);
                    } else {
                        oppbid1 = compcards.shift();
                    }
                }
            } else if (compcards[2] >= trick2){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else {
            if (trick2 > 7){
                oppbid2 = compcards.pop();
                if (trick1 < 5){
                    oppbid1 = compcards.shift();
                } else if (compcards[2] >= yourcards[2]){
                    oppbid1 = compcards.pop();
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (4 < trick2 <= 7){
                if (compcards[2] >= trick2){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    oppbid1 = compcards.shift();
                } else if (compcards[1] >= yourcards[1]){
                    oppbid1 = compcards.shift();
                    oppbid2 = compcards.shift();
                } else {
                    oppbid2 = compcards.shift();
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        }
    } else {
        if (yourhigh < comphigh){
            if (trick2 > 6){
                if (compcards[1] > yourcards[0]){
                    oppbid2 = compcards[1];
                    compcards.splice(1, 1);
                    if (trick1 > 4){
                        oppbid1 = compcards.pop();
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else if (compcards[2] > yourcards[0]){
                    oppbid2 = compcards[2];
                    compcards.splice(2, 1);
                    if (trick1 > 4){
                        oppbid1 = compcards.pop();
                    } else {
                        oppbid1 = compcards.shift();
                    }
                } else {
                    oppbid2 = compcards.pop();
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[2] >= yourcards[3]){
                oppbid2 = compcards[2];
                compcards.splice(2, 1);
                oppbid1 = compcards.shift();
            } else if (compcards[2] >= yourcards[2]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else if (yourhigh > comphigh){
            if (trick2 > 6){
                oppbid2 = compcards.shift();
                if (compcards[1] >= yourcards[2]){
                    oppbid1 = compcards[1];
                    compcards.splice(1, 1);
                } else if (trick1 > 5){
                    oppbid1 = compcards.pop();
                } else {
                    oppbid1 = compcards.shift();
                }
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        } else {
            if (trick2 > 6 && trickdiff <= 3){
                oppbid2 = compcards.shift();
                if (compcards[1] > yourcards[2]){
                    oppbid1 = compcards[1];
                    compcards.splice(1, 1);
                } else {
                    oppbid1 = compcards.pop();
                }
            } else if (trick2 > 6){
                oppbid2 = compcards.pop();
                oppbid1 = compcards.shift();
            } else if (trick2 > 3 && compcards.indexOf(trick2 + 1) != -1){
                oppbid2 = trick2 + 1;
                compcards.splice(compcards.indexOf(trick2 + 1), 1);
                oppbid1 = compcards.shift();
            } else if (trick2 > 3 && compcards.indexOf(trick2 + 2) != -1){
                oppbid2 = trick2 + 2;
                compcards.splice(compcards.indexOf(trick2 + 2), 1);
                oppbid1 = compcards.shift();
            } else if (compcards[1] >= yourcards[1]){
                oppbid1 = compcards.shift();
                oppbid2 = compcards.shift();
            } else {
                oppbid2 = compcards.shift();
                oppbid1 = compcards.shift();
            }
        }
    }
}

function stratRoundFive(){
    if (scorediff == 0){
        oppbid2 = compcards.pop();
        oppbid1 = c0;
    } else if (scorediff > 0){
        if (comphigh < yourhigh && c0 < yourcards[0] && comphigh > yourcards[0]){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh == yourhigh && c0 < yourcards[0] && trick1 > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh < yourhigh && c0 == yourcards[0] && [trick2 - trick1] < scorediff && trick1 <= scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh < yourhigh && c0 == yourcards[0] && [trick2 - trick1] < scorediff && trick1 > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else {
            oppbid2 = compcards.pop();
            oppbid1 = c0;
        } 
    } else {
        if (comphigh > yourhigh && c0 != yourcards[0] && yourhigh >= c0 && [trick1 - trick2] > scorediff){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh == yourhigh && c0 > yourcards[0] && trick1 >= Math.abs(scorediff)){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else if (comphigh > yourhigh && c0 == yourcards[0] && trickdiff < Math.abs(scorediff)){
            if (b == 0){
                oppbid2 = compcards.pop();
                oppbid1 = c0;
            } else {
                oppbid1 = compcards.pop();
                oppbid2 = c0;
            }
        } else {
            oppbid2 = compcards.pop();
            oppbid1 = c0;
        }
    }
}

//this is the function that will set the rng parameters for stratInProgress//
function gameState(){
    cardSpreadBottom();
}

//this function compares the bottom three cards for each pair and returns an indicator variable to use//
function cardSpreadBottom(){
    for (i = 0; i < 3; i++){// the idea here is to alter lowspread is such a way that it is unique based on the combo of lower cards //
        if (compcards[i] == yourcards[i]){
            return;
        } else if (compcards[i] > yourcards[i]){
            return;
        } else {
            return;
        }
    }
}

function gameStateRouter(){
    if (roundmod == 5){
        stratRoundOne();
    } else if (roundmod == 4){
        stratRoundTwo();
    } else if (roundmod == 3){
        stratRoundThree();
    } else if (roundmod == 2){
        stratRoundFour();
    } else {
        stratRoundFive();
    }
}