import React, { useReducer } from "react"
import Question from "./Question"
import Options from "./Options"
import Loading from "./Loading"

const initialQuiz = {
    quizData: [],
    isDataFetched: false,
    fetchApiToggle: false,
    isQuizFinished: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'NEW QUIZ DATA':
            return ({ 
                ...state, 
                isDataFetched: true, 
                quizData: action.data.map(d => ({
                    question: d.question,
                    options: shuffleOptions(d.correct_answer, d.incorrect_answers)
                }))
            })
        case 'SELECTING AN OPTION':
            const { question, option } = action
            return ({
                ...state,
                quizData: state.quizData.map(q => {
                    return q.question === question ? {
                        ...q,
                        options: q.options.map(opt => {
                            return opt.option === option ? 
                                {...opt, selected: !opt.selected} :
                                {...opt, selected: false}
                        })
                    } : q
                })
            })
        case 'QUIZ FINISHED STATUS':
            return { ...state, isQuizFinished: !state.isQuizFinished }
        case 'PLAY AGAIN':
            return ({ 
                ...state, 
                isQuizFinished: !state.isQuizFinished, 
                isDataFetched: false, 
                fetchApiToggle: !state.fetchApiToggle 
            })
        default:
            return state
    }
}

function shuffleOptions(correct, incorrect) {
    const randomIndex = Math.floor(Math.random() * 4)
    let incorrectArrIndex = -1
    return Array(4).fill(null).map((item, index, array) => {
        if(index === randomIndex) {
            return {option: correct, correct: true, selected: false}
        }
        incorrectArrIndex++
        return {option: incorrect[incorrectArrIndex], correct: false, selected: false}
    })
}

export default function Quiz() {
    const [quiz, dispatch] = useReducer(reducer, initialQuiz)
    const { quizData, isDataFetched, fetchApiToggle, isQuizFinished } = quiz

    React.useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5&category=31&difficulty=easy&type=multiple')
            .then(res => res.json())
            .then(data => dispatch({ type: 'NEW QUIZ DATA', data: data.results }))
            .catch(err => console.log(err))
    }, [fetchApiToggle])

    const quizHtml = quizData.map(q => {
        return <div key={q.question} className="quiz">
                    <Question question={q.question}/>
                    <div className="quiz--options">
                        {
                            !isQuizFinished ? getOptions(q.question, q.options) :
                            checkOptions(q.options)
                        }
                    </div>
                </div>
    })

    function checkScore() {
        let score = 0
        quizData.forEach(({ options }) => {
            if(options.find(option => option.selected)) {
                options.forEach((option) => {
                    if(option.selected && option.correct) score++
                })
            }
        })
        return score
    }
    
    function getOptions(question, options) {
        return options.map(({option, selected}) => {
            const className = selected ? 'option selected' : 'option'
            return (
                <Options 
                    key={option} 
                    className={className} 
                    option={option}
                    selectOption={() => selectOption(question, option)}
                />
            )
        })
    }
    
    function checkOptions(options) {
        return options.map(({option, correct, selected}, i, arr) => {
            let className
            if(arr.find(option => option.selected)) {
                if(correct) className = "option-check correct"
                else if(selected && !correct) className = "option-check incorrect"
                else className = "option-check transparent"
            }
            else {
                className = "option-check transparent"
            }
            return (
                <Options 
                    key={option} 
                    className={className} 
                    option={option}
                />
            )
        })
    }
    
    function selectOption(question, option) {
        dispatch({ type: 'SELECTING AN OPTION', question: question, option: option })
    }
    
    function toggleIsQuizFinished() {
        dispatch({ type: 'QUIZ FINISHED STATUS' })
    }
    
    function playAgain() {
        dispatch({ type: 'PLAY AGAIN' })
    }

    return (
        <div className="quiz-container">
            {
                !isDataFetched ? <Loading /> :
                <>
                    <h1 className="quiz-container--header">Quizzical</h1>
                    {quizHtml}
                    {
                        !isQuizFinished ? (
                            <button className="quiz-check-options" onClick={toggleIsQuizFinished}>
                                Check answers
                            </button>
                        ) : (
                            <div className="quiz-results">
                                <span className="quiz-results--score">
                                    You scored {checkScore()}/{quizData.length} correct answers
                                </span>
                                <button className="quiz-results--play-again" onClick={playAgain}>
                                    Play Again
                                </button>
                            </div>
                        )
                    }
                </>
            }
        </div>
    )
}