let data = [
    {
        question: 'Who is The president of the USA',
        1: 'Obama',
        2: 'Biden',
        3: 'Trump',
        4: 'Bush',
        trueOne: '2',
    },
    {
        question: 'Which Programming Lnaguage is for web back-end development',
        1: 'Java',
        2: 'Go',
        3: 'C++',
        4: 'PHP',
        trueOne: '4'
    },
    {
        question: 'Which field does Hadi Choopan trains',
        1: 'Football',
        2: 'Weight Lifting',
        3: 'Body Building',
        4: 'Power Lifting',
        trueOne: '3',
    },
    {
        question: 'Whos is Ryan Gosling',
        1: 'Footballist',
        2: 'Model',
        3: 'Artist',
        4: 'Actor',
        trueOne: '4',
    },
    {
        question: 'Javascript\'s Company',
        1: 'Google',
        2: 'Microsoft',
        3: 'Amazon',
        4: 'Ecma',
        trueOne: '4',
    }
]
const con = document.querySelector('.container')
const sButton = document.getElementById('start')
const main = document.querySelector('main')
const question = document.querySelector('.question-title')
const options = document.querySelectorAll('.option')
const nextButton = document.getElementById('btn-next')
const preButton = document.getElementById('btn-pre')
const timer = document.querySelector('.timer')

let _wAudio = new Audio('js/wrong.mp3')
let _rAudio = new Audio('js/correct.mp3')
let _tAudio = new Audio('js/ticking.mp3')


let getAnswer = []

data.forEach((value) => {
    value.time = 0
})

let globalFlag = 0
let ansCount = 0
let timeId
let interId
let duration = 10000
let interval = duration / 1000
let sPassed = 0

sButton.addEventListener('click', ()=>{
    sButton.style.display= 'none'
    con.style.display= 'flex'
    setQuestion(0, 0)
})

nextButton.addEventListener('click', () => {
    if (globalFlag < (data.length) - 1) {
        data[globalFlag].time += sPassed
        sPassed = 0
        globalFlag++

        clearTimeout(timeId)
        if (timerCheck(globalFlag)) {
            clearInterval(interId)
            interval = (duration / 1000) - data[globalFlag].time / 1000
            timer.innerHTML = interval
        } else {
            clearInterval(interId)
            interval = 0
            timer.innerHTML = interval
        }
        setQuestion()
        loadState()
    }
})

preButton.addEventListener('click', () => {
    if (globalFlag > 0) {
        data[globalFlag].time += sPassed
        sPassed = 0
        globalFlag--

        clearTimeout(timeId)
        if (timerCheck(globalFlag)) {
            clearInterval(interId)
            timer.innerHTML = interval
            interval = (duration / 1000) - data[globalFlag].time / 1000
        } else {
            clearInterval(interId)
            interval = 0
            timer.innerHTML = interval
        }
        setQuestion()
        loadState()
    }
})

options.forEach(option => {
    option.addEventListener('click', () => {
        let selected = option.getAttribute('data-op')
        data[globalFlag].isAnsewered = true
        data[globalFlag].whichSelected = selected
        clicked = data[globalFlag].whichSelected
        if (validation(selected)) {
            getAnswer.push({
                state: true,
                question: data[globalFlag].question,
                answer: clicked
            })
            _rAudio.volume = .5
            _rAudio.play()
        } else {
            getAnswer.push({
                state: false,
                question: data[globalFlag].question,
                answer: clicked,
                trueOne: data[globalFlag].trueOne
            })
            _wAudio.volume = .1
            _wAudio.play()
        }
        clearTimeout(timeId)
        interval = 0
        clearInterval(interId)
        timer.innerHTML = interval
        State(ansCount)
        ansCount++
    })
})


// ***** Functions ***** //
function setQuestion() {
    _tAudio.play()
    _tAudio.volume = .5
    if (!data[globalFlag].isAnsewered) {
        timeId = setTimeout(() => {
            getAnswer.push({
                state: 'timeout',
                question: data[globalFlag].question,
                answer: data[globalFlag].trueOne,
            })
            data[globalFlag].isAnsewered == true
            State(ansCount)
            ansCount++
            _wAudio.volume = .1
            _wAudio.play()
        }, duration - data[globalFlag].time)
    }
    timer.innerHTML = interval

    reset()
    btnCheck()

    let q = data[globalFlag]
    question.innerHTML = q.question
    // set attribute for saving question index
    options.forEach(option => {
        let opt = option.getAttribute('data-op')
        option.innerHTML = data[globalFlag][opt]
    })
    countdown(globalFlag)
}
// validate the answer
function validation(entry) {
    if (data[globalFlag].trueOne == entry) {
        return true
    } else {
        return false
    }
}

function State(stateFlag) {
    if (getAnswer[stateFlag].state == true) {
        options[getAnswer[stateFlag].answer - 1].classList.add('right')
        _tAudio.play()
        _tAudio.pause()
    } else if (getAnswer[stateFlag].state == 'timeout') {
        options[getAnswer[stateFlag].answer - 1].classList.add('timeout')
        _tAudio.play()
        _tAudio.pause()
    }
    else {
        options[getAnswer[stateFlag].answer - 1].classList.add('wrong')
        options[getAnswer[stateFlag].trueOne - 1].classList.add('right')
        _tAudio.play()
        _tAudio.pause()
    }
    options.forEach((option, index) => {
        if (index != getAnswer[stateFlag].answer - 1 && index != getAnswer[stateFlag].trueOne - 1) {
            option.classList.add('not-chosen')
        }
    })
}

function loadState() {
    getAnswer.forEach((value, index) => {
        if (question.innerHTML == value.question) {
            State(index)
        }
    })
}

function reset() {
    options.forEach(option => {
        option.classList.remove('wrong')
        option.classList.remove('right')
        option.classList.remove('not-chosen')
        option.style.pointerEvents = 'auto'
        option.classList.remove('timeout')
    })
    // _tAudio.pause()
}

function btnCheck() {
    if (globalFlag == data.length - 1) {
        nextButton.style.opacity = '0'
        nextButton.style.display = 'none'
    }
    else {
        nextButton.style.opacity = '1'
        nextButton.style.display = 'inline-block'
    }

    if (globalFlag == 0) {
        preButton.style.display = 'none'
    } else {
        preButton.style.display = 'inline-block'
    }
}

function countdown() {
    interId = setInterval(() => {
        if (interval > 0) {
            interval--
            timer.innerHTML = interval
            sPassed += 1000
        }
    }, 1000);
}

function timerCheck(q) {
    return !data[q].isAnsewered ? true : false
}