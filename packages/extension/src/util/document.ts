import {Rectangle} from './geometry';

// export function hackedNewTab(jQ: JQueryStatic, url: string) {
//     jQ(`<a target="_blank" href="${url}"></a>`)[0].click();
// }

// export function hackedDL(jQ: JQueryStatic, url: string) {
//     jQ(`<a href="${url}"></a>`)[0].click();
// }

/**
 * Spawns a canvas element and renders a dataUrl to it as an image.
 * 
 * This will let us scrape the canvas's currently rendered screen to get
 * loaded image data.
 * @param dataUrl 
 * @param dims 
 */
export function spawnCanvas(dataUrl: string, dims: Rectangle): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        let invisiCanvas = document.createElement('canvas') as HTMLCanvasElement;
        invisiCanvas.width = dims.width;
        invisiCanvas.height = dims.height;
        let context = invisiCanvas.getContext('2d');

        let img = new Image();
        img.addEventListener('load', () => {
            context!.drawImage(img, 0, 0, invisiCanvas.width, invisiCanvas.height);
            resolve(invisiCanvas);
        });
        img.addEventListener('error', err => {
            reject(err);
        });
        img.src = dataUrl;
    });
}

// export function awaitElement<E extends HTMLElement = HTMLElement>(
//     selector: string,
//     baseElement = document.body,
// ): Promise<JQuery<E>> {

//     return awaitUntil(() => {
//         const $elem = $(selector);
//         if ($elem && $elem.length > 0) {
//             return $elem as JQuery<E>;
//         } else {
//             return false;
//         }
//     }, baseElement);
// }

// export function awaitUntil<E extends HTMLElement = HTMLElement>(
//     condition: () => JQuery<E> | false,
//     baseElement = document.body,
// ): Promise<JQuery<E>> {
//     if (baseElement == undefined) {
//         return Promise.reject('No root element');
//     }
//     return new Promise(resolve => {
//         const $prospect = condition();
//         if ($prospect && $prospect.length > 0) {
//             resolve($prospect);
//         }
//         new MutationObserver((_list, _obs) => {
//             log.debug('Mutation observed from', baseElement);
//             log.debug('Mutation log:', _list);

//             const removed = _list
//                 .filter(
//                     m =>
//                         m.removedNodes.length > 0 &&
//                         $(m.removedNodes[0]).hasClass('pixiv-assistant'),
//                 )
//                 .map(m => m.removedNodes[0]);
//             if (removed.length > 0) {
//                 log.warn('removed list includes pixiv assistant app', removed);
//             }

//             const $elem = condition();
//             if ($elem) {
//                 _obs.disconnect();
//                 resolve($elem);
//             }
//         }).observe(baseElement, {
//             childList: true,
//             subtree: true,
//         });
//     });
// }
