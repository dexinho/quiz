const containerForSelection = document.querySelector('#container-for-selection')
const containerForQuestions = document.querySelector('#container-for-questions')
const chooseCategoriesDiv = document.querySelector('#categories-div')
const chooseCategoriesButton = document.querySelector('#choose-categories-button')
const chooseDifficultyDiv = document.querySelector('#choose-difficulty-div')
const chooseDifficultyButton = document.querySelector('#choose-difficulty-button')
const okCategoriesButton = document.querySelector('#ok-categories-button')
const categorySpan = document.querySelectorAll('.category-span')
const nicknameInput = document.querySelector('#nickname-input')
const finalScreenDiv = document.querySelector('#final-screen-div')
const currentQuestionNumberDiv = document.querySelector('#current-question-number-div')
const totalQuestionsDiv = document.querySelector('#total-questions-div')
const resultNicknameDiv = document.querySelector('#result-nickname-div')
const resultPointsScoredDiv = document.querySelector('#result-points-scored-div')
const numberOfSecondsDiv = document.querySelector('#number-of-seconds-div')
let currentQuestion = 1
currentQuestionNumberDiv.textContent = currentQuestion
let leaderboardTypeSwitch = true
let leaderboardToReset = true
let leaderboardStatsSwitch = false
let leaderboardStatsType = 'normalLeaderboardStats'

const selectedNamesArr = JSON.parse(localStorage.getItem('selectedNames')) || []

console.log(localStorage)

let defaultQuestionsBorder = '5px dotted gray'
let easyQuestionsBorder = '5px dotted green'
let mediumQuestionsBorder = "5px dotted rgb(230, 216, 67)"
let hardQuestionsBorder = "5px dotted lightcoral"

let animatedMain = 'animated-main'
let animatedParts = 'animated-parts'

let categoriesOpened = false
let difficultyOpened = false
const colors = ['red', 'gold', 'green', 'purple', 'royalblue', 'brown', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'green', 'purple', 'red', 'blue', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'purple']
const checkedCategoriesArr = []
let difficultySelected = 'CHOOSE DIFFICULTY'
const difficultiesArr = ['EASY', 'MEDIUM', 'HARD']
const categoriesArr = ['Arts & Literature', 'Film & TV', 'Food & Drink', 'General Knowledge', 'Geography', 'History'
    , 'Music', 'Science', 'Society & Culture', 'Sport & Leisure']

const nameSummoner = document.querySelectorAll('.name-summoner')
let colorChangingInterval = setInterval(() => {
    let randomIndexLetter = Math.floor(Math.random() * 4)
    let randomIndexColor = Math.floor(Math.random() * 10)
    nameSummoner[randomIndexLetter].style.color = colors[randomIndexColor]
}, 50)

let totalTimePlayed = 0
let currentObj = {}
let secondsToAnswer = 10
let counter = secondsToAnswer
let quizQuestions = []
let pointsScored = 0

function openOrCloseDifficulty() {
    const contentHeight = chooseDifficultyDiv.scrollHeight;

    if (!difficultyOpened) {
        chooseDifficultyDiv.style.height = contentHeight + 'px';
    } else {
        chooseDifficultyDiv.style.height = '0';
    }

    chooseDifficultyButton.textContent = difficultySelected

    if (chooseDifficultyButton.textContent === 'EASY') {
        containerForSelection.style.border = easyQuestionsBorder
        letsBeginButton.style.border = easyQuestionsBorder
        containerForQuestions.style.border = easyQuestionsBorder
        chooseDifficultyButton.style.color = 'green'
    }
    else if (chooseDifficultyButton.textContent === 'MEDIUM') {
        containerForSelection.style.border = mediumQuestionsBorder
        letsBeginButton.style.border = mediumQuestionsBorder
        containerForQuestions.style.border = mediumQuestionsBorder
        chooseDifficultyButton.style.color = 'rgb(230, 216, 67)'
    }
    else if (chooseDifficultyButton.textContent === 'HARD') {
        containerForSelection.style.border = hardQuestionsBorder
        letsBeginButton.style.border = hardQuestionsBorder
        containerForQuestions.style.border = hardQuestionsBorder
        chooseDifficultyButton.style.color = 'lightcoral'
    }

    difficultyOpened = !difficultyOpened;
}

function openOrCloseCategories() {
    const contentHeight = chooseCategoriesDiv.scrollHeight + 19;
    if (!categoriesOpened) {
        chooseCategoriesDiv.style.height = contentHeight + 'px';
    } else {
        chooseCategoriesDiv.style.height = '0';
    }

    if (checkedCategoriesArr.length > 0) {
        chooseCategoriesButton.textContent = ''
        if (checkedCategoriesArr.length < 4) {
            for (let i = 0; i < checkedCategoriesArr.length; i++) {
                if (checkedCategoriesArr[0]) chooseCategoriesButton.textContent += checkedCategoriesArr[i] + '   '
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                if (checkedCategoriesArr[0]) chooseCategoriesButton.textContent += checkedCategoriesArr[i] + '   '
            }
            chooseCategoriesButton.textContent += '...'
        }
        if (chooseCategoriesButton.textContent.length > 25) chooseCategoriesButton.style.fontSize = '15px'
        else chooseCategoriesButton.style.fontSize = '20px'
    }

    if (checkedCategoriesArr.length === 0) {
        chooseCategoriesButton.textContent = 'CHOOSE CATEGORIES'
        chooseCategoriesButton.style.fontSize = '20px'
    }

    categoriesOpened = !categoriesOpened;
}

chooseCategoriesButton.addEventListener('click', openOrCloseCategories);
okCategoriesButton.addEventListener('click', openOrCloseCategories)

chooseDifficultyButton.addEventListener('click', openOrCloseDifficulty);


const difficultySelection = document.querySelectorAll('.difficulty')
difficultySelection.forEach(difficulty => {
    difficulty.addEventListener('click', () => {
        difficultySelected = difficulty.textContent
        openOrCloseDifficulty()
    })
})

const questionsSlider = document.querySelector('#questions-slider')
const numberOfQuestionsSpan = document.querySelector('#number-of-questions-span')
const amountOfQuestionsSpan = document.querySelector('#amount-of-questions-span')

amountOfQuestionsSpan.style.color = 'gold'
questionsSlider.borderInline = '10px solid red'

totalQuestionsDiv.textContent = questionsSlider.value

questionsSlider.addEventListener('input', () => {
    amountOfQuestionsSpan.textContent = questionsSlider.value

    if (questionsSlider.value >= 0 && questionsSlider.value < 10) amountOfQuestionsSpan.style.color = 'gold'
    else if (questionsSlider.value > 10 && questionsSlider.value < 20) amountOfQuestionsSpan.style.color = 'green'
    else if (questionsSlider.value > 20 && questionsSlider.value < 30) amountOfQuestionsSpan.style.color = 'blue'
    else if (questionsSlider.value > 30 && questionsSlider.value < 40) amountOfQuestionsSpan.style.color = 'purple'
    else if (questionsSlider.value > 40 && questionsSlider.value < 50) amountOfQuestionsSpan.style.color = 'red'

    totalQuestionsDiv.textContent = questionsSlider.value
})

const categories = document.querySelectorAll('.categories')
categories.forEach(category => {
    category.addEventListener('change', () => {
        if (category.checked) {
            checkedCategoriesArr.push(category.nextElementSibling.textContent)
            category.nextElementSibling.style.color = 'lightgreen'
        }
        else {
            checkedCategoriesArr.splice(checkedCategoriesArr.indexOf(category.nextElementSibling.textContent), 1)
            category.nextElementSibling.style.color = 'white'
        }
        console.log(checkedCategoriesArr)
    })
})

function letterByLetter(text, location, delay = 0) {
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            location.textContent += text[i]
        }, delay + i * 100);
    }
}

function removeAnimationFromHeart() {
    heartDiv.classList.remove('animated-main-challenge')
    heartDiv.classList.remove('animated-main')
    leftSideOfHeartDiv.classList.remove('animated-parts')
    rightSideOfHeartDiv.classList.remove('animated-parts')
    leftSideOfHeartDiv.classList.remove('animated-parts-challenge')
    rightSideOfHeartDiv.classList.remove('animated-parts-challenge')
}

function quizStarting() {

    if (!selectedNamesArr.includes(nicknameInput.value) && nicknameInput.value !== '') {
        selectedNamesArr.push(nicknameInput.value)
        localStorage.setItem('selectedNames', JSON.stringify(selectedNamesArr))
        updateNameSelection()
    }

    containerForSelection.style.transition = 'ease-in 1s'
    letsBeginButton.disabled = true
    finishButton.disabled = true

    removeAnimationFromHeart()

    let idOne = setTimeout(() => {
        pointsScored = 0
        letsBeginButton.disabled = false
        counter = secondsToAnswer
    }, 1010)

    timeoutIds.push(idOne)

    fetchData()

    timerInsideHeart.textContent = secondsToAnswer

    categories.forEach(category => category.checked = false)

    letsBeginButton.style.transform = 'rotate(2205deg)'
    letsBeginButton.style.transitionProperty = 'height, width'
    letsBeginButton.style.transition = '1s ease-in-out'
    containerForSelection.style.opacity = '0'



    if (difficultySelected === 'CHOOSE DIFFICULTY') {
        let randomDifficulty = difficultiesArr[Math.floor(Math.random() * 3)]
        if (randomDifficulty === 'EASY') {
            containerForQuestions.style.border = easyQuestionsBorder
        }
        else if (randomDifficulty === 'MEDIUM') {
            containerForQuestions.style.border = mediumQuestionsBorder
        }
        else if (randomDifficulty === 'HARD') {
            containerForQuestions.style.border = hardQuestionsBorder
        }
    }
    if (checkedCategoriesArr.length === 0) {
        checkedCategoriesArr.push(categoriesArr[Math.floor(Math.random() * categoriesArr.length)])
    }

    setTimeout(() => {
        letsBeginButton.style.transform = 'rotate(45deg)'
        containerForQuestions.style.opacity = '1'
        containerForSelection.style.display = 'none'
        containerForQuestions.style.display = 'block'
    }, 1000)
    clearInterval(colorChangingInterval)
}


const letsBeginButton = document.querySelector('#lets-begin-button')
letsBeginButton.addEventListener('click', quizStarting)

function resetContainers() {
    nicknameInput.value = ''
    dialogNameInput.value = ''
    containerForEnding.style.display = 'none'
    chooseDifficultyButton.textContent = 'CHOOSE DIFFICULTY'
    chooseCategoriesButton.textContent = 'CHOOSE CATEGORIES'
    chooseCategoriesButton.style.color = 'brown'
    chooseCategoriesButton.style.fontSize = '20px'
    amountOfQuestionsSpan.innerText = (questionsSlider.value = 10)
    checkedCategoriesArr.length = 0
    letsBeginButton.style.border = defaultQuestionsBorder
    containerForSelection.style.border = defaultQuestionsBorder
    containerForQuestions.style.border = defaultQuestionsBorder
    letsBeginButton.style.transition = '0.3s ease-in-out'
    challengeModeButton.style.color = 'white'
    letsBeginButton.disabled = false
    chooseCategoriesDiv.style.height = 0
    chooseDifficultyDiv.style.height = 0

    leaderboardTypeSwitch = true
    leaderboardToReset = true
    leaderboardStatsSwitch = false
    leaderboardStatsType = 'normalLeaderboardStats'
    normalLeaderboardTable.style.display = 'block'
    challengeLeaderboardTable.style.display = 'none'
    currentQuestion = 1
    difficultySelected = 'CHOOSE DIFFICULTY'
    easyQuestionsBorder = '5px dotted green'
    mediumQuestionsBorder = "5px dotted rgb(230, 216, 67)"
    hardQuestionsBorder = "5px dotted lightcoral"
    challengeActivated = false
    animatedMain = 'animated-main'
    animatedParts = 'animated-parts'
    totalTimePlayed = 0

    categorySpan.forEach(category => category.style.color = 'white')

    // for (const id of timeoutIds) clearTimeout(id)

    setTimeout(() => {
        chosenCategoryDiv.innerText = ''
        chosenQuestionDiv.innerText = ''
        correctOrWrongButtons.forEach(button => button.innerText = '')
        removeAnimationFromHeart()
        totalQuestionsDiv.innerText = 10
        secondsToAnswer = 10
        currentQuestionNumberDiv.textContent = 1
        correctOrWrongButtons.forEach(button => {
            button.style.pointerEvents = 'none'
            button.style.transform = 'scale(1)'
            button.disabled = true
            button.style.backgroundColor = 'transparent'
        })
        for (const id of timeoutIds) clearTimeout(id)
        timeoutIds.length = 0
    }, 1000)

    containerForQuestions.style.opacity = '0'

    setTimeout(() => {
        containerForSelection.style.opacity = '1'
        containerForSelection.style.display = 'block'
        containerForQuestions.style.opacity = '0'
        finalScreenDiv.style.opacity = '0'
        containerForQuestions.style.display = 'none'
    }, 1000)

    colorChangingInterval = setInterval(() => {
        let randomIndexLetter = Math.floor(Math.random() * 4)
        let randomIndexColor = Math.floor(Math.random() * 10)
        nameSummoner[randomIndexLetter].style.color = colors[randomIndexColor]
    }, 50)
}

const timeoutIds = []

const heartDiv = document.querySelector('#heart-div')
const leftSideOfHeartDiv = document.querySelector('#left-side-of-heart-div')
const rightSideOfHeartDiv = document.querySelector('#right-side-of-heart-div')

function showCorrectAnswer(obj) {

    let id = setTimeout(() => {
        correctOrWrongButtons.forEach(button => {
            button.style.pointerEvents = 'auto'
            button.style.transform = 'scale(1)'
            button.disabled = false
        })
    }, 2000);

    timeoutIds.push(id)

    correctOrWrongButtons.forEach(button => {
        if (button.innerText === obj.correctAnswer) {
            button.style.backgroundColor = 'rgb(125, 197, 96)'
            button.style.color = 'whitesmoke'
        }
        else {
            button.style.backgroundColor = 'rgb(212, 89, 89)'
        }
    })
}

function startQuiz() {

    if (counter === -1) counter = 0
    totalTimePlayed += secondsToAnswer - counter;
    console.log(counter);

    correctOrWrongButtons.forEach(button => {
        button.style.color = 'black'
        button.style.backgroundColor = 'whitesmoke'
    })

    removeAnimationFromHeart()

    for (const id of timeoutIds) clearTimeout(id)
    timeoutIds.length = 0

    if (quizQuestions.length > 0) {

        currentObj = quizQuestions.pop()
        let arrOfQuestions = [currentObj.correctAnswer]
        currentObj.incorrectAnswers.forEach(answer => arrOfQuestions.push(answer))

        let randomIndexOne = Math.floor(Math.random() * 2);
        let randomIndexTwo = Math.floor(Math.random() * 2) + 2;
        let randomIndexThree = Math.floor(Math.random() * 2);
        let randomIndexFour = Math.floor(Math.random() * 2) + 2;

        [arrOfQuestions[randomIndexOne], arrOfQuestions[randomIndexTwo]] = [arrOfQuestions[randomIndexTwo], arrOfQuestions[randomIndexOne]];
        [arrOfQuestions[randomIndexThree], arrOfQuestions[randomIndexFour]] = [arrOfQuestions[randomIndexFour], arrOfQuestions[randomIndexThree]];

        for (let i = 0; i < arrOfQuestions.length; i++) {
            correctOrWrongButtons[i].innerText = arrOfQuestions[i]
            if (correctOrWrongButtons[i].innerText.length < 20) correctOrWrongButtons[i].style.fontSize = '20px'
            else if (correctOrWrongButtons[i].innerText.length < 40) correctOrWrongButtons[i].style.fontSize = '18px'
            else if (correctOrWrongButtons[i].innerText.length < 60) correctOrWrongButtons[i].style.fontSize = '15px'
            else correctOrWrongButtons[i].style.fontSize = '12px'
        }

        chosenCategoryDiv.innerText = currentObj.category
        chosenQuestionDiv.innerText = ''

        finishButton.disabled = false

        currentQuestionNumberDiv.textContent = currentQuestion++

        correctOrWrongButtons.forEach(button => {
            button.style.pointerEvents = 'auto'
            button.style.transform = 'scale(1)'
            button.disabled = false
        })

        for (let i = 0; i < currentObj.question.length; i++) {
            let id = setTimeout(() => {
                chosenQuestionDiv.textContent += currentObj.question[i]
            }, i * 15);
            timeoutIds.push(id)
        }

        // chosenQuestionDiv.innerText = currentObj.question

        if (chosenCategoryDiv.innerText.length < 50) chosenCategoryDiv.style.fontSize = '20px'
        else if (chosenCategoryDiv.innerText.length < 100) chosenCategoryDiv.style.fontSize = '15px'
        else chosenCategoryDiv.style.fontSize = '10px'



        let idOne = setTimeout(() => {
            heartDiv.classList.add(animatedMain)
            leftSideOfHeartDiv.classList.add(animatedParts)
            rightSideOfHeartDiv.classList.add(animatedParts)
            counter = secondsToAnswer
            startTimer()
        }, 2000);


        let idTwo = setTimeout(() => {
            showCorrectAnswer(currentObj)
        }, secondsToAnswer * 1000 + 2000)

        timeoutIds.push(idOne)
        timeoutIds.push(idTwo)
    }
    else finalScore()
}

const timerInsideHeart = document.querySelector('#timer-inside-heart')

function startTimer() {

    totalQuestionsDiv.innerText = questionsSlider.value
    counter = secondsToAnswer
    timerInsideHeart.innerText = counter
    for (let i = 0; i <= secondsToAnswer; i++) {
        let id = setTimeout(() => {
            timerInsideHeart.innerText = counter--
        }, i * 1000)
        timeoutIds.push(id)
    }

    let idOne = setTimeout(() => {
        removeAnimationFromHeart()
    }, secondsToAnswer * 1000);
    timeoutIds.push(idOne)

    let idtwo = setTimeout(() => {
        startQuiz()
        counter = secondsToAnswer
        correctOrWrongButtons.forEach(button => {
            button.style.backgroundColor = 'whitesmoke'
            button.style.color = 'black'
        })
    }, secondsToAnswer * 1000 + 2000)
    timeoutIds.push(idtwo)
}
function pauseTimer() {
    for (const id of timeoutIds) clearTimeout(id)
}
function stopTimer() {
    for (const id of timeoutIds) clearTimeout(id)
    timerInsideHeart.innerText = ''
    counter = secondsToAnswer
}

const returnButton = document.querySelector('#return-button')
returnButton.addEventListener('click', resetContainers)

const finishButton = document.querySelector('#finish-button')
finishButton.addEventListener('click', finalScore)

async function fetchData() {
    console.log(questionsSlider.value)
    let numberOfQuestionsForLink = questionsSlider.value

    let difficultyForLink = difficultySelected === 'CHOOSE DIFFICULTY'
        ? difficultiesArr[Math.floor(Math.random() * 2)].toLowerCase()
        : difficultySelected.toLowerCase()
    console.log(difficultyForLink)

    let categoriesForLink = checkedCategoriesArr[0]
    for (let i = 1; i < checkedCategoriesArr.length; i++) {
        categoriesForLink += ',' + checkedCategoriesArr[i]
    }

    categoriesForLink = categoriesForLink === undefined
        ? categoriesArr[Math.floor(Math.random() * 10)].toLowerCase().replace(/\&/g, 'and').replace(/\s/g, '_')
        : categoriesForLink.toLowerCase().replace(/\&/g, 'and').replace(/\s/g, '_')

    console.log(categoriesForLink)
    let link = `https://the-trivia-api.com/api/questions?categories=${categoriesForLink}&limit=${numberOfQuestionsForLink}&difficulty=${difficultyForLink}`
    console.log(link)
    const data = await fetch(link)
    quizQuestions = await data.json()

    if (challengeActivated) {
        chosenCategoryDiv.innerText = "LET'S GO"
        chosenQuestionDiv.innerText = 'BRAVE HERO!'
    }
    else {
        chosenCategoryDiv.innerText = "HAVE FUN"
        chosenQuestionDiv.innerText = 'CLEVER HERO!'
    }


    setTimeout(() => {
        startQuiz()
    }, 2000)

    console.log(quizQuestions)
}

const chosenCategoryDiv = document.querySelector('#chosen-category-div')
const chosenQuestionDiv = document.querySelector('#chosen-question-div')

const correctOrWrongButtons = document.querySelectorAll('.correct-or-wrong-answer-buttons')

correctOrWrongButtons.forEach(button => {
    button.disabled = true
})

correctOrWrongButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(1.1)'
        correctOrWrongButtons.forEach(eachButton => {
            eachButton.style.pointerEvents = 'none'
        })
        pauseTimer()
        if (button.innerText === currentObj.correctAnswer) {
            pointsScored++
            showCorrectAnswer(currentObj)
        }
        else {
            showCorrectAnswer(currentObj)
        }

        let id = setTimeout(() => {
            startQuiz()
        }, 2000)

        timeoutIds.push(id)
    })
})
const containerForEnding = document.querySelector('#container-for-ending')

function makePlayerObj() {
    return {
        picture: '',
        name: nicknameInput.value,
        answered: pointsScored,
        total: Number(questionsSlider.value),
        correct: (pointsScored / questionsSlider.value * 100).toFixed(2),
        time: totalTimePlayed
    }
}

function finalScore() {

    let currentObj = {}

    const finalLeaderboardArr = JSON.parse(localStorage.getItem(leaderboardStatsType)) || []

    let foundPlayerObj = finalLeaderboardArr.find(obj => obj.name === nicknameInput.value)
    if (foundPlayerObj !== undefined) {
        console.log(foundPlayerObj)
        foundPlayerObj.answered += pointsScored
        foundPlayerObj.total += Number(questionsSlider.value)
        foundPlayerObj.correct = (foundPlayerObj.answered / foundPlayerObj.total * 100).toFixed(2)
        foundPlayerObj.time += totalTimePlayed
        currentObj = foundPlayerObj
    }
    else {
        currentObj = makePlayerObj()
        finalLeaderboardArr.push(currentObj)
    }

    localStorage.setItem(leaderboardStatsType, JSON.stringify(finalLeaderboardArr))
    addPlayersToLeaderboard()

    let textForNickname = nicknameInput.value === '' ? 'UNKNOWN' : nicknameInput.value
    let textForPointsScored = `${pointsScored}/${questionsSlider.value}`
    let textForSeconds = `${totalTimePlayed} seconds`

    resultNicknameDiv.innerText = ''
    resultPointsScoredDiv.innerText = (resultPointsScoredDiv.style.color = 'blue', '')
    numberOfSecondsDiv.innerText = (numberOfSecondsDiv.style.color = 'red', '')

    counter = secondsToAnswer

    containerForQuestions.style.opacity = '0'

    if (pointsScored / questionsSlider.value * 100 > 75)
        containerForEnding.style.backgroundImage = `url('pictures/albert_einstein.jpg')`
    else if (pointsScored / questionsSlider.value * 100 > 50)
        containerForEnding.style.backgroundImage = `url('pictures/big_brain.jpg')`
    else if (pointsScored / questionsSlider.value * 100 > 25)
        containerForEnding.style.backgroundImage = `url('pictures/not_bad.jpg')`
    else containerForEnding.style.backgroundImage = `url('pictures/better_luck_next_time.webp')`

    for (const id of timeoutIds) clearTimeout(id)

    let idOne = setTimeout(() => {
        containerForQuestions.style.display = 'none'
        containerForEnding.style.opacity = '1'
        containerForEnding.style.display = 'flex'
        containerForEnding.style.justifyContent = 'center'
        containerForEnding.style.alignItems = 'center'
    }, 1000)

    let idTwo = setTimeout(() => {
        finalScreenDiv.style.opacity = '1'
    }, 2000)

    let idThree = setTimeout(() => {
        letterByLetter(textForNickname, resultNicknameDiv, 0)
        letterByLetter(textForPointsScored, resultPointsScoredDiv, textForNickname.length * 150)
        letterByLetter(textForSeconds, numberOfSecondsDiv, textForNickname.length * 150 + 500)
    }, 3500);

    timeoutIds.push(idOne, idTwo, idThree)
}

const playAgainButton = document.querySelector('#play-again-button')

playAgainButton.addEventListener('click', () => {

    for (const id of timeoutIds) clearTimeout(id)
    containerForEnding.style.opacity = '0'

    let id = setTimeout(() => {
        containerForEnding.style.display = 'none'
        containerForSelection.style.display = 'block'
        containerForSelection.style.opacity = '1'
        resetContainers()
        counter = secondsToAnswer
    }, 1000);

    timeoutIds.push(id)
})

const challengeModeButton = document.querySelector('#challenge-mode-button')
let challengeActivated = false
challengeModeButton.addEventListener('click', () => {

    challengeActivated = !challengeActivated

    leaderboardStatsType = leaderboardStatsSwitch ? 'normalLeaderboardStats' : 'challengeLeaderboardStats'
    leaderboardStatsSwitch = !leaderboardStatsSwitch

    containerForSelection.style.transition = 'ease-in 0.2s'

    easyQuestionsBorder = challengeActivated ? '8px dotted green' : '5px dotted green'
    mediumQuestionsBorder = challengeActivated ? '8px dotted rgb(230, 216, 67)' : '5px dotted rgb(230, 216, 67)'
    hardQuestionsBorder = challengeActivated ? '8px dotted lightcoral' : '5px dotted lightcoral'
    animatedMain = challengeActivated ? 'animated-main-challenge' : 'animated-main'
    animatedParts = challengeActivated ? 'animated-parts-challenge' : 'animated-parts'
    secondsToAnswer = challengeActivated ? 5 : 10

    letsBeginButton.style.borderWidth = challengeActivated ? '8px' : '5px'
    containerForSelection.style.borderWidth = challengeActivated ? '8px' : '5px'
    containerForQuestions.style.borderWidth = challengeActivated ? '8px' : '5px'

    challengeModeButton.style.color = challengeActivated ? 'black' : 'whitesmoke'

    // if (challengeActivated) {
    //     easyQuestionsBorder = '8px dotted green'
    //     mediumQuestionsBorder = '8px dotted rgb(230, 216, 67)'
    //     hardQuestionsBorder = '8px dotted lightcoral'
    //     animatedMain = 'animated-main-challenge'
    //     animatedParts = 'animated-parts-challenge'
    //     secondsToAnswer = 5

    //     letsBeginButton.style.borderWidth = '8px'
    //     containerForSelection.style.borderWidth = '8px'
    //     containerForQuestions.style.borderWidth = '8px'

    //     challengeModeButton.style.color = 'black'
    // }
    // else {
    //     easyQuestionsBorder = '5px dotted green'
    //     mediumQuestionsBorder = '5px dotted rgb(230, 216, 67)'
    //     hardQuestionsBorder = '5px dotted lightcoral'
    //     animatedMain = 'animated-main'
    //     animatedParts = 'animated-parts'
    //     secondsToAnswer = 10

    //     letsBeginButton.style.borderWidth = '5px'
    //     containerForSelection.style.borderWidth = '5px'
    //     containerForQuestions.style.borderWidth = '5px'

    //     challengeModeButton.style.color = 'whitesmoke'
    // }
})

const dialogName = document.querySelector('#dialog-name')
const dialogNameInput = document.querySelector('#dialog-name-input')
const nameSelection = document.querySelector('#name-selection')
nicknameInput.addEventListener('click', () => {
    // if (nameSelection.options[0] !== undefined)
    //     dialogNameInput.value = nameSelection.options[0].innerText
    dialogName.showModal()
})


const closeDialogForNameButton = document.querySelector('#close-dialog-for-name-button')
closeDialogForNameButton.addEventListener('click', () => {
    dialogName.close()
    nicknameInput.value = dialogNameInput.value
})

dialogNameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter')
        closeDialogForNameButton.click()
})

nameSelection.addEventListener('click', () => {
    dialogNameInput.value = nameSelection.value
})

const trophyDiv = document.querySelector('#trophy-div');
const closeLeaderboardButton = document.querySelector('#close-leaderboard-button');
const leaderboardDialog = document.querySelector('#leaderboard-dialog');
trophyDiv.addEventListener('click', () => {
    leaderboardDialog.showModal()
});
closeLeaderboardButton.addEventListener('click', () => {
    leaderboardDialog.close()
})

const deleteNameFromTheSelection = document.querySelector('.fa-trash-can')

function updateNameSelection() {
    nameSelection.innerText = ''
    selectedNamesArr.forEach(name => {
        const newOptionName = document.createElement('option')
        newOptionName.value = name
        newOptionName.innerText = name
        newOptionName.style.fontWeight = 'bold'
        nameSelection.append(newOptionName)
    })

    localStorage.setItem('selectedNames', JSON.stringify(selectedNamesArr))
}

deleteNameFromTheSelection.addEventListener('click', () => {
    const selectedIndex = nameSelection.selectedIndex;
    const selectedOption = nameSelection.options[selectedIndex];
    let indexToSplice = selectedNamesArr.indexOf(selectedOption.innerText)

    if (indexToSplice !== -1) {
        selectedNamesArr.splice(indexToSplice, 1)
        updateNameSelection()
        dialogNameInput.value = nameSelection.options[0].innerText
    }
})

const resetLeaderboardButton = document.querySelector('#reset-leaderboard-button')
const leaderboardTable = document.querySelector('#normal-leaderboard-table')
function resetLeaderboard(resetButton = true) {

    const tbody = resetButton ? leaderboardTable.firstElementChild : leaderboardTable.nextElementSibling.firstElementChild

    while (tbody.childElementCount > 1) {
        tbody.removeChild(tbody.lastChild)
    }

    let itemToRemove = resetButton ? 'normalLeaderboardStats' : 'challengeLeaderboardStats'
    localStorage.removeItem(itemToRemove)
}
resetLeaderboardButton.addEventListener('click', () => {
    areYouSureDiv.style.display = 'block'
})

function addPlayersToLeaderboard() {

    const normalLeaderboardArr = JSON.parse(localStorage.getItem('normalLeaderboardStats')) || []
    const challengeLeaderboardArr = JSON.parse(localStorage.getItem('challengeLeaderboardStats')) || []
    const tbodyNormal = leaderboardTable.firstElementChild
    const tbodyChallenge = leaderboardTable.nextElementSibling.firstElementChild

    while (tbodyNormal.childElementCount > 1) {
        tbodyNormal.removeChild(tbodyNormal.lastChild)
    }
    while (tbodyChallenge.childElementCount > 1) {
        tbodyChallenge.removeChild(tbodyChallenge.lastChild)
    }

    normalLeaderboardArr.forEach(playerObj => {
        if (playerObj.answered >= 1 && playerObj.name !== '') {
            const newRow = document.createElement('tr')
            const tbody = leaderboardTable.firstElementChild
            newRow.appendChild(document.createElement('td')).innerText = playerObj.name
            newRow.appendChild(document.createElement('td')).innerText = playerObj.answered
            newRow.appendChild(document.createElement('td')).innerText = playerObj.correct
            newRow.appendChild(document.createElement('td')).innerText = playerObj.time
            tbody.appendChild(newRow)
        }
    })

    challengeLeaderboardArr.forEach(playerObj => {
        if (playerObj.answered >= 1 && playerObj.name !== '') {
            const newRow = document.createElement('tr')
            const tbody = leaderboardTable.nextElementSibling.firstElementChild
            let firstTd = document.createElement('td')
            let secondsTd = document.createElement('td')
            let thirdTd = document.createElement('td')
            let fourthTd = document.createElement('td')
            firstTd.style.color = 'white'
            secondsTd.style.color = 'white'
            thirdTd.style.color = 'white'
            fourthTd.style.color = 'white'
            newRow.appendChild(firstTd).innerText = playerObj.name
            newRow.appendChild(secondsTd).innerText = playerObj.answered
            newRow.appendChild(thirdTd).innerText = playerObj.correct
            newRow.appendChild(fourthTd).innerText = playerObj.time
            tbody.appendChild(newRow) 
        }
    })
}

const yesDecisionButton = document.querySelector('#yes-decision-button')
const noDecisionButton = document.querySelector('#no-decision-button')
const areYouSureDiv = document.querySelector('#are-you-sure-div')

yesDecisionButton.addEventListener('click', () => {
    areYouSureDiv.style.display = 'none'
    resetLeaderboard(leaderboardToReset)
})
noDecisionButton.addEventListener('click', () => {
    areYouSureDiv.style.display = 'none'
})

resultNicknameDiv.addEventListener('click', () => {
    leaderboardDialog.showModal()
})

const infoDiv = document.querySelector('#info-div')
const faCircleQuestion = document.querySelector('.fa-circle-question')

faCircleQuestion.addEventListener('click', () => {
    infoDiv.style.display = infoDiv.style.display === 'block' ? 'none' : 'block'
})

let nameSwitch = -1
let answersSwitch = -1

function sortLeaderBoard(arr, property, switchType) {
    arr.sort((a, b) => {
        return a[property] >= b[property] ? -1 * switchType : 1 * switchType
    })
}
const tableHeaderDivs = document.querySelectorAll('.table-header-divs')
tableHeaderDivs.forEach(header => {
    header.addEventListener('click', () => {
        let leaderboardType = leaderboardTypeSwitch ? 'normalLeaderboardStats' : 'challengeLeaderboardStats'
        const chosenStatsArr = JSON.parse(localStorage.getItem(leaderboardType)) || []
        if (header.id === 'sort-by-name') {
            sortLeaderBoard(chosenStatsArr, 'name', nameSwitch)
            nameSwitch *= -1
        }
        else if (header.id === 'sort-by-answers') {
            sortLeaderBoard(chosenStatsArr, 'answered', answersSwitch)
            answersSwitch *= -1
        }
        else if (header.id === 'sort-by-percentage') {
            sortLeaderBoard(chosenStatsArr, 'correct', answersSwitch)
            answersSwitch *= -1
        }
        else if (header.id === 'sort-by-time') {
            sortLeaderBoard(chosenStatsArr, 'time', answersSwitch)
            answersSwitch *= -1
        }

        localStorage.setItem(leaderboardType, JSON.stringify(chosenStatsArr))
        addPlayersToLeaderboard()
    })
})

const switchLeaderboardButton = document.querySelector('#switch-leaderboard-table-button')
const normalLeaderboardTable = document.querySelector('#normal-leaderboard-table')
const challengeLeaderboardTable = document.querySelector('#challenge-leaderboard-table')
switchLeaderboardButton.addEventListener('click', () => {

    const tdCells = document.querySelectorAll('td')

    if (leaderboardTypeSwitch) {
        normalLeaderboardTable.style.display = 'none'
        challengeLeaderboardTable.style.display = 'block'
        switchLeaderboardButton.style.background = 'radial-gradient(rgb(248, 248, 248), rgb(127, 127, 216))'
        switchLeaderboardButton.style.color = 'black'
        switchLeaderboardButton.innerHTML = '<i class="fa-solid fa-caret-down"></i>&nbsp;&nbsp; CHALLENGE MODE LEADERBOARD &nbsp;&nbsp;<i class="fa-solid fa-caret-down"></i>'
        leaderboardDialog.style.background = 'radial-gradient(rgb(240, 147, 147), rgb(200, 172, 172))'
        resetLeaderboardButton.style.color = 'blue'

        tdCells.forEach(cell => cell.style.color = 'white')
    }
    else {
        normalLeaderboardTable.style.display = 'block'
        challengeLeaderboardTable.style.display = 'none'
        switchLeaderboardButton.style.background = ''
        switchLeaderboardButton.style.background = 'radial-gradient(rgb(212, 110, 110), rgb(167, 127, 216));'
        switchLeaderboardButton.style.color = 'white'
        switchLeaderboardButton.innerHTML = '<i class="fa-solid fa-caret-down"></i>&nbsp;&nbsp; NORMAL MODE LEADERBOARD &nbsp;&nbsp;<i class="fa-solid fa-caret-down"></i>'
        leaderboardDialog.style.background = 'radial-gradient(lightcyan, lightgray)'
        resetLeaderboardButton.style.color = 'red'

        tdCells.forEach(cell => cell.style.color = 'black')
    }

    leaderboardToReset = !leaderboardToReset
    leaderboardTypeSwitch = !leaderboardTypeSwitch
})

addPlayersToLeaderboard()
updateNameSelection()