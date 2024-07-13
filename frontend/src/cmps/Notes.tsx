function Notes({ notes }) {
    notes = notes.split('\n').join('')
    notes = notes.split('-')

    if (!notes) return null
    return (
        <ul>
            {notes.map((note, index) => {
                if (index !== 0)
                    return (
                        <li className="list-disc" key={index}>
                            {note}
                        </li>
                    )
            })}
        </ul>
    )
}

export default Notes