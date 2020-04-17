/**
 * Pull raw assets
 */
export function getBlob(src: string): Promise<Blob> {
    let req = new XMLHttpRequest();
    req.open('GET', src);
    req.responseType = 'blob';
    req.send();
    return new Promise<Blob>((resolve, reject) => {
        req.addEventListener('load', () => resolve(req.response));
        req.addEventListener('error', err => reject(err));
    });
}
