import {Card} from "@blueprintjs/core"
import {IllustrationInfo} from "core/api/models"
import React from 'react'

interface ArtworkCardProps {
    info: IllustrationInfo
}
export const ArtworkCard: React.FC<ArtworkCardProps> = ({info}) => {
    return (
        <Card className='v-spaced'>
            <img src={info.urls.thumb}></img>
            {info.illustId} | {info.illustTitle}
        </Card>
    )
}
