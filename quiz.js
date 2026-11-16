
document.addEventListener(`DOMContentLoaded`, () => {
  
  // DOM button event listeners
  const startQuizBtn = document.getElementById(`startquizbtn`)
  const nextBtn = document.getElementById(`nextbutton`)
  const previousBtn = document.getElementById(`backbutton`)
  const restartBtn = document.getElementById(`restartquiz`)
  const viewquestionBtn = document.getElementById(`viewqustion`)

  // DOM content updated
  const questionheader = document.getElementById(`questionheader`)
  const questionList = document.querySelector(`.questionlist`)
  const listoption = document.querySelectorAll(`labelTag`)
  const alerttext = document.getElementById(`optionalert`)
  const questionNumber = document.getElementById(`questionlenght`)
  const questiontypeNode = document.querySelectorAll(`.typediv p `)
  const selectoption = document.getElementById(`selectquestion`)

  // Switching the display between these container
  const showResult = document.querySelector(`.showresult`)
  const questiondiv = document.querySelector(`.introduct_ory`)
  const optiondiv = document.querySelector(`.option_question_div`)
  const showquizarray = document.querySelector(`.showquizarray`)
   const questionlisteddiv = document.querySelector(`.question-contentlist`)
  

  
  // RemoveActive on each tab default active on select and add to selected list
  questiontypeNode.forEach((list) => {
      list.addEventListener(`click`, () => {
          removeactive()
          list.classList.add(`active`)
      })
  })

  function removeactive() {
      questiontypeNode.forEach(e => {
          e.classList.remove(`active`)
      })
  }

    
  
  let selectedQuestions = []
  let quizData = [];
  console.log(quizData)
  let currentquestionIndex = 0;
  let score = 0
  // let userAnswers = []

  function checkquestion(question) {
    return Array.from(question).find(element => element.classList.contains(`active`))?.textContent;
  }
  
  // Removed unused questiontypelist assignment and log

  // Click event on button action to display data
  startQuizBtn.addEventListener(`click`, async () => {
    let inputquestion = selectoption.value.trim()
    const checknumber = parseInt(checkquestion(questiontypeNode))
    if (!inputquestion || !checknumber) return
    
    try {
      const resultcheck = await fetchQuizData(inputquestion, checknumber)
      quizData = resultcheck
      showQuestion(quizData)
      
    } catch (error) {
      console.log(`Quiz can't be found`)
    }
    questiondiv.classList.add("hidden")
    optiondiv.classList.remove("hidden")
    
  })

  // Function fetching quiz data from API URL
  async function fetchQuizData(inputelement, checknumber) {
    // Ensure inputelement is either 'multiple' or 'boolean'
    const type = (inputelement === 'multiple' || inputelement === 'boolean') ? inputelement : 'multiple';
    const url = `https://opentdb.com/api.php?amount=${checknumber}&type=${type}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Can't find question");
    }
    const dataresult = await response.json()
    return dataresult
  }

  // Decode HTML parse to remove HTMl content from the questions and answer listed
  function decodeHTML(html) {
    const parser = new DOMParser()
    return parser.parseFromString(html, "text/html").documentElement.textContent
  }
  // declaring the variable that will hold the variable for text
  let choicediv

  // Function to display the elements to the front end
  function showQuestion(data) {
    questionList.innerHTML = ""
    alerttext.textContent = ""
    const questionObj = data.results[currentquestionIndex];
    const { question, correct_answer, incorrect_answers } = questionObj;
    const allanswers = [
      ...incorrect_answers, correct_answer
    ]
    const sortallanswers = allanswers.sort((a, b) => a.localeCompare(b));
      
    // Display current question number and total questions
    questionNumber.textContent = `Question ${currentquestionIndex + 1} of ${data.results.length}`;
    questionheader.textContent = decodeHTML(question);

      // Display incorrect answers as options
      sortallanswers.forEach(answer => {
        choicediv = document.createElement(`li`);
        choicediv.classList.add(`labelTag`);
        choicediv.textContent = decodeHTML(answer)
        questionList.appendChild(choicediv);
        if (userAnswers[currentquestionIndex] === answer) {
          choicediv.classList.add('showactive')
        }
        choicediv.addEventListener(`click`, (event) => {
          optionselect(event)
          userAnswers[currentquestionIndex] = answer
        })
      });
  }

  let userAnswers = {};
  
  console.log(userAnswers)


  // Confirm is a selection has been
  function checkoptionselected(optionlist) {
    return Array.from(optionlist).some(element => element.classList.contains(`showactive`));
  }

  // Next button that activates the next questions
  nextBtn.addEventListener(`click`, async () => {
    const checkselected = checkoptionselected(questionList.children)

    if (!checkselected) {
      alerttext.textContent = "Option need to be selected"
    } else if ( currentquestionIndex < quizData.results.length - 1) {
      currentquestionIndex++
      showQuestion(quizData)
    } else {
      showresultcontent()
    } 
    
  })

  // Previous button that show recent questions on click
  previousBtn.addEventListener(`click`,  async () => {
    if (currentquestionIndex > 0 ) {
      currentquestionIndex--
      showQuestion(quizData)
    }
    
  })

  // // Switch between active options selected
  function optionselect(event){
    questionList.querySelectorAll(`.labelTag, .showactive`).forEach(element => {
      element.classList.remove(`showactive`)
      element.classList.add(`labelTag`)
      
    });
    event.currentTarget.classList.remove(`labelTag`)
    event.currentTarget.classList.add(`showactive`)
    userAnswers[currentquestionIndex] = event.currentTarget.textContent
  }

  const questiondivelement = document.querySelector(`.questionslisted`)
  viewquestionBtn.addEventListener(`click`, () => {
    quizData.results.forEach((questions, index) => {
      const correctAswer = questions.correct_answer
      const questionTitle = questions.question
      const userAnswer = userAnswers[index]

      const elementdiv = document.createElement(`div`)
      elementdiv.classList.add(`questionslisted`)
      elementdiv.innerHTML += `<p id="questionlenght" class="mb-3 text-sm">Question ${index + 1} of ${quizData.results.length}</p>
                      <h1 class="questiontitle text-3xl md:text-4xl" >${questionTitle}</h1>
                    <ul class="questionlist mt-4">
                          <li class="labelTag">
                              ${userAnswer}
                          </li>
                          <li class="labelTag">
                              ${correctAswer}
                          </li>
                    </ul>`
      
      console.log(questiondivelement)
      questionlisteddiv.appendChild(elementdiv)


      // Creating the li and assigning the li to their parent element
      //  <h1 class="text-3xl md:text-4xl" >Lorem ipsum dolor sit.</h1>
      // const questiontitle = document.createElement(`h1`)
      // questiontitle.textContent = decodeHTML(questionTitle)
      // questiontitle.classList.add(`questiontitle`)

      // const quizcorrect_answer = document.createElement("li")
      // quizcorrect_answer.textContent = decodeHTML(correctAswer)

      // const useranswer = document.createElement("li")
      // useranswer.textContent = decodeHTML(userAnswer)

      // quizcorrect_answer.classList.add(`labelTag`)
      // useranswer.classList.add(`labelTag`)
      
      

      // Checking if and else statement for the correct and user answer
      // if (useranswer === quizcorrect_answer) {
      //   useranswer.style.borderColor = `1.5px solid green`
      // } else if (useranswer !== quizcorrect_answer) {
      //   useranswer.style.border = `1.5px solid red`
      //   quizcorrect_answer.style.border = `1.5px solid green`
      // }
      
      showResult.classList.add("hidden")
      showquizarray.classList.remove("hidden")
      
    })
  })

  function checkanswer(questions) {
    if (questions.correct_answer === questions[index]) {
          document.querySelector(`.labelTag`).style.borderColor = `1.5px solid green`
        } else {
          document.querySelector(`.labelTag`).style.borderColor = `1.5px solid red`
        }
  }

  

  // To get the check for selected answer
  function selectanswer() {
    quizData.results.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        score ++
      }
    })
  }

  // Function that display result to the user interface
  function showresultcontent() {
    showResult.classList.remove("hidden")
    questiondiv.classList.add("hidden")
    optiondiv.classList.add("hidden")
    selectanswer()

    document.querySelector(`.total_question p`).textContent = quizData.results.length
    document.querySelector(`.correct_answer p`).textContent = score
    document.querySelector(`.in_correctanswer p`).textContent = quizData.results.length - score
  }

  restartBtn.addEventListener(`click`, () => {
    
    showResult.classList.add("hidden")
    questiondiv.classList.remove("hidden")
    currentquestionIndex = 0
    score = 0
  })


})
