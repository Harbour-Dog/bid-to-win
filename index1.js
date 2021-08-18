let oppbid1, oppbid2;
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
let obj, user, key;
let gp, wins, losses, ties, abs, winper;

//variable specific to not yet implemented Gauntlet Mode//
let mod, adj;

//start of login/create user functions//
function logBox() {
    document.getElementById("newuser").style.display = "none";
    document.getElementById("login").disabled = true;
    document.getElementById("playcomp").disabled = true;
    document.getElementById("play2p").disabled = true;
    document.getElementById("leaderdiv").style.display = "none";     
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("leaderkey").style.display = "none";
    document.getElementById("viewlead").disabled = true;     
    document.getElementById("logindiv").style.display = 'inline-block';
}

function createUser(){
    document.getElementById("newuser").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("playcomp").disabled = true
    document.getElementById("play2p").disabled = true
    document.getElementById("leaderdiv").style.display = "none";     
    document.getElementById("leaderboard").style.display = "none"; 
    document.getElementById("leaderkey").style.display = "none";
    document.getElementById("viewlead").disabled = true;     
    document.getElementById("logindiv").style.display = 'inline-block';

    document.getElementById("logbtn").onclick = newUser;
}

function signIn(){//fetch with GET requests cannot have a body//
    user = document.getElementById("Username").value;
    key = document.getElementById("Password").value;
    document.getElementById("playcomp").disabled= false;
    document.getElementById("play2p").disabled= false;
    document.getElementById("viewlead").disabled= false;

    const baseURL = `http://localhost:3000/user/1.0.0/:Username/:Password?Username=${user}&Password=${key}`;
    fetch(baseURL)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                alert("Username and Password do not match.");
                user = null;
            } else {};
            obj = data[0];
            document.getElementById("p1").innerHTML = user;
            gp = obj.GP;
            wins = obj.Wins;
            losses = obj.Losses;
            ties = obj.Ties;
            abs = obj.Abandons;
            winper = obj.WinPerc;
            document.getElementById("userstats").style.display = "inline";
            document.getElementById("logindiv").style.display = "none";
            document.getElementById("login").disabled = false;
            document.getElementById("login").innerHTML = "Sign Out";
            document.getElementById("login").onclick = signOut;
        });
}

function newUser(){
    user = document.getElementById("Username").value;
    key = document.getElementById("Password").value;

    if(user.length > 3 && user.length < 17 && key.length > 3 && key.length < 17){
        const baseURL = 'http://localhost:3000/user/create/1.0.0';
        fetch(baseURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: user,
                Password: key
            })
        });
        nowLogin();
    } else {
        alert("Username and Password much each be between 4 and 16 characters");
    }
}

function nowLogin(){
    document.getElementById("logindiv").style.display = "none";
    document.getElementById("userstats").style.display = "inline";
    document.getElementById("login").style.display = "inline";
    document.getElementById("login").innerHTML = "Sign Out";
    document.getElementById("login").onclick = signOut;
    document.getElementById("playcomp").disabled = false;
    document.getElementById("play2p").disabled = false;
    document.getElementById("viewlead").disabled = false;
    document.getElementById("p1").innerHTML = user;
    gp = 0;
    wins = 0;
    losses = 0;
    ties = 0;
    abs = 0;
    winper = 0;
    rule++
    document.getElementById("rulespar").innerHTML = ("Welcome to Bid-to-Win, <span style='color: blue'>"+user+"</span>!" + "<br><br>" +
        "You stats will all be saved, and you can view and retrieve them at anytime." + "<br>" +
        " Your current ranking in the database for games played, wins, and win% is also displayed." + "<br><br>" +
        " I hope you enjoy the game!")
    document.getElementById("rulespar").style.backgroundColor = "lightgray";
    document.getElementById("rulebtn").style.backgroundColor = "black";
    document.getElementById("rulebtn").style.color = "white";
}

function signOut(){
    location.reload();
}
//end of login/create user functions//
function userStats(){
    document.getElementById("leaderdiv").style.display = "none";     
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("leaderkey").style.display = "none";
    document.getElementById("userstats").innerHTML = "Refresh Stats";
    document.getElementById("rulespar").innerHTML = "";
    document.getElementById("userhead").innerHTML = user;
    document.getElementById("gpdisp").innerHTML = gp;
    document.getElementById("winsdisp").innerHTML = wins;
    document.getElementById("lossesdisp").innerHTML = losses;
    document.getElementById("tiesdisp").innerHTML = ties;
    document.getElementById("abandonsdisp").innerHTML = abs;
    document.getElementById("winperdisp").innerHTML = winper+'%';

    baseURL2 = `http://localhost:3000/user_stats/gprank/1.0.0/:Username?Username=${user}`
    fetch(baseURL2)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                alert("Unable to retrieve stats for current user.")
            } else {};            
            obj = data[0];
            let rem = obj.row_num % 10;
            if(obj.row_num > 10 && obj.row_num < 14){// this doesn't currently deal the teens in the hundreds correctly//
                document.getElementById("gprank").innerHTML = obj.row_num+'th';
            } else if (rem == 1){
                document.getElementById("gprank").innerHTML = obj.row_num+'st';
            } else if (rem == 2){
                document.getElementById("gprank").innerHTML = obj.row_num+'nd';
            } else if (rem == 3){
                document.getElementById("gprank").innerHTML = obj.row_num+'rd';
            } else {
                document.getElementById("gprank").innerHTML = obj.row_num+'th';
            }            
    });

    baseURL3 = `http://localhost:3000/user_stats/winsrank/1.0.0/:Username?Username=${user}`
    fetch(baseURL3)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                alert("Unable to retrieve stats for current user.")
            } else {};            
            obj = data[0];
            let rem = obj.row_num % 10;
            if(obj.row_num > 10 && obj.row_num < 14){
                document.getElementById("winsrank").innerHTML = obj.row_num+'th';
            } else if (rem == 1){
                document.getElementById("winsrank").innerHTML = obj.row_num+'st';
            } else if (rem == 2){
                document.getElementById("winsrank").innerHTML = obj.row_num+'nd';
            } else if (rem == 3){
                document.getElementById("winsrank").innerHTML = obj.row_num+'rd';
            } else {
                document.getElementById("winsrank").innerHTML = obj.row_num+'th';
            }
    });

    baseURL4 = `http://localhost:3000/user_stats/winperrank/1.0.0/:Username?Username=${user}`
    fetch(baseURL4)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                alert("Unable to retrieve stats for current user.")
            } else {};            
            obj = data[0];
            let rem = obj.row_num % 10;
            if(obj.row_num > 10 && obj.row_num < 14){
                document.getElementById("winperrank").innerHTML = obj.row_num+'th';
            } else if (rem == 1){
                document.getElementById("winperrank").innerHTML = obj.row_num+'st';
            } else if (rem == 2){
                document.getElementById("winperrank").innerHTML = obj.row_num+'nd';
            } else if (rem == 3){
                document.getElementById("winperrank").innerHTML = obj.row_num+'rd';
            } else {
                document.getElementById("winperrank").innerHTML = obj.row_num+'th';
            }
    });

    document.getElementById("statdisplay").style.display = "inline-flex";
    document.getElementById("stattable").style.display = "";
}

function leaderboard(){
    document.getElementById("stattable").style.display = "none";
    document.getElementById("statdisplay").style.display = "none";
    document.getElementById("rulespar").innerHTML = "";
    document.getElementById("rulespar").style.backgroundColor = "transparent";
    document.getElementById("rulebtn").style.backgroundColor = "white";
    document.getElementById("rulebtn").style.color = "black";
    document.getElementById("userstats").innerHTML = "User Stats";

    const baseURL = 'http://localhost:3000/leaderboard/1.0.0';
    fetch(baseURL)
        .then(response => response.json())
        .then(data => {
            for (i = 0; i < data.length; i++){
                obj = data[i];
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
            document.getElementById("leaderboard").style.display = "";
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
        document.getElementById("rulespar").innerHTML = "";
        document.getElementById("rulespar").style.backgroundColor = "transparent";
        document.getElementById("rulebtn").style.backgroundColor = "white";
        document.getElementById("rulebtn").style.color = "black";
    }
}

function playComp(){
    cpu = 1;
    document.getElementById("playcomp").disabled = true;
    document.getElementById("play2p").disabled = true;
    document.getElementById("newround").disabled = false;
    document.getElementById("player2").src = "images/comp_player.png";
    document.getElementById("p2").innerHTML = "COMPUTER";
    compcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yourcards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

function play2p(){
    document.getElementById("playcomp").disabled = true;
    document.getElementById("play2p").disabled = true;
    document.getElementById("newround").disabled = false;
    alert("User data currently does not get recorded for two-player games.")
}

function undo(){
    if (cpu == 0 && loop == 1 && count % 2 != 0){
        document.getElementById("oppbid1").innerHTML = "3";
        line3.disabled = false;
        oppadj.pop();
        loop = 0;
    } else if (cpu == 0 && loop == 2 && count % 2 != 0){
        document.getElementById("oppbid1").innerHTML = "";
        document.getElementById("oppbid2").innerHTML = "";
        oppadj.pop();
        oppadj.pop();
        loop = 0;
        document.getElementById("commit").disabled = true;

        for (i = 0; i < cbuttons.length; i++){
            cbuttons[i].disabled = false;
        }
    
        for (i = 0; i < oppadj.length; i++){
            oppadj[i].disabled = true;
        }
    } else if (loop == 1){
        document.getElementById("yourbid1").innerHTML = "";
        line1.disabled = false;
        youradj.pop();
        loop = 0;
    } else {
        document.getElementById("yourbid1").innerHTML = "";
        document.getElementById("yourbid2").innerHTML = "";
        youradj.pop();
        youradj.pop();
        loop = 0;
        document.getElementById("commit").disabled = true;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = false;
        }
    
        for (i = 0; i < youradj.length; i++){
            youradj[i].disabled = true;
        }
    }    
}

function trickGen(){
    let a = Math.floor((Math.random() * 10) + 1);
    let b = Math.floor((Math.random() * 10) + 1);

    if (a != b && a > b){
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

    if (cpu == 0){
        document.getElementById("oppbid1").innerHTML = "";
        document.getElementById("oppbid2").innerHTML = "";
    } else {
        document.getElementById("oppbid1").innerHTML = "?";
        document.getElementById("oppbid2").innerHTML = "?";
    }
    
    document.getElementById("trick1").style.backgroundColor = "white";
    document.getElementById("trick2").style.backgroundColor = "white";
    document.getElementById("trick1").style.color = "black";
    document.getElementById("trick2").style.color = "black";
    document.getElementById("yourbid1").innerHTML = "";
    document.getElementById("yourbid2").innerHTML = "";
    document.getElementById("trick1").innerHTML = trick1;    
    document.getElementById("trick2").innerHTML = trick2;    

    document.getElementById("newround").disabled = true;
    
    for (i = 0; i < buttons.length; i++){
        buttons[i].disabled = false;
    }

    for (i = 0; i < youradj.length; i++){
        youradj[i].disabled = true;
    }

    if(cpu == 1 && youradj.length == 0 && user != null){
        gp++
        abs++
        const baseURL = 'http://localhost:3000/user/game_started/1.0.0';
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
    } else {}

    compStrat();
}

function Commit(){
    loop = 0;
    scorerev = 0;
    yourcards.splice(yourcards.indexOf(yourbid1), 1);
    yourcards.splice(yourcards.indexOf(yourbid2), 1);
    document.getElementById("undo").disabled = true;

    if (cpu == 0) {
        count++;        
        if (count % 2 != 0){
            document.getElementById("yourbid1").innerHTML = "?";      
            document.getElementById("yourbid2").innerHTML = "?";
            document.getElementById("commit").disabled = true;
            for (i = 0; i < cbuttons.length; i++){
                cbuttons[i].disabled = false;
            }        
            for (i = 0; i < oppadj.length; i++){
                oppadj[i].disabled = true;
            }      
        } else {
            document.getElementById("commit").disabled = true;
            line3.style.textDecoration = "line-through";
            line4.style.textDecoration = "line-through";
        }
    } else {
        document.getElementById("commit").disabled = true;    
    }

    if (cpu == 0 && count % 2 != 0){
        let e = 0;
    } else {
        setTimeout(scoreReveal, 800);
    }
}

function scoreReveal(){
    scorerev++

    if (cpu == 0 && scorerev == 1){
        document.getElementById("yourbid1").innerHTML = yourbid1;
        line1.style.textDecoration = "line-through";
    } else if (cpu == 1 && scorerev == 1){
        document.getElementById("oppbid1").innerHTML = oppbid1;
        line1.style.backgroundColor = "black";
        document.getElementById("opp"+oppbid1).style.backgroundColor = "black";
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
        line2.style.textDecoration = "line-through";
    } else if (cpu == 1 && scorerev == 3){
        document.getElementById("oppbid2").innerHTML = oppbid2;
        line2.style.backgroundColor = "black";
        document.getElementById("opp"+oppbid2).style.backgroundColor = "black";
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

    if (scorerev >= 4 && youradj.length != 10){    
        document.getElementById("newround").disabled = false;
    } else if (scorerev >= 4 && youradj.length == 10){
        if(cpu == 1 && youradj.length == 10 && yourscore > oppscore && user != null){
            wins++
            abs--
            winper = Math.round(((wins)*100)/(wins + losses));
            const baseURL = 'http://localhost:3000/user/win/1.0.0';
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
        } else if(cpu == 1 && youradj.length == 10 && yourscore < oppscore && user != null){
            losses++
            abs--
            winper = Math.round((wins * 100)/(wins + losses));
            const baseURL = 'http://localhost:3000/user/loss/1.0.0';
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
        } else if (cpu == 1 && youradj.length == 10 && yourscore == oppscore && user != null){
            ties++
            abs--
            if(wins + losses != 0){
                winper = ((wins * 100)/(wins + losses));
            } else {
                winper = 0;
            }
            const baseURL = 'http://localhost:3000/user/tie/1.0.0';
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
        } else {};
        document.getElementById("newgame").disabled = false;
    } else {
        setTimeout(scoreReveal, 800);
    };
}

function newGame(){
    if (yourscore > oppscore){
        yourmatch = yourmatch + 1;
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
    document.getElementById("oppbid1").innerHTML = "";
    document.getElementById("oppbid2").innerHTML = "";
    document.getElementById("yourbid1").innerHTML = "";
    document.getElementById("yourbid2").innerHTML = "";
    document.getElementById("trick1").style.backgroundColor = "white";
    document.getElementById("trick2").style.backgroundColor = "white";
    document.getElementById("trick1").style.color = "black";
    document.getElementById("trick2").style.color = "black";
    document.getElementById("trick1").innerHTML = "";    
    document.getElementById("trick2").innerHTML = "";
    document.getElementById("newround").disabled = false;  
    document.getElementById("newgame").disabled = true;  

    for (i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundColor = "rgb(140, 140, 255)";
        cbuttons[i].style.backgroundColor = "rgb(255, 140, 140)";
    }
}

// the beginning of the player button functions //
function Card1(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "1";
        yourbid1 = 1;
        line1 = document.getElementById("card1");
        document.getElementById("card1").disabled = true;
        youradj.push(document.getElementById("card1"));
    } else {
        document.getElementById("yourbid2").innerHTML = "1";
        yourbid2 = 1;
        line2 = document.getElementById("card1");
        youradj.push(document.getElementById("card1"));
        document.getElementById("commit").disabled = false;      

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card2(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "2";
        yourbid1 = 2;
        document.getElementById("card2").disabled = true;
        line1 = document.getElementById("card2");
        youradj.push(document.getElementById("card2"));
    } else {
        document.getElementById("yourbid2").innerHTML = "2";
        yourbid2 = 2;
        line2 = document.getElementById("card2");
        youradj.push(document.getElementById("card2"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card3(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "3";
        yourbid1 = 3;
        document.getElementById("card3").disabled = true;
        line1 = document.getElementById("card3");
        youradj.push(document.getElementById("card3"));
    } else {
        document.getElementById("yourbid2").innerHTML = "3";
        yourbid2 = 3;
        line2 = document.getElementById("card3");
        youradj.push(document.getElementById("card3"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card4(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "4";
        yourbid1 = 4;
        document.getElementById("card4").disabled = true;
        line1 = document.getElementById("card4");
        youradj.push(document.getElementById("card4"));
    } else {
        document.getElementById("yourbid2").innerHTML = "4";
        yourbid2 = 4;
        line2 = document.getElementById("card4");
        youradj.push(document.getElementById("card4"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card5(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "5";
        yourbid1 = 5;
        document.getElementById("card5").disabled = true;
        line1 = document.getElementById("card5");
        youradj.push(document.getElementById("card5"));
    } else {
        document.getElementById("yourbid2").innerHTML = "5";
        yourbid2 = 5;
        line2 = document.getElementById("card5");
        youradj.push(document.getElementById("card5"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card6(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "6";
        yourbid1 = 6;
        document.getElementById("card6").disabled = true;
        line1 = document.getElementById("card6");
        youradj.push(document.getElementById("card6"));
    } else {
        document.getElementById("yourbid2").innerHTML = "6";
        yourbid2 = 6;
        line2 = document.getElementById("card6");
        youradj.push(document.getElementById("card6"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card7(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "7";
        yourbid1 = 7;
        document.getElementById("card7").disabled = true;
        line1 = document.getElementById("card7");
        youradj.push(document.getElementById("card7"));
    } else {
        document.getElementById("yourbid2").innerHTML = "7";
        yourbid2 = 7;
        line2 = document.getElementById("card7");
        youradj.push(document.getElementById("card7"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card8(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "8";
        yourbid1 = 8;
        document.getElementById("card8").disabled = true;
        line1 = document.getElementById("card8");
        youradj.push(document.getElementById("card8"));
    } else {
        document.getElementById("yourbid2").innerHTML = "8";
        yourbid2 = 8;
        line2 = document.getElementById("card8");
        youradj.push(document.getElementById("card8"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card9(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "9";
        yourbid1 = 9;
        document.getElementById("card9").disabled = true;
        line1 = document.getElementById("card9");
        youradj.push(document.getElementById("card9"));
    } else {
        document.getElementById("yourbid2").innerHTML = "9";
        yourbid2 = 9;
        line2 = document.getElementById("card9");
        youradj.push(document.getElementById("card9"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Card10(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("yourbid1").innerHTML = "10";
        yourbid1 = 10;
        document.getElementById("card10").disabled = true;
        line1 = document.getElementById("card10");
        youradj.push(document.getElementById("card10"));
    } else {
        document.getElementById("yourbid2").innerHTML = "10";
        yourbid2 = 10;
        line2 = document.getElementById("card10");
        youradj.push(document.getElementById("card10"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    }
}
function Opp1(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "1";
        oppbid1 = 1;
        document.getElementById("opp1").disabled = true;
        line3 = document.getElementById("opp1");
        oppadj.push(document.getElementById("opp1"));
    } else {
        document.getElementById("oppbid2").innerHTML = "1";
        oppbid2 = 1;
        line4 = document.getElementById("opp1");
        oppadj.push(document.getElementById("opp1"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp2(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "2";
        oppbid1 = 2;
        document.getElementById("opp2").disabled = true;
        line3 = document.getElementById("opp2");
        oppadj.push(document.getElementById("opp2"));
    } else {
        document.getElementById("oppbid2").innerHTML = "2";
        oppbid2 = 2;
        line4 = document.getElementById("opp2"); 
        oppadj.push(document.getElementById("opp2"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp3(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "3";
        oppbid1 = 3;
        document.getElementById("opp3").disabled = true;
        line3 = document.getElementById("opp3");
        oppadj.push(document.getElementById("opp3"));
    } else {
        document.getElementById("oppbid2").innerHTML = "3";
        oppbid2 = 3;
        line4 = document.getElementById("opp3");
        oppadj.push(document.getElementById("opp3"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp4(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "4";
        oppbid1 = 4;
        document.getElementById("opp4").disabled = true;
        line3 = document.getElementById("opp4");
        oppadj.push(document.getElementById("opp4"));
    } else {
        document.getElementById("oppbid2").innerHTML = "4";
        oppbid2 = 4;
        line4 = document.getElementById("opp4");
        oppadj.push(document.getElementById("opp4"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp5(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "5";
        oppbid1 = 5;
        document.getElementById("opp5").disabled = true;
        line3 = document.getElementById("opp5");
        oppadj.push(document.getElementById("opp5"));
    } else {
        document.getElementById("oppbid2").innerHTML = "5";
        oppbid2 = 5;
        line4 = document.getElementById("opp5");
        oppadj.push(document.getElementById("opp5"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp6(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "6";
        oppbid1 = 6;
        document.getElementById("opp6").disabled = true;
        line3 = document.getElementById("opp6");
        oppadj.push(document.getElementById("opp6"));
    } else {
        document.getElementById("oppbid2").innerHTML = "6";
        oppbid2 = 6;
        line4 = document.getElementById("opp6");
        oppadj.push(document.getElementById("opp6"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp7(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "7";
        oppbid1 = 7;
        document.getElementById("opp7").disabled = true;
        line3 = document.getElementById("opp7");
        oppadj.push(document.getElementById("opp7"));
    } else {
        document.getElementById("oppbid2").innerHTML = "7";
        oppbid2 = 7;
        line4 = document.getElementById("opp7");
        oppadj.push(document.getElementById("opp7"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp8(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "8";
        oppbid1 = 8;
        document.getElementById("opp8").disabled = true;
        line3 = document.getElementById("opp8");
        oppadj.push(document.getElementById("opp8"));
    } else {
        document.getElementById("oppbid2").innerHTML = "8";
        oppbid2 = 8;
        line4 = document.getElementById("opp8");
        oppadj.push(document.getElementById("opp8"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp9(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "9";
        oppbid1 = 9;
        document.getElementById("opp9").disabled = true;
        line3 = document.getElementById("opp9");
        oppadj.push(document.getElementById("opp9"));
    } else {
        document.getElementById("oppbid2").innerHTML = "9";
        oppbid2 = 9;
        line4 = document.getElementById("opp9");
        oppadj.push(document.getElementById("opp9"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}
function Opp10(){
    loop++;
    document.getElementById("undo").disabled = false;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = "10";
        oppbid1 = 10;
        document.getElementById("opp10").disabled = true;
        line3 = document.getElementById("opp10");
        oppadj.push(document.getElementById("opp10"));
    } else {
        document.getElementById("oppbid2").innerHTML = "10";
        oppbid2 = 10;
        line4 = document.getElementById("opp10");
        oppadj.push(document.getElementById("opp10"));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}

// the beginning of the computer strategy codes //

function compStrat(){// Not yet implemented fully; just a mediary right now //
    scorediff = oppscore - yourscore;
    roundmod = (compcards.length / 2);
    trickdiff = trick2 - trick1;
    trickavg = (trick1 + trick2)/2;

    comphigh = compcards[compcards.length - 1];
    yourhigh = yourcards[yourcards.length - 1];

    stratNorm();//instead of just passing to stratNorm, there will be an if/else statement to decide how aggressive a strategy to use // 
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
        if (trick1 == 1){
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
            oppbid2 = trick2;
            compcards.splice([trick2 - 1], 1);
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
        } else if (compcards.indexOf(trick2 + 1) != -1){
            oppbid2 = trick2 + 1;
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

//NOT yet implemented, improved comp strategy//
function stratAggro(){}

//beginning of not yet implemented Gauntlet mode//
function theGauntlet(){
    gauntlet++
    mod = gauntlet*2;

    if (gauntlet < 6){
        document.getElementById('opp'+mod).value = mod+'.5';
        document.getElementById('opp'+mod).onclick = gauntlet5Adj;//onclick will not work, as it's against the computer// 
    }
}

function gauntlet5Adj(){
    loop++;
    document.getElementById("undo").disabled = false;
    adj = gauntlet*2 + 0.5;

    if (loop === 1){
        document.getElementById("oppbid1").innerHTML = adj;
        oppbid1 = adj;
        document.getElementById("opp"+mod).disabled = true;
        line3 = document.getElementById("opp"+mod);
        oppadj.push(document.getElementById("opp"+mod));
    } else {
        document.getElementById("oppbid2").innerHTML = adj;
        oppbid2 = adj;
        line4 = document.getElementById("opp"+mod);
        oppadj.push(document.getElementById("opp6"+mod));
        document.getElementById("commit").disabled = false;

        for (i = 0; i < buttons.length; i++){
            cbuttons[i].disabled = true;
        }
    }
}

// function (){WORKING SYNTAX EXAMPLE
//     let dog = 4;
//     document.getElementById('opp'+dog).value = '5';
// }