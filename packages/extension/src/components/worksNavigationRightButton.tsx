import * as React from 'react';

const FONT_STRING = '87.5% system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Hiragino Kaku Gothic ProN,Meiryo';

const WorksPageCellBlockStyles: {[key:string]: React.CSSProperties} = {
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '16px 0',
    },
    header: {
        margin: '0 8px 0 0',
        fontSize: '20px',
        fontWeight: 700,
        color: '#666',

        display: 'block',
        marginBlockStart: '0.83em',
        marginBlockEnd: '0.83em',
        marginInlineStart: '0px',
        marginInlineEnd: '0px',
    },
    badge: {
        color: 'rgba(255, 255, 255, 0.92)',
        lineHeight: 1,
        fontSize: '10px',
        fontWeight: 'bold',
        flex: '0 0 auto',
        padding: '3px 6px',
        background: 'rgba(0, 0, 0, 0.32)',
        borderRadius: '10px',

        display: 'block',
    },
    buttonCloudContainer: {
        maxWidth: '1224px',
        margin: '0px auto 48px',

        display: 'block',
        color: 'rgb(31, 31, 31)',
    },
    buttonCloud: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        margin: '0px -4px',

        color: 'rgb(31, 31, 31)',
    }
}
export const TagCellContainer: React.FC<{
    header: string;
}> = props => (
    <div>
        <div style={WorksPageCellBlockStyles.headerContainer}>
            <h2 style={WorksPageCellBlockStyles.header}>{props.header}</h2>
        </div>
        <div style={WorksPageCellBlockStyles.buttonCloudContainer}>
            <div style={WorksPageCellBlockStyles.buttonCloud}>
                {props.children}
            </div>
        </div>
    </div>
);

const TagCellStyles: {[key: string]: React.CSSProperties} = {
    outerDiv: {
        display: 'flex',
        margin: '0px 4px 8px',
        color: 'rgb(31, 31, 31)',
        font: FONT_STRING,
    },
    anchor: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '200 px',
        boxSizing: 'border-box',
        color: 'white',
        backgroundColor: 'rgb(126, 200, 200)',
        textAlign: 'center',
        padding: '9px 24px',
        borderRadius: '4px',
        textDecoration: 'none',

        cursor: 'pointer',
    },
    textDiv: {
        fontSize: '14px',
        lineHeight: '22px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipses',
        width: '100%',
        overflow: 'hidden',

        display: 'block',
        textAlign: 'center',
        cursor: 'pointer',
    }
}
export interface TagCellProps {
    text: string,
    subText?: string,
    onClick?: () => any,
}
export const TagCell: React.FC<TagCellProps> = props =>
    <div style={TagCellStyles.outerDiv}>
        <a style={TagCellStyles.anchor} onClick={props.onClick}>
            <div style={TagCellStyles.textDiv}>
                ○ {props.text}{props.subText != undefined ? <small>{props.subText}</small> : null}
            </div>
        </a>
    </div>