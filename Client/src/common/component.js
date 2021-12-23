import React from 'react'

const loading = (
    <svg style={{ padding: '10px 20px', width: '100%' }}>
        <rect x="0" y="0" width="200" height="10" style={{ fill: '#D6D6D6', fillOpacity: 1.0 }}>
            <animate attributeType="XML" attributeName="x" from="-200" to="400" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="20" width="200" height="10" style={{ fill: '#D6D6D6', fillOpacity: 0.8 }}>
            <animate attributeType="XML" attributeName="x" from="-200" to="400" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="40" width="200" height="10" style={{ fill: '#D6D6D6', fillOpacity: 0.6 }}>
            <animate attributeType="XML" attributeName="x" from="-200" to="400" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="60" width="200" height="10" style={{ fill: '#D6D6D6', fillOpacity: 0.4 }}>
            <animate attributeType="XML" attributeName="x" from="-200" to="400" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="80" width="200" height="10" style={{ fill: '#D6D6D6', fillOpacity: 0.2 }}>
            <animate attributeType="XML" attributeName="x" from="-200" to="400" dur="2.5s" repeatCount="indefinite" />
        </rect>
    </svg>
)

export { loading }