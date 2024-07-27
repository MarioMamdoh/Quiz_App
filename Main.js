let titleCategory = document.querySelector("#title"),
  levelSelected = document.querySelector("#lvl"),
  categorySelected = document.querySelector(".category span"),
  lvlChoosen = document.querySelector(".count .lvlChossen"),
  countOfQuestion = document.querySelector(".count .countOfQuestion"),
  questionDiv = document.querySelector(".question-area"),
  submitBtn = document.querySelector(".submit"),
  bulletsDiv = document.querySelector(".spans-bullets"),
  countDownDiv = document.querySelector(".countdown"),
  FinalResultDiv = document.querySelector(".result"),
  answersArea = document.querySelector(".answers-area");
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;
const lvl = {
  Easy: 20,
  Normal: 30,
  Hard: 40,
};
function myRequest() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let AllquestionsCount = questionsObject.length;
      let arrayAllQuestions = Array.from(questionsObject);
      let HTMLQuestions = Array.from(
        arrayAllQuestions.filter((e) => e.title == "HTML")
      );
      console.log();
      let CSSQuestions = Array.from(
        arrayAllQuestions.filter((e) => e.title == "CSS")
      );
      let JSQuestions = Array.from(
        arrayAllQuestions.filter((e) => e.title == "JS")
      );
      titleCategory.addEventListener("change", (currentCat) => {
        if (currentCat.target.value != "Select Category") {
          categorySelected.innerHTML = currentCat.target.value;
        }
        levelSelected.addEventListener("change", (currentlvl) => {
          if (currentlvl.target.value !== "Select Level") {
            lvlChoosen.innerHTML = currentlvl.target.value;
            countOfQuestion.innerHTML = lvl[`${currentlvl.target.value}`];
            if (currentCat.target.value === "HTML") {
              addDataToPage(
                HTMLQuestions[currentIndex],
                countOfQuestion.innerHTML
              );
              countdown(30, countOfQuestion.innerHTML);
              submitBtn.addEventListener("click", () => {
                onSubmit(HTMLQuestions, countOfQuestion.innerHTML);
              });
            } else if (currentCat.target.value === "CSS") {
              addDataToPage(
                CSSQuestions[currentIndex],
                countOfQuestion.innerHTML
              );
              countdown(30, countOfQuestion.innerHTML);
              submitBtn.addEventListener("click", () => {
                onSubmit(CSSQuestions, countOfQuestion.innerHTML);

                clearInterval(countdownInterval);
                countdown(30, countOfQuestion.innerHTML);
                showResults(countOfQuestion.innerHTML);
              });
            } else if (currentCat.target.value === "JS") {
              addDataToPage(
                JSQuestions[currentIndex],
                countOfQuestion.innerHTML
              );
              countdown(30, countOfQuestion.innerHTML);
              submitBtn.addEventListener("click", () => {
                onSubmit(JSQuestions, countOfQuestion.innerHTML);
                clearInterval(countdownInterval);
                countdown(30, countOfQuestion.innerHTML);
                showResults(countOfQuestion.innerHTML);
              });
            }
          }
          currentlvl.target.parentNode.style.display = "none";
          createBullets(countOfQuestion.innerHTML);
        });
      });
    }
  };
  myRequest.open("GET", "Main.json");
  myRequest.send();
}
myRequest();
function addDataToPage(obj, count) {
  if (currentIndex < count) {
    let question = document.createElement("div");
    question.append(document.createTextNode(obj.question));
    question.className = "question";
    questionDiv.append(question);
    for (let i = 0; i < 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";
      let input = document.createElement("input");
      input.type = "radio";
      input.id = `answer-${i + 1}`;
      input.dataset.answer = obj[`answer-${i + 1}`];
      input.name = "question";
      if (i === 0) {
        input.checked = true;
      }
      let label = document.createElement("label");
      label.htmlFor = `answer-${i + 1}`;
      label.innerHTML = obj[`answer-${i + 1}`];
      answer.append(input);
      answer.append(label);
      answersArea.append(answer);
    }
  }
}

function createBullets(count) {
  for (let i = 0; i < count; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.className = "on";
    }
    bulletsDiv.append(span);
  }
}

function onSubmit(obj, count) {
  if (currentIndex < count) {
    let therightAnswer = obj[currentIndex][`right-answer`];
    currentIndex++;
    checkAnswer(therightAnswer);
    questionDiv.innerHTML = "";
    answersArea.innerHTML = "";
    addDataToPage(obj[currentIndex], count);
    handleBullets();
    clearInterval(countdownInterval);
    countdown(30, countOfQuestion.innerHTML);
    showResults(countOfQuestion.innerHTML);
  }
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    questionDiv.remove();
    answersArea.remove();
    submitBtn.remove();
    bulletsDiv.remove();
  }
  if (rightAnswer > count / 2 && rightAnswer < count) {
    theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
  } else if (rightAnswer == count) {
    theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
  } else {
    theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
  }
  FinalResultDiv.innerHTML = theResults;
}
function checkAnswer(right) {
  let answer = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i].checked) {
      theChoosenAnswer = answer[i].dataset.answer;
    }
  }
  console.log(theChoosenAnswer);
  console.log(right);
  if (right === theChoosenAnswer) {
    rightAnswer++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans-bullets span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.className = "on";
    }
  });
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownDiv.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
