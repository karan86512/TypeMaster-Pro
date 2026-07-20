


const typingInput = document.getElementById("typingInput");

const paragraphBox = document.getElementById("paragraph");

const startBtn = document.getElementById("startBtn");

const restartBtn = document.getElementById("restartBtn");

const timerDisplay = document.getElementById("timer");

const wpmDisplay = document.getElementById("wpm");

const accuracyDisplay = document.getElementById("accuracy");

const mistakesDisplay = document.getElementById("mistakes");

const cpmDisplay = document.getElementById("cpm");

const progressFill = document.querySelector(".typing-progress-fill");

const timeButtons = document.querySelectorAll(".time-btn");

const themeToggle = document.getElementById("themeToggle");

const scrollTopBtn = document.getElementById("scrollTop");

const menuToggle = document.querySelector(".menu-toggle");

const navMenu = document.querySelector(".nav-menu");



let timeLimit = 60;

let timeLeft = timeLimit;

let timer = null;

let isRunning = false;


let charactersTyped = 0;

let mistakes = 0;

let correctCharacters = 0;


let startTime = null;


let currentText = "";




window.addEventListener("DOMContentLoaded",()=>{


    timerDisplay.textContent = timeLimit;


    loadInitialState();


});

timeButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        timeButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");


        timeLimit = Number(button.dataset.time);


        resetTest();


    });


});


startBtn.addEventListener("click",()=>{


    if(!isRunning){

        startTest();

    }


});



 restartBtn.addEventListener("click",()=>{

    loadParagraph();

    resetTest();

});



function startTest(){


    isRunning = true;


    typingInput.focus();


    startTime = new Date();


    startTimer();


}



function startTimer(){


    clearInterval(timer);



    timer = setInterval(()=>{


        timeLeft--;


        timerDisplay.textContent = timeLeft;



        updateProgress();



        if(timeLeft <= 0){


            endTest();


        }



    },1000);


}


function endTest(){


    clearInterval(timer);


    isRunning = false;


    typingInput.disabled = true;


    calculateResults();



}


function resetTest(){


    clearInterval(timer);



    isRunning = false;



    timeLeft = timeLimit;



    timerDisplay.textContent = timeLimit;



    typingInput.value = "";



    typingInput.disabled = false;



    charactersTyped = 0;



    correctCharacters = 0;



    mistakes = 0;



    wpmDisplay.textContent = "0";



    accuracyDisplay.textContent = "100%";



    mistakesDisplay.textContent = "0";



    cpmDisplay.textContent = "0";



    progressFill.style.width = "0%";



    typingInput.focus();



}



function updateProgress(){


    let progress =

    ((timeLimit - timeLeft) / timeLimit) * 100;



    progressFill.style.width = progress + "%";



}


function loadInitialState(){


    resetTest();


}



function loadParagraph(){

    let randomIndex = Math.floor(
        Math.random() * paragraphs.length
    );

    currentText = paragraphs[randomIndex];

    renderParagraph();

}


function renderParagraph(){


    paragraphBox.innerHTML = "";



    currentText.split("").forEach((character,index)=>{


        let span = document.createElement("span");


        span.innerText = character;


        span.dataset.index = index;



        paragraphBox.appendChild(span);


    });



}



typingInput.addEventListener("input",()=>{



    if(!isRunning){


        startTest();


    }



    let typedText = typingInput.value;



    charactersTyped = typedText.length;



    let characters = paragraphBox.querySelectorAll("span");



    mistakes = 0;

    correctCharacters = 0;



    characters.forEach((char,index)=>{


        let typedCharacter = typedText[index];



        char.classList.remove(

            "correct",

            "incorrect",

            "active"

        );



        if(typedCharacter == null){


            if(index === typedText.length){


                char.classList.add("active");


            }


        }


        else if(

            typedCharacter === char.innerText

        ){


            char.classList.add("correct");


            correctCharacters++;


        }


        else{


            char.classList.add("incorrect");


            mistakes++;


        }



    });



    updateLiveStats();



    checkCompletion();



});


function checkCompletion(){


    if(

        typingInput.value.length >=

        currentText.length

    ){


        endTest();


    }



}



function updateLiveStats(){


    let timeSpent =

    (new Date() - startTime) / 1000;



    if(timeSpent <= 0){

        timeSpent = 1;

    }



    let minutes =

    timeSpent / 60;



    let words =

    correctCharacters / 5;



    let wpm =

    Math.round(words / minutes);



    let cpm =

    Math.round(correctCharacters / minutes);




    let accuracy =


    Math.round(

        (

        correctCharacters /

        charactersTyped

        ) * 100

    );



    if(isNaN(accuracy)){


        accuracy = 100;


    }




    wpmDisplay.textContent = wpm;


    cpmDisplay.textContent = cpm;


    accuracyDisplay.textContent =

    accuracy + "%";


    mistakesDisplay.textContent = mistakes;



}



loadParagraph();


function calculateResults(){


    let finalWPM = Number(wpmDisplay.textContent);


    let finalAccuracy =

    accuracyDisplay.textContent;



    let resultData = {


        wpm: finalWPM,


        accuracy: finalAccuracy,


        mistakes: mistakes,


        date: new Date().toLocaleDateString()


    };



    saveResult(resultData);
    showLeaderboard();



    checkAchievements(finalWPM);



    showResultMessage(resultData);



}




function saveResult(data){


    let history =

    JSON.parse(

        localStorage.getItem("typingHistory")

    ) || [];



    history.push(data);



    if(history.length > 10){


        history.shift();


    }



    localStorage.setItem(

        "typingHistory",

        JSON.stringify(history)

    );



    updateLeaderboard(data);


}


function updateLeaderboard(data){


    let leaderboard =

    JSON.parse(

        localStorage.getItem("leaderboard")

    ) || [];



    leaderboard.push({


        name:"You",


        wpm:data.wpm,


        accuracy:data.accuracy


    });




    leaderboard.sort((a,b)=>{


        return b.wpm - a.wpm;


    });



    leaderboard = leaderboard.slice(0,10);



    localStorage.setItem(

        "leaderboard",

        JSON.stringify(leaderboard)

    );



}


function showResultMessage(data){



    setTimeout(()=>{


        alert(

        `Test Completed 🎉

        WPM : ${data.wpm}

        Accuracy : ${data.accuracy}

        Mistakes : ${data.mistakes}`

        );


    },300);



}


function checkAchievements(wpm){


    let badges =

    JSON.parse(

        localStorage.getItem("badges")

    ) || [];




    if(wpm >= 30 && !badges.includes("Beginner")){


        badges.push("Beginner");


    }



    if(wpm >= 60 && !badges.includes("Intermediate")){


        badges.push("Intermediate");


    }



    if(wpm >= 100 && !badges.includes("Professional")){


        badges.push("Professional");


    }



    if(wpm >= 150 && !badges.includes("Legend")){


        badges.push("Legend");


    }



    localStorage.setItem(

        "badges",

        JSON.stringify(badges)

    );



}


themeToggle.addEventListener("click",()=>{


    document.body.classList.toggle(
        "light-mode"
    );


    let isLight =

    document.body.classList.contains(
        "light-mode"
    );



    localStorage.setItem(

        "theme",

        isLight ? "light" : "dark"

    );



});


function loadTheme(){


    let savedTheme =

    localStorage.getItem("theme");



    if(savedTheme === "light"){


        document.body.classList.add(
            "light-mode"
        );


    }


}



loadTheme();



menuToggle.addEventListener("click",()=>{


    navMenu.classList.toggle(
        "active"
    );


});



window.addEventListener(
"scroll",
()=>{


    if(window.scrollY > 500){


        scrollTopBtn.classList.add(
            "show"
        );


    }

    else{


        scrollTopBtn.classList.remove(
            "show"
        );


    }


});





scrollTopBtn.addEventListener(
"click",
()=>{


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


});



window.addEventListener(
"scroll",
()=>{


    let header =

    document.querySelector(
        ".header"
    );



    if(window.scrollY > 50){


        header.classList.add(
            "scrolled"
        );


    }

    else{


        header.classList.remove(
            "scrolled"
        );


    }


});



document.addEventListener(
"mousemove",
(e)=>{


    let glow =

    document.querySelector(
        ".cursor-glow"
    );



    if(glow){


        glow.style.left =

        e.clientX + "px";



        glow.style.top =

        e.clientY + "px";


    }


});


const typingSound =

new Audio(
"assets/sounds/type.mp3"
);



typingInput.addEventListener(
"keydown",
()=>{


    typingSound.currentTime = 0;


    typingSound.play()
    .catch(()=>{});



});



function launchConfetti(){


    let amount = 80;



    for(let i=0;i<amount;i++){


        let piece =

        document.createElement(
            "span"
        );



        piece.className =
        "confetti";



        piece.style.left =

        Math.random()*100 + "%";



        piece.style.animationDuration =

        (Math.random()*3+2)+"s";



        document.body.appendChild(
            piece
        );



        setTimeout(()=>{


            piece.remove();


        },5000);


    }


}



function checkConfetti(){


    let score =

    Number(wpmDisplay.textContent);



    if(score >= 100){


        launchConfetti();


    }


}



window.addEventListener(
"load",
()=>{


    loadParagraph();


    resetTest();


});
window.addEventListener("load",()=>{

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.opacity = "0";

        setTimeout(()=>{

            loader.style.display = "none";

        },500);

    }

});




function loadPerformanceChart(){


    const ctx = document
    .getElementById("performanceChart");


    if(!ctx){
        return;
    }


    let history = JSON.parse(

        localStorage.getItem("typingHistory")

    ) || [];



    let labels = history.map((item,index)=>{

        return "Test " + (index + 1);

    });



    let wpmData = history.map(item=>{

        return item.wpm;

    });



    new Chart(ctx,{

        type:"line",


        data:{


            labels:labels,


            datasets:[{

                label:"WPM Progress",

                data:wpmData,


                tension:0.4


            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{


                    display:true

                }


            }


        }


    });


}




loadPerformanceChart();


function showLeaderboard(){


    const leaderboardBody = 

    document.getElementById(
        "leaderboardBody"
    );


    if(!leaderboardBody){

        return;

    }



    let leaderboard = JSON.parse(

        localStorage.getItem("leaderboard")

    ) || [];



    leaderboardBody.innerHTML = "";



    leaderboard.forEach((player,index)=>{


        let row = document.createElement("tr");


        row.innerHTML = `

        <td>#${index + 1}</td>

        <td>${player.name}</td>

        <td>${player.wpm}</td>

        <td>${player.accuracy}</td>

        `;


        leaderboardBody.appendChild(row);



    });



}



showLeaderboard();

function showAchievements(){


    const box = document.getElementById(
        "achievementList"
    );


    if(!box){

        return;

    }



    let badges = JSON.parse(

        localStorage.getItem("badges")

    ) || [];



    box.innerHTML = "";



    if(badges.length === 0){


        box.innerHTML = `

        <div class="empty-badge">

        Start typing to unlock achievements 🚀

        </div>

        `;


        return;

    }





    badges.forEach(badge=>{


        let card = document.createElement(
            "div"
        );


        card.className =
        "achievement-card";



        card.innerHTML = `


        <div class="badge-icon">

        🏆

        </div>


        <h3>${badge}</h3>


        <p>
        Achievement Unlocked
        </p>


        `;



        box.appendChild(card);



    });



}



showAchievements();