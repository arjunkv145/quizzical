export default function StartQuiz({ Link }) {
    return (
        <div className="start-quiz">
            <h1 className="start-quiz--header">Quizzical</h1>
            <p className="start-quiz--description">
                Designed and developed by Arjun
            </p>
            <Link to='/quizzical/quiz'>
                <button className="start-quiz--btn">
                    Start Quiz
                </button>
            </Link>
        </div>
    )
}