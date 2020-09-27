/**
 * *slightly* simplifies regex
 * @param str 
 * @param re 
 */
export function extract(str: string, re: RegExp): string | undefined {
    if (str == undefined) return undefined;
    let out = str.match(re);
    return out && out.length > 1 ? out[1] : undefined;
}

/**
 * This still works if you have a /img-original/ link. Any other
 * link, or link that ends with '_p0_master1200.jpg' will not work.
 * 
 * It should be '/ID_p0.jpg'
 * @param url 
 * @param pages 
 */
export function explodeImagePathPages(url: string, pages: number): string[] {
    let urls: string[] = [];
    for (let i = 0; i < pages; i++) {
        let pageSpecificString = url.replace(
            /_p[0-9]+\.([a-zA-Z]+)$/,
            (_, extension) => `_p${i}.${extension}`,
        );
        urls.push(pageSpecificString);
    }
    return urls;
}

/**
 * Generate the artwork link based on the id. Useful for the double click feature.
 * @param id 
 */
export function generateImageLink(id: number): string {
    return `https://www.pixiv.net/artworks/${id}`;
}

/**
 * Generate the artist link.
 * @param id 
 */
export function generateUserLink(id: number): string {
    return `https://www.pixiv.net/users/${id}`;
}

/**
 * Rather stupid, don't expect it to handle weird URLs.
 * just looks for text after final '/'
 * @param path 
 */
export function getFileName(path: string): string {
    return path.split('/').pop()!;
}