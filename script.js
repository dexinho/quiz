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
const nameSummoner = document.querySelectorAll('.name-summoner')
currentQuestionNumberDiv.textContent = 1
let CURRENT_QUESTION_NUMBER = 1
let LEADERBOARD_TYPE_FLAG = true
let LEADERBOARD_TO_RESET = true
let LEADERBOARD_STATS_FLAG = false
let LEADERBOARD_STATS_TYPE = 'normalLeaderboardStats'

const TIMEOUT_IDS = []
const INTERVAL_IDS = []

const SELECTED_NAMES_ARR = JSON.parse(localStorage.getItem('selectedNames')) || []

let DEFAULT_QUESTIONS_BORDER = '5px dotted gray'
let EASY_QUESTIONS_BORDER = '5px dotted green'
let MEDIUM_QUESTIONS_BORDER = "5px dotted rgb(230, 216, 67)"
let HARD_QUESTIONS_BORDER = "5px dotted lightcoral"

let ANIMATED_MAIN = 'animated-main'
let ANIMATED_PARTS = 'animated-parts'

let CATEGORIES_OPENED = false
let DIFFICULTY_OPENED = false
let DIFFICULTY_SELECTED = 'CHOOSE DIFFICULTY'

const CHECKED_CATEGORIES_ARR = []
const COLORS_ARR = ['red', 'gold', 'green', 'purple', 'royalblue', 'brown', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'green', 'purple', 'red', 'blue', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'purple']

const DIFFICULTIES_ARR = ['EASY', 'MEDIUM', 'HARD']
const CATEGORIES_ARR = ['Arts & Literature', 'Film & TV', 'Food & Drink', 'General Knowledge', 'Geography', 'History'
    , 'Music', 'Science', 'Society & Culture', 'Sport & Leisure']

    
let TOTAL_TIME_PLAYED = 0
let POINTS_SCORED = 0
let SECONDS_TO_ANSWER = 10
let COUNTER = SECONDS_TO_ANSWER
let QUIZ_QUESTIONS_LEFT_TO_ANSWER = []
let CURRENT_QUESTION_OBJ = {}

function startColorChangingInterval(start = true) {

    if (!start) {
        for (const id of INTERVAL_IDS) clearInterval(id)
    }
    else {
        let colorChangingInterval = setInterval(() => {
            let randomIndexLetter = Math.floor(Math.random() * 4)
            let randomIndexColor = Math.floor(Math.random() * 10)
            nameSummoner[randomIndexLetter].style.color = COLORS_ARR[randomIndexColor]
        }, 50)
        INTERVAL_IDS.push(colorChangingInterval)
    }
}

function openOrCloseDifficulty() {
    const contentHeight = chooseDifficultyDiv.scrollHeight;

    if (!DIFFICULTY_OPENED) {
        chooseDifficultyDiv.style.height = contentHeight + 'px';
    } else {
        chooseDifficultyDiv.style.height = '0';
    }

    chooseDifficultyButton.textContent = DIFFICULTY_SELECTED

    if (chooseDifficultyButton.textContent === 'EASY') {
        containerForSelection.style.border = EASY_QUESTIONS_BORDER
        letsBeginButton.style.border = EASY_QUESTIONS_BORDER
        containerForQuestions.style.border = EASY_QUESTIONS_BORDER
        chooseDifficultyButton.style.color = 'green'
    }
    else if (chooseDifficultyButton.textContent === 'MEDIUM') {
        containerForSelection.style.border = MEDIUM_QUESTIONS_BORDER
        letsBeginButton.style.border = MEDIUM_QUESTIONS_BORDER
        containerForQuestions.style.border = MEDIUM_QUESTIONS_BORDER
        chooseDifficultyButton.style.color = 'rgb(230, 216, 67)'
    }
    else if (chooseDifficultyButton.textContent === 'HARD') {
        containerForSelection.style.border = HARD_QUESTIONS_BORDER
        letsBeginButton.style.border = HARD_QUESTIONS_BORDER
        containerForQuestions.style.border = HARD_QUESTIONS_BORDER
        chooseDifficultyButton.style.color = 'lightcoral'
    }

    DIFFICULTY_OPENED = !DIFFICULTY_OPENED;
}

function openOrCloseCategories() {
    const contentHeight = chooseCategoriesDiv.scrollHeight + 19;
    if (!CATEGORIES_OPENED) {
        chooseCategoriesDiv.style.height = contentHeight + 'px';
    } else {
        chooseCategoriesDiv.style.height = '0';
    }

    if (CHECKED_CATEGORIES_ARR.length > 0) {
        chooseCategoriesButton.textContent = ''
        if (CHECKED_CATEGORIES_ARR.length < 4) {
            for (let i = 0; i < CHECKED_CATEGORIES_ARR.length; i++) {
                if (CHECKED_CATEGORIES_ARR[0]) chooseCategoriesButton.textContent += CHECKED_CATEGORIES_ARR[i] + '   '
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                if (CHECKED_CATEGORIES_ARR[0]) chooseCategoriesButton.textContent += CHECKED_CATEGORIES_ARR[i] + '   '
            }
            chooseCategoriesButton.textContent += '...'
        }
        if (chooseCategoriesButton.textContent.length > 25) chooseCategoriesButton.style.fontSize = '15px'
        else chooseCategoriesButton.style.fontSize = '20px'
    }

    if (CHECKED_CATEGORIES_ARR.length === 0) {
        chooseCategoriesButton.textContent = 'CHOOSE CATEGORIES'
        chooseCategoriesButton.style.fontSize = '20px'
    }

    CATEGORIES_OPENED = !CATEGORIES_OPENED;
}

chooseCategoriesButton.addEventListener('click', openOrCloseCategories);
okCategoriesButton.addEventListener('click', openOrCloseCategories)

chooseDifficultyButton.addEventListener('click', openOrCloseDifficulty);


const difficultySelection = document.querySelectorAll('.difficulty')
difficultySelection.forEach(difficulty => {
    difficulty.addEventListener('click', () => {
        DIFFICULTY_SELECTED = difficulty.textContent
        openOrCloseDifficulty()
    })
})

const numberOfQuestionsSlider = document.querySelector('#questions-slider')
const numberOfQuestionsSpan = document.querySelector('#number-of-questions-span')
const amountOfQuestionsSpan = document.querySelector('#amount-of-questions-span')

amountOfQuestionsSpan.style.color = 'gold'
numberOfQuestionsSlider.borderInline = '10px solid red'

totalQuestionsDiv.textContent = numberOfQuestionsSlider.value

numberOfQuestionsSlider.addEventListener('input', () => {
    amountOfQuestionsSpan.textContent = numberOfQuestionsSlider.value

    if (numberOfQuestionsSlider.value >= 0 && numberOfQuestionsSlider.value < 10) amountOfQuestionsSpan.style.color = 'gold'
    else if (numberOfQuestionsSlider.value > 10 && numberOfQuestionsSlider.value < 20) amountOfQuestionsSpan.style.color = 'green'
    else if (numberOfQuestionsSlider.value > 20 && numberOfQuestionsSlider.value < 30) amountOfQuestionsSpan.style.color = 'blue'
    else if (numberOfQuestionsSlider.value > 30 && numberOfQuestionsSlider.value < 40) amountOfQuestionsSpan.style.color = 'purple'
    else if (numberOfQuestionsSlider.value > 40 && numberOfQuestionsSlider.value < 50) amountOfQuestionsSpan.style.color = 'red'

    totalQuestionsDiv.textContent = numberOfQuestionsSlider.value
})

const categories = document.querySelectorAll('.categories')
categories.forEach(category => {
    category.addEventListener('change', () => {
        if (category.checked) {
            CHECKED_CATEGORIES_ARR.push(category.nextElementSibling.textContent)
            category.nextElementSibling.style.color = 'lightgreen'
        }
        else {
            CHECKED_CATEGORIES_ARR.splice(CHECKED_CATEGORIES_ARR.indexOf(category.nextElementSibling.textContent), 1)
            category.nextElementSibling.style.color = 'white'
        }
        console.log(CHECKED_CATEGORIES_ARR)
    })
})

function letterByLetterResults(text, location) {
    return new Promise(res => {
        for (let i = 0; i < text.length; i++) {
            let id = setTimeout(() => {
                location.textContent += text[i]
                if (text.length === i + 1) res()
            }, i * 100);
            TIMEOUT_IDS.push(id)
        }
    })
}

function removeAnimationFromHeart() {
    heartDiv.classList.remove('animated-main-challenge')
    heartDiv.classList.remove('animated-main')
    leftSideOfHeartDiv.classList.remove('animated-parts')
    rightSideOfHeartDiv.classList.remove('animated-parts')
    leftSideOfHeartDiv.classList.remove('animated-parts-challenge')
    rightSideOfHeartDiv.classList.remove('animated-parts-challenge')
}

function setupDifficultiesAndCategory() {
    if (DIFFICULTY_SELECTED === 'CHOOSE DIFFICULTY') {
        let randomDifficulty = DIFFICULTIES_ARR[Math.floor(Math.random() * 3)]
        if (randomDifficulty === 'EASY') {
            containerForQuestions.style.border = EASY_QUESTIONS_BORDER
        }
        else if (randomDifficulty === 'MEDIUM') {
            containerForQuestions.style.border = MEDIUM_QUESTIONS_BORDER
        }
        else if (randomDifficulty === 'HARD') {
            containerForQuestions.style.border = HARD_QUESTIONS_BORDER
        }
    }
    if (CHECKED_CATEGORIES_ARR.length === 0) {
        const categoriesToRandomizeArr = [...CATEGORIES_ARR]
        while (categoriesToRandomizeArr.length > 0) {
            let randomCategory = categoriesToRandomizeArr.splice(Math.floor(Math.random() * categoriesToRandomizeArr.length), 1)
            console.log('random category this is ---- ', randomCategory)
            CHECKED_CATEGORIES_ARR.push(randomCategory[0])
        }
    }
}

function rotateLetsBeginButton(rotationDeg) {
    letsBeginButton.style.transform = rotationDeg
    letsBeginButton.style.transitionProperty = 'height, width'
    letsBeginButton.style.transition = '1s ease-in-out'
}

async function beforeQuizStarts() {

    if (!SELECTED_NAMES_ARR.includes(nicknameInput.value) && nicknameInput.value !== '') {
        SELECTED_NAMES_ARR.push(nicknameInput.value)
        localStorage.setItem('selectedNames', JSON.stringify(SELECTED_NAMES_ARR))
        updateNameSelection()
    }

    containerForSelection.style.transition = 'ease-in 1s'
    letsBeginButton.disabled = true
    finishButton.disabled = true

    removeAnimationFromHeart()

    // await pauseForHowManyMilliseconds(1010)

    setupDifficultiesAndCategory()

    fetchQuizData()

    timerInsideHeart.textContent = SECONDS_TO_ANSWER

    categories.forEach(category => category.checked = false)

    rotateLetsBeginButton('rotate(2205deg)')
    containerForSelection.style.opacity = '0'

    await pauseForHowManyMilliseconds(1000)

    POINTS_SCORED = 0
    letsBeginButton.disabled = false
    COUNTER = SECONDS_TO_ANSWER

    startColorChangingInterval(false)
    rotateLetsBeginButton('rotate(45deg)')
    containerForQuestions.style.opacity = '1'
    containerForSelection.style.display = 'none'
    containerForQuestions.style.display = 'block'
}


const letsBeginButton = document.querySelector('#lets-begin-button')
letsBeginButton.addEventListener('click', beforeQuizStarts)

function changeEverythingBackOnSelectionScreen() {
    nicknameInput.value = ''
    dialogNameInput.value = ''
    containerForEnding.style.display = 'none'
    chooseDifficultyButton.textContent = 'CHOOSE DIFFICULTY'
    chooseCategoriesButton.textContent = 'CHOOSE CATEGORIES'
    chooseCategoriesButton.style.color = 'brown'
    chooseCategoriesButton.style.fontSize = '20px'
    amountOfQuestionsSpan.innerText = (numberOfQuestionsSlider.value = 10)
    CHECKED_CATEGORIES_ARR.length = 0
    letsBeginButton.style.border = DEFAULT_QUESTIONS_BORDER
    containerForSelection.style.border = DEFAULT_QUESTIONS_BORDER
    containerForQuestions.style.border = DEFAULT_QUESTIONS_BORDER
    containerForQuestions.style.opacity = '0'
    letsBeginButton.style.transition = '0.3s ease-in-out'
    challengeModeButton.style.color = 'white'
    letsBeginButton.disabled = false
    chooseCategoriesDiv.style.height = 0
    chooseDifficultyDiv.style.height = 0

    if (normalLeaderboardTable.style.display === 'none') {
        LEADERBOARD_STATS_TYPE = 'normalLeaderboardStats'
        switchLeaderboard()
    }

    CURRENT_QUESTION_NUMBER = 1
    DIFFICULTY_SELECTED = 'CHOOSE DIFFICULTY'
    EASY_QUESTIONS_BORDER = '5px dotted green'
    MEDIUM_QUESTIONS_BORDER = "5px dotted rgb(230, 216, 67)"
    HARD_QUESTIONS_BORDER = "5px dotted lightcoral"
    CHALLENGE_ACTIVATED = false
    ANIMATED_MAIN = 'animated-main'
    ANIMATED_PARTS = 'animated-parts'
    TOTAL_TIME_PLAYED = 0

    categorySpan.forEach(category => category.style.color = 'white')
}

const resetTextAndAnimationOnSelectionScreen = () => {
    return new Promise(res => {
        let id = setTimeout(() => {
            removeAnimationFromHeart()
            containerForSelection.style.opacity = '1'
            containerForSelection.style.display = 'block'
            containerForQuestions.style.opacity = '0'
            finalScreenDiv.style.opacity = '0'
            containerForQuestions.style.display = 'none'
            chosenCategoryDiv.innerText = ''
            chosenQuestionDiv.innerText = ''
            correctOrWrongButtons.forEach(button => button.innerText = '')
            totalQuestionsDiv.innerText = 10
            SECONDS_TO_ANSWER = 10
            currentQuestionNumberDiv.textContent = 1
            correctOrWrongButtons.forEach(button => {
                button.style.pointerEvents = 'none'
                button.style.transform = 'scale(1)'
                button.disabled = true
                button.style.backgroundColor = 'transparent'
            })
            res()
        }, 1000)
        TIMEOUT_IDS.push(id)
    })
}

async function resetContainers() {

    for (const id of TIMEOUT_IDS) clearTimeout(id)
    TIMEOUT_IDS.length = 0

    changeEverythingBackOnSelectionScreen()
    startColorChangingInterval()

    await resetTextAndAnimationOnSelectionScreen()
}

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

    TIMEOUT_IDS.push(id)

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

const showQuestion = () => {
    CURRENT_QUESTION_OBJ = QUIZ_QUESTIONS_LEFT_TO_ANSWER.pop()
    let answersForUserToSelectArr = [CURRENT_QUESTION_OBJ.correctAnswer]
    CURRENT_QUESTION_OBJ.incorrectAnswers.forEach(answer => answersForUserToSelectArr.push(answer))

    let randomIndexOne = Math.floor(Math.random() * 2);
    let randomIndexTwo = Math.floor(Math.random() * 2) + 2;
    let randomIndexThree = Math.floor(Math.random() * 2);
    let randomIndexFour = Math.floor(Math.random() * 2) + 2;

    [answersForUserToSelectArr[randomIndexOne], answersForUserToSelectArr[randomIndexTwo]] = [answersForUserToSelectArr[randomIndexTwo], answersForUserToSelectArr[randomIndexOne]];
    [answersForUserToSelectArr[randomIndexThree], answersForUserToSelectArr[randomIndexFour]] = [answersForUserToSelectArr[randomIndexFour], answersForUserToSelectArr[randomIndexThree]];

    for (let i = 0; i < answersForUserToSelectArr.length; i++) {
        correctOrWrongButtons[i].innerText = answersForUserToSelectArr[i]
        if (correctOrWrongButtons[i].innerText.length < 20) correctOrWrongButtons[i].style.fontSize = '20px'
        else if (correctOrWrongButtons[i].innerText.length < 40) correctOrWrongButtons[i].style.fontSize = '18px'
        else if (correctOrWrongButtons[i].innerText.length < 60) correctOrWrongButtons[i].style.fontSize = '15px'
        else correctOrWrongButtons[i].style.fontSize = '12px'
    }

    chosenCategoryDiv.innerText = CURRENT_QUESTION_OBJ.category
    chosenQuestionDiv.innerText = ''

    finishButton.disabled = false

    currentQuestionNumberDiv.textContent = CURRENT_QUESTION_NUMBER++

    correctOrWrongButtons.forEach(button => {
        button.style.pointerEvents = 'auto'
        button.style.transform = 'scale(1)'
        button.disabled = false
    })

    if (chosenCategoryDiv.innerText.length < 50) chosenCategoryDiv.style.fontSize = '20px'
    else if (chosenCategoryDiv.innerText.length < 100) chosenCategoryDiv.style.fontSize = '15px'
    else chosenCategoryDiv.style.fontSize = '10px'
}


function writeQuestionLetterByLetter() {
    return new Promise(res => {
        for (let i = 0; i < CURRENT_QUESTION_OBJ.question.length; i++) {
            let id = setTimeout(() => {
                chosenQuestionDiv.textContent += CURRENT_QUESTION_OBJ.question[i]
                if (i === CURRENT_QUESTION_OBJ.question.length - 1) res()
            }, i * 15);
            TIMEOUT_IDS.push(id)
        }
    })
}

function addAnimationToHeart() {
    heartDiv.classList.add(ANIMATED_MAIN)
    leftSideOfHeartDiv.classList.add(ANIMATED_PARTS)
    rightSideOfHeartDiv.classList.add(ANIMATED_PARTS)
}

function pauseForHowManyMilliseconds(delay) {
    return new Promise(res => {
        let id = setTimeout(() => {
            res()
        }, delay);
        TIMEOUT_IDS.push(id)
    })
}


async function startOrResumeQuiz(resuming = false) {

    if (resuming) await pauseForHowManyMilliseconds(2000)

    for (const id of TIMEOUT_IDS) clearTimeout(id)
    TIMEOUT_IDS.length = 0

    if (COUNTER === -1) COUNTER = 0
    TOTAL_TIME_PLAYED += SECONDS_TO_ANSWER - COUNTER;
    // console.log(COUNTER);

    correctOrWrongButtons.forEach(button => {
        button.style.color = 'black'
        button.style.backgroundColor = 'whitesmoke'
    })

    removeAnimationFromHeart()

    if (QUIZ_QUESTIONS_LEFT_TO_ANSWER.length > 0) {
        showQuestion()

        await writeQuestionLetterByLetter()
        await pauseForHowManyMilliseconds(1000)

        addAnimationToHeart()
        updateLocalStorageData()
    }
    else finalScore()
}

const timerInsideHeart = document.querySelector('#timer-inside-heart')

const reduceSecondsFromTimer = () => {
    return new Promise(res => {
        for (let i = 0; i <= SECONDS_TO_ANSWER; i++) {
            let id = setTimeout(() => {
                timerInsideHeart.innerText = COUNTER--
                if (i === SECONDS_TO_ANSWER) {
                    showCorrectAnswer(CURRENT_QUESTION_OBJ)
                    res()
                }
            }, i * 1000)
            TIMEOUT_IDS.push(id)
        }
    })
}

async function updateLocalStorageData() {

    totalQuestionsDiv.innerText = numberOfQuestionsSlider.value
    COUNTER = SECONDS_TO_ANSWER
    timerInsideHeart.innerText = COUNTER

    await reduceSecondsFromTimer()
    removeAnimationFromHeart()
    await pauseForHowManyMilliseconds(2000)
    startOrResumeQuiz()

    correctOrWrongButtons.forEach(button => {
        button.style.backgroundColor = 'whitesmoke'
        button.style.color = 'black'
    })
}

function stopTimer() {
    for (const id of TIMEOUT_IDS) clearTimeout(id)
    timerInsideHeart.innerText = ''
    COUNTER = SECONDS_TO_ANSWER
}

function pauseTimer() {
    for (const id of TIMEOUT_IDS) clearTimeout(id)
}


const returnButton = document.querySelector('#return-button')
returnButton.addEventListener('click', resetContainers)

const finishButton = document.querySelector('#finish-button')
finishButton.addEventListener('click', finalScore)

async function fetchQuizData() {
    try {
        let numberOfQuestionsForURL = numberOfQuestionsSlider.value

        let difficultyForURL = DIFFICULTY_SELECTED === 'CHOOSE DIFFICULTY'
            ? DIFFICULTIES_ARR[Math.floor(Math.random() * 2)].toLowerCase()
            : DIFFICULTY_SELECTED.toLowerCase()

        let categoriesForURL = CHECKED_CATEGORIES_ARR[0]
        for (let i = 1; i < CHECKED_CATEGORIES_ARR.length; i++) {
            categoriesForURL += ',' + CHECKED_CATEGORIES_ARR[i]
        }

        categoriesForURL = categoriesForURL === undefined
            ? CATEGORIES_ARR[Math.floor(Math.random() * 10)].toLowerCase().replace(/\&/g, 'and').replace(/\s/g, '_')
            : categoriesForURL.toLowerCase().replace(/\&/g, 'and').replace(/\s/g, '_')

        let link = `https://the-trivia-api.com/api/questions?categories=${categoriesForURL}&limit=${numberOfQuestionsForURL}&difficulty=${difficultyForURL}`

        const data = await fetch(link)
        QUIZ_QUESTIONS_LEFT_TO_ANSWER = await data.json()

        if (CHALLENGE_ACTIVATED) {
            chosenCategoryDiv.innerText = "LET'S GO"
            chosenQuestionDiv.innerText = 'BRAVE HERO!'
        }
        else {
            chosenCategoryDiv.innerText = "HAVE FUN"
            chosenQuestionDiv.innerText = 'CLEVER HERO!'
        }

        await pauseForHowManyMilliseconds(2000)
        startOrResumeQuiz()
    } catch (err) {
        const errorDialog = document.querySelector('#error-dialog')
        errorDialog.showModal()
        await pauseForHowManyMilliseconds(1000)
        resetContainers()
        await pauseForHowManyMilliseconds(1000)
        errorDialog.close()
    }

}

const correctOrWrongButtons = document.querySelectorAll('.correct-or-wrong-answer-buttons')
const chosenCategoryDiv = document.querySelector('#chosen-category-div')
const chosenQuestionDiv = document.querySelector('#chosen-question-div')

correctOrWrongButtons.forEach(button => {
    button.disabled = true
})

function hideQuestionContainerRevealEndingContainer() {
    return new Promise(res => {
        let id = setTimeout(() => {
            containerForQuestions.style.display = 'none'
            containerForEnding.style.opacity = '1'
            containerForEnding.style.display = 'flex'
            containerForEnding.style.justifyContent = 'center'
            containerForEnding.style.alignItems = 'center'
            res()
        }, 1000)
        TIMEOUT_IDS.push(id)
    })
}

correctOrWrongButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(1.1)'
        correctOrWrongButtons.forEach(eachButton => {
            eachButton.style.pointerEvents = 'none'
        })
        if (button.innerText === CURRENT_QUESTION_OBJ.correctAnswer) POINTS_SCORED++

        pauseTimer()
        showCorrectAnswer(CURRENT_QUESTION_OBJ)
        startOrResumeQuiz(true)
    })
})
const containerForEnding = document.querySelector('#container-for-ending')

function makePlayerObj() {
    return {
        picture: '',
        name: nicknameInput.value,
        answered: POINTS_SCORED,
        total: Number(numberOfQuestionsSlider.value),
        correct: (POINTS_SCORED / numberOfQuestionsSlider.value * 100).toFixed(1),
        time: TOTAL_TIME_PLAYED,
        averageTime: (TOTAL_TIME_PLAYED / numberOfQuestionsSlider.value).toFixed(1)
    }
}

function revealFinalScreenDiv() {
    return new Promise(res => {
        let id = setTimeout(() => {
            finalScreenDiv.style.opacity = '1'
            res()
        }, 1000)
        TIMEOUT_IDS.push(id)
    })
}

async function finalScore() {

    let currentObj = {}

    const finalLeaderboardArr = JSON.parse(localStorage.getItem(LEADERBOARD_STATS_TYPE)) || []

    let foundPlayerObj = finalLeaderboardArr.find(obj => obj.name === nicknameInput.value)
    if (foundPlayerObj !== undefined) {
        console.log(foundPlayerObj)
        foundPlayerObj.answered += POINTS_SCORED
        foundPlayerObj.total += Number(numberOfQuestionsSlider.value)
        foundPlayerObj.correct = (foundPlayerObj.answered / foundPlayerObj.total * 100).toFixed(1)
        foundPlayerObj.time += TOTAL_TIME_PLAYED
        foundPlayerObj.averageTime = (foundPlayerObj.time / foundPlayerObj.total).toFixed(1)
        currentObj = foundPlayerObj
    }
    else {
        currentObj = makePlayerObj()
        finalLeaderboardArr.push(currentObj)
    }

    localStorage.setItem(LEADERBOARD_STATS_TYPE, JSON.stringify(finalLeaderboardArr))
    addPlayersToLeaderboard()

    let textForNickname = nicknameInput.value === '' ? 'UNKNOWN' : nicknameInput.value
    let textForPointsScored = `${POINTS_SCORED}/${numberOfQuestionsSlider.value}`
    let textForSeconds = `${TOTAL_TIME_PLAYED} seconds`

    resultNicknameDiv.innerText = ''
    resultPointsScoredDiv.innerText = (resultPointsScoredDiv.style.color = 'blue', '')
    numberOfSecondsDiv.innerText = (numberOfSecondsDiv.style.color = 'red', '')

    COUNTER = SECONDS_TO_ANSWER

    containerForQuestions.style.opacity = '0'

    if (POINTS_SCORED / numberOfQuestionsSlider.value * 100 > 75)
        containerForEnding.style.backgroundImage = `url('pictures/albert_einstein.jpg')`
    else if (POINTS_SCORED / numberOfQuestionsSlider.value * 100 > 50)
        containerForEnding.style.backgroundImage = `url('pictures/big_brain.jpg')`
    else if (POINTS_SCORED / numberOfQuestionsSlider.value * 100 > 25)
        containerForEnding.style.backgroundImage = `url('pictures/not_bad.jpg')`
    else containerForEnding.style.backgroundImage = `url('pictures/better_luck_next_time.webp')`

    for (const id of TIMEOUT_IDS) clearTimeout(id)

    await hideQuestionContainerRevealEndingContainer()

    await revealFinalScreenDiv()
    await pauseForHowManyMilliseconds(1500)

    await letterByLetterResults(textForNickname, resultNicknameDiv)
    await letterByLetterResults(textForPointsScored, resultPointsScoredDiv)
    await letterByLetterResults(textForSeconds, numberOfSecondsDiv)
}

const playAgainButton = document.querySelector('#play-again-button')

playAgainButton.addEventListener('click', () => {

    for (const id of TIMEOUT_IDS) clearTimeout(id)

    containerForEnding.style.opacity = '0'

    let id = setTimeout(() => {
        containerForEnding.style.display = 'none'
        containerForSelection.style.display = 'block'
        containerForSelection.style.opacity = '1'
        resetContainers()
        COUNTER = SECONDS_TO_ANSWER
    }, 1000);

    TIMEOUT_IDS.push(id)
})

const challengeModeButton = document.querySelector('#challenge-mode-button')
let CHALLENGE_ACTIVATED = false
challengeModeButton.addEventListener('click', () => {

    CHALLENGE_ACTIVATED = !CHALLENGE_ACTIVATED

    LEADERBOARD_STATS_TYPE = LEADERBOARD_STATS_FLAG ? 'normalLeaderboardStats' : 'challengeLeaderboardStats'
    LEADERBOARD_STATS_FLAG = !LEADERBOARD_STATS_FLAG

    containerForSelection.style.transition = 'ease-in 0.2s'

    EASY_QUESTIONS_BORDER = CHALLENGE_ACTIVATED ? '8px dotted green' : '5px dotted green'
    MEDIUM_QUESTIONS_BORDER = CHALLENGE_ACTIVATED ? '8px dotted rgb(230, 216, 67)' : '5px dotted rgb(230, 216, 67)'
    HARD_QUESTIONS_BORDER = CHALLENGE_ACTIVATED ? '8px dotted lightcoral' : '5px dotted lightcoral'
    ANIMATED_MAIN = CHALLENGE_ACTIVATED ? 'animated-main-challenge' : 'animated-main'
    ANIMATED_PARTS = CHALLENGE_ACTIVATED ? 'animated-parts-challenge' : 'animated-parts'
    SECONDS_TO_ANSWER = CHALLENGE_ACTIVATED ? 5 : 10

    letsBeginButton.style.borderWidth = CHALLENGE_ACTIVATED ? '8px' : '5px'
    containerForSelection.style.borderWidth = CHALLENGE_ACTIVATED ? '8px' : '5px'
    containerForQuestions.style.borderWidth = CHALLENGE_ACTIVATED ? '8px' : '5px'

    challengeModeButton.style.color = CHALLENGE_ACTIVATED ? 'black' : 'whitesmoke'
})

const dialogName = document.querySelector('#dialog-name')
const dialogNameInput = document.querySelector('#dialog-name-input')
const nameSelection = document.querySelector('#name-selection')
nicknameInput.addEventListener('click', () => {
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
    SELECTED_NAMES_ARR.forEach(name => {
        const newOptionName = document.createElement('option')
        newOptionName.value = name
        newOptionName.innerText = name
        newOptionName.style.fontWeight = 'bold'
        nameSelection.append(newOptionName)
    })

    localStorage.setItem('selectedNames', JSON.stringify(SELECTED_NAMES_ARR))
}

deleteNameFromTheSelection.addEventListener('click', () => {
    const selectedIndex = nameSelection.selectedIndex;
    const selectedOption = nameSelection.options[selectedIndex];
    let indexToSplice = SELECTED_NAMES_ARR.indexOf(selectedOption.innerText)

    if (indexToSplice !== -1) {
        SELECTED_NAMES_ARR.splice(indexToSplice, 1)
        updateNameSelection()
        dialogNameInput.value = nameSelection.options[0].innerText
    }
})

const resetLeaderboardButton = document.querySelector('#reset-leaderboard-button')
const leaderboardTable = document.querySelector('#normal-leaderboard-table')
function resetLeaderboardStats(resetButton = true) {

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
            newRow.appendChild(document.createElement('td')).innerText = playerObj.averageTime
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
            let fifthTd = document.createElement('td')
            firstTd.style.color = 'white'
            secondsTd.style.color = 'white'
            thirdTd.style.color = 'white'
            fourthTd.style.color = 'white'
            fifthTd.style.color = 'white'
            newRow.appendChild(firstTd).innerText = playerObj.name
            newRow.appendChild(secondsTd).innerText = playerObj.answered
            newRow.appendChild(thirdTd).innerText = playerObj.correct
            newRow.appendChild(fourthTd).innerText = playerObj.averageTime
            newRow.appendChild(fifthTd).innerText = playerObj.time
            tbody.appendChild(newRow)
        }
    })
}

const yesDecisionButton = document.querySelector('#yes-decision-button')
const noDecisionButton = document.querySelector('#no-decision-button')
const areYouSureDiv = document.querySelector('#are-you-sure-div')

yesDecisionButton.addEventListener('click', () => {
    areYouSureDiv.style.display = 'none'
    resetLeaderboardStats(LEADERBOARD_TO_RESET)
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

let LEADERBOARD_SORT_NAME_SWITCH = -1
let LEADERBOARD_SORT_ANSWERS_SWITCH = -1

function sortLeaderBoard(arr, property, switchType) {
    arr.sort((a, b) => {
        return a[property] >= b[property] ? -1 * switchType : 1 * switchType
    })
}
const tableHeaderDivs = document.querySelectorAll('.table-header-divs')
tableHeaderDivs.forEach(header => {
    header.addEventListener('click', () => {
        let leaderboardType = LEADERBOARD_TYPE_FLAG ? 'normalLeaderboardStats' : 'challengeLeaderboardStats'
        const chosenStatsArr = JSON.parse(localStorage.getItem(leaderboardType)) || []
        if (header.classList.contains('sort-by-name')) {
            sortLeaderBoard(chosenStatsArr, 'name', LEADERBOARD_SORT_NAME_SWITCH)
            LEADERBOARD_SORT_NAME_SWITCH *= -1
        }
        else if (header.classList.contains('sort-by-answers')) {
            sortLeaderBoard(chosenStatsArr, 'answered', LEADERBOARD_SORT_ANSWERS_SWITCH)
            LEADERBOARD_SORT_ANSWERS_SWITCH *= -1
        }
        else if (header.classList.contains('sort-by-percentage')) {
            sortLeaderBoard(chosenStatsArr, 'correct', LEADERBOARD_SORT_ANSWERS_SWITCH)
            LEADERBOARD_SORT_ANSWERS_SWITCH *= -1
        }
        else if (header.classList.contains('sort-by-average-time')) {
            sortLeaderBoard(chosenStatsArr, 'averageTime', LEADERBOARD_SORT_ANSWERS_SWITCH)
            LEADERBOARD_SORT_ANSWERS_SWITCH *= -1
        }
        else if (header.classList.contains('sort-by-time')) {
            sortLeaderBoard(chosenStatsArr, 'time', LEADERBOARD_SORT_ANSWERS_SWITCH)
            LEADERBOARD_SORT_ANSWERS_SWITCH *= -1
        }

        localStorage.setItem(leaderboardType, JSON.stringify(chosenStatsArr))
        addPlayersToLeaderboard()
    })
})

function switchLeaderboard() {
    const tdCells = document.querySelectorAll('td')

    if (LEADERBOARD_TYPE_FLAG) {
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

    LEADERBOARD_TO_RESET = !LEADERBOARD_TO_RESET
    LEADERBOARD_TYPE_FLAG = !LEADERBOARD_TYPE_FLAG
}

const switchLeaderboardButton = document.querySelector('#switch-leaderboard-table-button')
const normalLeaderboardTable = document.querySelector('#normal-leaderboard-table')
const challengeLeaderboardTable = document.querySelector('#challenge-leaderboard-table')
switchLeaderboardButton.addEventListener('click', switchLeaderboard)

addPlayersToLeaderboard()
updateNameSelection()
startColorChangingInterval()