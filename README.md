# Pixiv Assistant

Pixiv Assistant is a chrome extension adding functionality to the popular gallery site Pixiv. It focuses on three main things.

 1. **Tag Translation**. 
 1. **Convenience and Utility**. 
 1. **Image Management**. 

The extension provides translation services and various quality of life improvements like auto expanding images and forcing high resolution manga pages. Used in concert with the downloadable executable ([paarthk/pixiv-assistant-server](https://github.com/paarthk/pixiv-assistant-server)), the extension provides bulk downloading, folder traversal, and information about images that have already been downloaded. 


# Feature Breakdown

## Tag translation

An easily searchable dictionary of tags is provided in extension's popup window. The dictionary pulls its content from a github repository (pixiv-assistant/dictionary) which is consistently updated and currently has several thousand translations. Updates to to that repository can be easily imported by users, who can edit the local copy of their dictonary as they wish.

The dictionary search filters through the dictionary entries and considers diacritics (searching `pokemon` finds `Pokémon`). Each entry in the dictionary listing also has a link to the pixiv search page for that tag. 

## Convenience and Utility

We've added some useful (hopefully) features and quality of life improvements to pixiv. What's helpful or annoying can be subjective, so all of this functionality is completely optional and can be easily disabled in the extension settings.

### Browsing
 - One-click functionality to open all the illustrations on a page in their own tabs.
    - Can optionally load the pixiv page for an illustration or just the raw illustration
 - First and Last page buttons are injected into any gallery view (search / artist works / bookmarks) next to pixiv's previous and next page buttons.
 - Thumbnails for manga pages can go directly to pixiv's manga viewer. 
 - The 'Add Bookmark' button now loads a modal, making adding an image to your bookmarks faster.
 - Artist recommendations are faded out if you have that artist in your chrome bookmarks
 - If you've got **Image Management** enabled and organize your folders by artist a button is available in a user's profile to open that artist's folder in your file explorer. 

### Image Viewing
 - Manga pages use the original maximum resolution images instead of the usual scaled down versions
 - The full-size view of an illustration is opened by default.
 - Full size views zoom to fit the window by default, making very large images easier to see.

### Downloading
 - A small toolbar is injected into each image page that allows for downloading all kinds of pixiv content.
 - Pixiv animations (Ugoira) can be downloaded as a .webm file directly from the page.
 - Manga can be downloaded as a .zip file directly from the page
 - Downloading can also work seamlessly with **Image Management** below.
 
## Image Management

As you build up a collection of downloaded images, it can be harder and harder to maintain your downloaded files and find new things you're interested in. With a downloadable partner app (paarthk/pixiv-assistant-server) Pixiv Assistant can help you keep track of things
 - Images you've already got downloaded will be faded out in gallery views, letting you know what's new and what isn't.
 - Visiting a work that's already been saved will show a button that will open the folder containing the image in your file explorer.
 - The downloading features from earlier work seamlessly with the server, including optional organizational schemes like saving to folders by organized by the image's artist.
  
# Development

The extension is written in Typescript + React. Main application logic is stored under the 'src' folder. Build-specific information (chrome vs. firefox, etc.) is set up in the vendor/ folders. The content script portion of the extension is set up as 'pages' that are dispatched to and actions defined on each page type.
