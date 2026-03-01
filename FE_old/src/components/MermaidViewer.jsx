import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#e0e7ff',
        primaryTextColor: '#1e3a8a',
        primaryBorderColor: '#6366f1',
        lineColor: '#6366f1',
        secondaryColor: '#fef3c7',
        tertiaryColor: '#fff',
        fontFamily: 'inherit'
    },
    securityLevel: 'loose'
});

export default function MermaidViewer({ chart }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (chart && containerRef.current) {
            // Give it a unique ID to prevent conflicts in React strict mode
            const id = `mermaid-${Math.random().toString(36).substring(7)}`;
            try {
                mermaid.render(id, chart).then((result) => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = result.svg;
                    }
                }).catch(err => {
                    console.error("Mermaid error:", err);
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `<div style="color:red; padding: 1rem;">Invalid Flowchart</div>`;
                    }
                });
            } catch (error) {
                console.error("Mermaid parsing error", error);
            }
        }
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="mermaid-container hide-scrollbar"
            style={{
                overflowX: 'auto',
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--p-border)',
                margin: '1.5rem 0',
                display: 'flex',
                justifyContent: 'center'
            }}
        />
    );
}
