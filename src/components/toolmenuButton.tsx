import * as React from 'react'

interface ToolmenuButtonProps {
	icon:string
	tooltip?:string
	clickAction:Function
}
export const ToolmenuButton : React.StatelessComponent<ToolmenuButtonProps> = props =>
	<li className="item">
		<span className="_icon-12" title={props.tooltip} onClick={() => props.clickAction()}>
			<span className={'pixiv-assistant'}><span className={`glyphicon ${props.icon}`}></span></span>
		</span>
	</li>
