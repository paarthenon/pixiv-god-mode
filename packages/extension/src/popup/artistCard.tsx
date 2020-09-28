import {Button, ButtonGroup, Callout, Card, Divider, Tag} from "@blueprintjs/core"
import {UserInfo} from "core/api/models"
import React from "react"

interface ArtistCardProps {
    info: UserInfo
}
export const ArtistCard: React.FC<ArtistCardProps> = ({info}) => {
    return (
        <Card className='v-spaced'>
            <div className='flex-row'>
                <div>
                    <Callout>
                        <img style={{verticalAlign: 'middle'}} src={info.image}/>
                    </Callout>
                </div>
                <Divider />
                <div className='flex-col'>
                    <div>
                        <span className='artist-card-name'>{info.name}</span>
                    </div>
                    <Divider />
                    <div className='tag-list'>
                        <Tag minimal intent={info.isFollowed ? 'danger' : 'none'} icon='heart' />
                        <Tag minimal icon='id-number'>{info.userId}</Tag>
                    </div>
                </div>
            </div>
        </Card>
    )
}
