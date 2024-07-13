import { useState } from 'react'
import './App.css'
import Button from './cmps/Button'
import Notes from './cmps/Notes'
import Diagram from './cmps/Diagram.tsx'
import Captions from './cmps/Captions'
import Loader from './cmps/Loader'

function App() {
    const [videoURL, setVideoURL] = useState('')

    const [notes, setNotes] = useState('')
    const [diagram, setDiagram] = useState('')
    const [captions, setCaptions] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const BE_URL = 'http://localhost:8080'

    async function getNotes() {
        setIsLoading(true)

        const url = BE_URL + '/notes'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoURL }),
        })
        const data = await response.json()
        console.log(data)
        setIsLoading(false)

        setNotes(data.notes)
        setDiagram('')
        setCaptions('')
    }

    async function getDiagram() {
        setIsLoading(true)

        const url = BE_URL + '/diagram'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoURL }),
        })
        const data = await response.json()
        console.log(data)
        setIsLoading(false)

        setNotes('')
        setDiagram(data.diagram)
        setCaptions('')
    }

    async function getCaptions() {
        setIsLoading(true)

        const url = BE_URL + '/captions'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoURL }),
        })
        const data = await response.json()
        console.log(data)
        setIsLoading(false)

        setNotes('')
        setDiagram('')
        setCaptions(data.captions)
    }

    return (
        <div className="container mt-[5rem]">
            <div className="w-[600px]">
                <h1 className="text-4xl mb-[3rem]">
                    Get
                    <span className="notes"> notes </span>, <span>diagrams</span>, captions from the youtube video
                </h1>
                <input
                    type="text"
                    placeholder="enter your youtube video url here"
                    className="px-[0.5rem] py-[0.5rem] border border-gray-300 rounded-md w-full"
                    onChange={(e) => setVideoURL(e.target.value)}
                    value={videoURL}
                />
                <div className="flex gap-10 justify-center">
                    <Button onclick={getNotes}>Notes</Button>
                    <Button onclick={getDiagram}>Diagram</Button>
                    <Button onclick={getCaptions}>Captions</Button>
                </div>

                <div className="flex justify-center">{isLoading && <Loader />}</div>

                <div className="mt-[2rem] mb-[5rem]">
                    <Notes notes={notes} />
                    <Diagram diagram={diagram} />
                    <Captions captions={captions} />
                </div>
            </div>
        </div>
    )
}
export default App