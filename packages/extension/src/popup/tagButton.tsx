import {IconName, Tag} from '@blueprintjs/core'
import React, {ReactText} from 'react'

interface TagButtonProps {
    icon?: IconName;
    text?: ReactText;
    title?: string;
    onClick?: () => void;
    className?: string;
}
export const TagButton: React.FC<TagButtonProps> = ({
    icon,
    text,
    title,
    onClick,
    className
}) => {
    return (
        <Tag
            minimal
            icon={icon}
            onClick={onClick}
            className={className + ' faded'}
            style={{cursor: 'pointer'}}
            title={title}
        >
            {text}
        </Tag>
    )
}
