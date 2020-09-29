import {Button, ButtonGroup, Callout, Card, Divider, Icon, Tag} from "@blueprintjs/core"
import {getUserFollowers} from 'core/API'
import {UserFollowerInfo, UserInfo, UserProfile} from "core/api/models"
import React, {useEffect, useMemo, useState} from "react"
import {generateUserGalleryLink, generateUserLink} from 'util/path'
import {browser} from 'webextension-polyfill-ts'
import {IDTag} from './idTag'
import {values} from 'lodash';
import {TagButton} from './tagButton'
interface ArtistCardProps {
    info: UserInfo
    profile: UserProfile
}
export const ArtistCard: React.FC<ArtistCardProps> = ({info, profile}) => {
    const [followers, setFollowers] = useState<UserFollowerInfo>();
    useEffect(() => {
        // load all the shit
        getUserFollowers(parseInt(info.userId)).then(resp => {
            setFollowers(resp.body);
        });
    }, []);

    const totalIllust = useMemo(() => profile ? values(profile.illusts).length : undefined, [profile]); 
    const totalManga = useMemo(() => profile ? values(profile.manga).length : undefined, [profile]); 
    const totalNovels = useMemo(() => profile ? values(profile.novels).length : undefined, [profile]); 
    const totalWorks = useMemo(() => 
        (totalIllust ?? 0) + 
        (totalManga ?? 0) + 
        (totalNovels ?? 0)
    , [totalIllust, totalManga, totalNovels]);
    return (
        <Card className='v-spaced packed-card'>
            <div className='flex-row'>
                <div className='stunted'>
                    <Callout className='packed-callout fill'>
                        <img style={{verticalAlign: 'middle'}} src={info.image}/>
                    </Callout>
                </div>
                <Divider />
                <div className='flex-col' style={{flexGrow: 1}}>
                    <div>
                        <span className='artist-card-name'>{info.name}</span>
                        <IDTag text={info.userId} />
                    </div>
                    <Divider />
                    <div className='tag-list'>
                        <Tag minimal className='faded' intent={info.isFollowed ? 'danger' : 'none'} icon='heart'>
                            <span style={info.isFollowed ? {fontWeight: 'bold'} : {}}>{followers ? followers.total : '...'}</span>
                        </Tag>
                        <TagButton icon='media' title='Illustrations' text={totalIllust ?? '...'} onClick={() => browser.tabs.create({url: generateUserGalleryLink(parseInt(info.userId), 'illustrations')})} />
                        <TagButton icon='control' title='Manga' text={totalManga ?? '...'} onClick={() => browser.tabs.create({url: generateUserGalleryLink(parseInt(info.userId), 'manga')})} />
                        <TagButton icon='git-repo' title='Novels' text={totalNovels ?? '...'} onClick={() => browser.tabs.create({url: generateUserGalleryLink(parseInt(info.userId), 'novels')})} />
                    </div>
                </div>
                <Divider />
                <div className='stunted'>
                    <Button minimal large icon={<Icon icon='user' iconSize={32} style={{padding: '10px'}} />} intent='primary' onClick={() => { // user, 
                        const url = generateUserLink(parseInt(info.userId));
                        browser.tabs.create({url});
                    }} />
                </div>
            </div>
        </Card>
    )
}
