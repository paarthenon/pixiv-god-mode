// import {IllustrationType} from 'core/api/models'
// import {PageContext} from 'page/context'
// import React from 'react'
// import {generateUserLink} from 'util/path'
// import {match} from 'variant'


// const typeLabel = (type: IllustrationType) => {
//     switch(type) {
//         case IllustrationType.Manga: return 'Manga';
//         case IllustrationType.Animation: return 'Animation (Ugoira)';
//         case IllustrationType.Picture: return 'Illustration';
//     }
// }
// interface PageContextReportProps {
//     ctx: PageContext
// }
// export const PageContextReport: React.FC<PageContextReportProps> = ({ctx}) => {
//     return (
//         <div>
//             {match(ctx, {
//                 Artwork: ({illustInfo}) => <>
//                     <ul>
//                         <li>
//                             <strong>ID</strong>: {illustInfo.illustId}
//                         </li>
//                         <li>
//                             <strong>Title</strong>: {illustInfo.illustTitle}
//                         </li>
//                         <li>
//                             <strong>Type</strong>: {typeLabel(illustInfo.illustType)}
//                         </li>
//                         <li>
//                             <strong>Pages</strong>: {illustInfo.pageCount}
//                         </li>
//                         <li>
//                             <strong>Artist</strong>: 
//                             <a href={generateUserLink(parseInt(illustInfo.userId))}>{illustInfo.userName} ({illustInfo.userId})</a>
//                         </li>

//                         <li>
//                             <strong>Likes</strong>: {illustInfo.likeCount}
//                         </li>
//                         <li>
//                             <strong>Bookmarks</strong>: {illustInfo.bookmarkCount}
//                         </li>
//                         <li>
//                             <strong>Views</strong>: {illustInfo.viewCount}
//                         </li>
//                     </ul>
//                 </>,
//                 Default: ({url}) => <>
//                     <b>URL</b> {url}
//                 </>,
//             })}
//         </div>
//     )
// }
