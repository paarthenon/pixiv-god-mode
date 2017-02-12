import * as React from 'react'

export const CountBadge : React.StatelessComponent<{text:string}> =
    ({text}) => <span className="count-badge">{text}</span>
