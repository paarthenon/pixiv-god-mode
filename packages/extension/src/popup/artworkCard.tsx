import {Button, Callout, Card, Collapse, Divider, HTMLTable, Icon, Popover, Tag} from "@blueprintjs/core"
import {IllustPageInfo, IllustrationInfo} from "core/api/models"
import React, {useState} from 'react'
import {generateUserLink} from 'util/path'
import {browser} from 'webextension-polyfill-ts'
import {IDTag} from './idTag'

interface ArtworkCardProps {
    info: IllustrationInfo;
    pages?: IllustPageInfo[];
    checked: {[page: string]: boolean};
    setChecked: (checked: {[page: string]: boolean}) => void;
}

export function createChecked(amount: number, defaultVal = true) {
    const result = [...Array(amount)].reduce((acc, _, i) => {
        return {
            ...acc,
            [String(i)]: defaultVal,
        }
    }, {});
    return result;
}

// TODO: Render ID
export const ArtworkCard: React.FC<ArtworkCardProps> = ({info, pages, checked, setChecked}) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <Card className='v-spaced packed-card'>
            <div className='flex-row'>
                <div className='stunted'>
                    <Callout className='packed-callout fill'>
                        <img style={{verticalAlign: 'middle'}} src={info.urls.mini}/>
                    </Callout>
                </div>
                <Divider />
                <div className='flex-col' style={{flexGrow: 1}}>
                    <div>
                        <span className='artist-card-name'>{info.illustTitle.substr(0, 10)}</span>
                        <IDTag text={info.illustId} />
                    </div>
                    <Divider />
                    <div className='tag-list'>
                        <Tag minimal className='faded' icon='multi-select' title='Pages'>{info.pageCount}</Tag>
                        <Tag minimal className='faded' title='Likes' intent={info.likeData ? 'primary' : 'none'} icon='thumbs-up'>
                            <span style={info.likeData ? {fontWeight: 'bold'} : {}}>{info.likeCount}</span>
                        </Tag>
                        <Tag minimal className='faded' title='Bookmarks' intent={info.bookmarkData != undefined ? 'danger' : 'none'} icon='heart'>
                            <span style={info.bookmarkData != undefined ? {fontWeight: 'bold'} : {}}>{info.bookmarkCount}</span>
                        </Tag>
                        <Tag minimal className='faded' icon='eye-open' title='Views'>{info.viewCount}</Tag>

                        {info.pageCount > 1 ?
                            <Tag
                                className='faded hover-in'
                                minimal
                                icon={expanded ? 'caret-up' : 'caret-down'}
                                intent={!expanded ? 'primary' : 'danger'}
                                style={{float: 'right', cursor: 'pointer'}}
                                onClick={() => setExpanded(!expanded)}
                            />
                        : null}
                    </div>
                </div>

                {/* <Divider />
                <div className='stunted'>
                    <Button minimal large icon={<Icon icon='share' iconSize={32} style={{padding: '12px'}} />} intent='primary' onClick={() => {
                        const url = generateUserLink(parseInt(info.userId));
                        browser.tabs.create({url});
                    }} />
                </div> */}
            </div>
            <Collapse isOpen={expanded} className='detail-callout'>
                <Callout style={{borderRadius: '7px', marginTop: '10px'}}>
                    <HTMLTable condensed interactive striped className='fill extra-thin-table'>
                        <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}>Page</th>
                                <th>Dimension</th>
                                <th style={{width: '80px', minWidth: '80px'}}>
                                    <span style={{float: 'right'}}>
                                        <Button minimal small icon='small-tick' intent='primary' onClick={() => setChecked(createChecked(info.pageCount))} />
                                        /
                                        <Button minimal small icon='small-cross' intent='danger' onClick={() => setChecked(createChecked(info.pageCount, false))} />
                                    </span>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages?.map((page, i) => (

                                    <tr>
                                        <td style={{textAlign: 'center', fontWeight: 500}}>{i + 1}</td>
                                        <td style={{padding: '0 10px'}}>
                                            <Popover 
                                                position='auto-end'
                                                inheritDarkTheme={true}
                                                interactionKind='hover-target'
                                                usePortal
                                                targetClassName='fill'
                                                popoverClassName='popover-win'
                                                className='fill'
                                                content={
                                                    <img src={page.urls.thumb_mini} width={128} height={128} style={{padding: '5px'}}/>
                                                }
                                            >
                                                <span>
                                                    <Icon className='faded' icon='media' iconSize={16} intent='primary' />
                                                    <Tag className='thin-tag mono' minimal>{page.width}</Tag>
                                                    <Icon className='faded' icon='small-cross' iconSize={12} style={{verticalAlign: 'middle'}} />
                                                    <Tag className='thin-tag mono' minimal>{page.height}</Tag>
                                                </span>
                                            </Popover>
                                        </td>
                                        <td style={{width: '80px'}}>
                                            <Button
                                                fill
                                                small
                                                minimal
                                                icon={checked[String(i)] === undefined || checked[String(i)] ? 'tick' : 'cross'}
                                                intent={checked[String(i)] === undefined || checked[String(i)] ? 'primary' : 'danger'}
                                                onClick={() => {
                                                    setChecked({...checked, [String(i)]: !(checked[String(i)] ?? true)});
                                                }}
                                            />
                                        </td>
                                    </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </Callout>
            </Collapse>
        </Card>
    )
}
