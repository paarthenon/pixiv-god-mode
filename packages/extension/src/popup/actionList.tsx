import {Button, ButtonGroup} from '@blueprintjs/core'
import {PageAction} from 'page/pageAction'
import React from 'react'

interface ActionListProps {
    actions: PageAction[];
    onClick?: (action: PageAction) => void;
}
export const ActionList: React.FC<ActionListProps> = ({actions, onClick}) => {
    return (
        <ButtonGroup fill vertical large minimal>
            {actions.map(action => <PageActionButton key={action.type} action={action} onClick={onClick} />)}
        </ButtonGroup>
    )
}

interface PageActionButtonProps {
    action: PageAction
    onClick?: (action: PageAction) => void;
}
export const PageActionButton: React.FC<PageActionButtonProps> = ({action, onClick}) => {
    return (
        <Button
            intent='primary'
            text={action.label}
            icon={action.icon}
            rightIcon={<span className='hellish' style={{fontStyle: 'italic', fontSize: '80%'}}>{action.subtitle}</span>} 
            onClick={() => onClick?.(action)}
        />
    )
}
