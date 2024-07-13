import mermaid from 'mermaid'
import React, { useEffect, useRef } from 'react'

function Diagram({ diagram }) {
    const ref = useRef(null)

    useEffect(() => {
        mermaid.mermaidAPI.initialize({
            startOnLoad: true,
            securityLevel: 'loose',
            theme: 'default',
            logLevel: 5,
        })
        console.log('mermaid initialized')
    }, [])

    useEffect(() => {
        async function attachDiagram() {
            const { svg } = await mermaid.mermaidAPI.render('preview', diagram)
            console.log('here is the svg' + svg)
            console.log(ref.current)

            //@ts-ignore
            ref.current.innerHTML = svg
        }

        if (ref.current !== null && diagram !== '') {
            attachDiagram()
        }
    }, [diagram])

    if (diagram === '') return null

    return <div key="preview" ref={ref}></div>
}

export default Diagram