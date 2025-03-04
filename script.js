const dateField = document.getElementById('date')
const timeField = document.getElementById('time')
const addBtn = document.getElementById('add')

function getTime() {
    let date = new Date()
    let day = date.getDate()
    let suffix = (day >= 11 && day <= 13) ? 'th'
               : day % 10 === 1 ? 'st' 
               : day % 10 === 2 ? 'nd'
               : day % 10 === 3 ? 'rd'
               : 'th'
    
    let month = date.toLocaleString('default', { month: 'long' })
    let year = date.getFullYear()
    let time = date.toLocaleTimeString('default', { hour12: false })

    dateField.innerText = `${month} ${day}${suffix} ${year}`
    timeField.innerHTML = time
}

setInterval(getTime, 1000)

addBtn.addEventListener('click', addNote)

async function addNote() {
    const newNoteContent = document.getElementById('newNote').value

    if (!newNoteContent) {
        return alert("Content is required")
    }

    try {
        const response = await fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newNoteContent }),
        })

        if (response.ok) {
            console.log('Note added')
            fetchNotes()
        }
    } catch (error) {
        console.error('Error adding note:', error)
    }

    document.getElementById('newNote').value = '' 
}

async function fetchNotes() {
    try {
        const response = await fetch('http://localhost:3000/notes')
        const notes = await response.json()

        displayNotes(notes)
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
}

function displayNotes(notes) {
    const notesContainer = document.getElementById('notes-container')
    notesContainer.innerHTML = ''

    notes.forEach(note => {
        const noteElement = document.createElement('div')
        noteElement.classList.add('noteElement')

        const noteContent = document.createElement('div')
        noteContent.classList.add('noteContent')
        
        const noteText = document.createElement('p')
        noteText.classList.add(note.status === 'completed' ? 'completed' : 'active', 'noteText')
        noteText.textContent = note.content
                
        const markCompletedCheckbox = document.createElement('input')
        markCompletedCheckbox.type = 'checkbox'
        markCompletedCheckbox.checked = note.status === 'completed'
        markCompletedCheckbox.onchange = async () => {
            const newStatus = markCompletedCheckbox.checked ? 'completed' : 'active'
            try {
                await updateNoteStatus(note.id, newStatus)
            } catch (error) {
                console.error('Error updating status:', error)
            } 
            markCompletedCheckbox.checked = newStatus === 'completed' 
        }
        markCompletedCheckbox.classList.add('markCompletedCheckbox')

        const deleteBtn = document.createElement('button')
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`
        deleteBtn.onclick = () => softDelete(note.id)
                
        noteContent.appendChild(markCompletedCheckbox)
        noteContent.appendChild(noteText)
        noteElement.appendChild(noteContent)
        noteElement.appendChild(deleteBtn)
        notesContainer.appendChild(noteElement)
    })
}

async function updateNoteStatus(id, status) {
    const endpoint = status === 'completed' 
        ? `http://localhost:3000/notes/complete/${id}` 
        : `http://localhost:3000/notes/active/${id}`

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log(`Note status updated to ${status}`);
            fetchNotes();
        }
    } catch (error) {
        console.error('Error updating note status:', error);
    }
}


async function softDelete(id) {
    try {
        const response = await fetch(`http://localhost:3000/notes/delete/${id}`, {
            method: 'PUT',
        });

        if (response.ok) {
            console.log('Note marked as soft deleted');
            fetchNotes()
        }
    } catch (error) {
        console.error('Error soft deleting note:', error)
    }
}

document.getElementById('add').addEventListener('click', addNote)
document.addEventListener('DOMContentLoaded', fetchNotes)
