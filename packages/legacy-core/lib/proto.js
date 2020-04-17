"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Features = {
    OpenToRepo: 'openRepo',
    OpenToArtist: 'openArtist',
    OpenToImage: 'openImageFolder',
    DownloadImage: 'downloadImage',
    DownloadManga: 'downloadManga',
    DownloadAnimation: 'downloadAnimation',
    ImageExists: 'imageExists',
    ImagesExist: 'imagesExist',
    ListArtists: 'listArtists'
};
var Messages;
(function (Messages) {
    function isPositiveResponse(resp) {
        return resp.success;
    }
    Messages.isPositiveResponse = isPositiveResponse;
    function isNegativeResponse(resp) {
        return !resp.success;
    }
    Messages.isNegativeResponse = isNegativeResponse;
})(Messages = exports.Messages || (exports.Messages = {}));
