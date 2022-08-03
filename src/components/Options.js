export default function Options({className, option, selectOption}) {
    return (
        selectOption ? 
            <button className={className} onClick={selectOption}>
                {option}
            </button> 
        : 
            <button className={className}>
                {option}
            </button>
    )
}