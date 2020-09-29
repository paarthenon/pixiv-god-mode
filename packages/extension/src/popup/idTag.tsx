import {Tag} from '@blueprintjs/core'
import React from 'react'

interface IDTagProps {
    text: string;
    title?: string;
}
export const IDTag: React.FC<IDTagProps> = ({text, title}) => {
    return (
        <Tag minimal icon='barcode' title={title} className='faded' style={{marginLeft: '5px', verticalAlign: 'text-bottom'}}>{text}</Tag>
    )
}
