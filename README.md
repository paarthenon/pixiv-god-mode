# Pixiv Assistant

Pixiv Assistant is a chrome extension adding functionality to the popular gallery site Pixiv. The extension provides translation services and various quality of life improvements like auto expanding images and forcing high resolution manga pages. Used in concert with the downloadable executable ([paarthk/pixiv-assistant-server](https://github.com/paarthk/pixiv-assistant-server)), the extension provides bulk downloading, folder traversal, and information about images that have already been downloaded. 

## **Warning**: Pixiv Assistant is currently under heavy development

# Translation features

There are two dictionaries maintained by the extension. 

One is a global dictionary provided by the pixiv-assistant/dictionary repository. This is shared among all users and provides sane translations for many of the most popular tags on Pixiv. This dictionary is managed in the control panel. This is a github repo and takes pull requests, please feel free to submit translations. 

The other is a locally stored user dictionary for any definitions that the global dictionary may not provide. The user dictionary takes priority over the global dictionary, meaning users can override translations from the global dictionary with their own custom translations

#Project Features (WIP)

## Tag translation

Last and first page buttons will be injected where possible.

## Global

### Control Panel

## Works page

 * First and Last page buttons
 * Open to artist folder
 * Open all images in new tabs
 * (with server) downloaded images are faded out

## Illustration page

 * Autoexpand image
 * Open artist repo
 * Download artist image
 * Download zip file of animation frames if on animation page

## Manga page

 * Automatically switch to original size images instead of the usual scaled down versions
 * Bulk downloading of every page

## Artist Bookmarks Page

 * First and last page buttons
 * Open to artist folder
 * (with server) downloaded images are faded out

## Follow Artist page

 * Recommendations for similar artists will fade out if you already have that artist bookmarked

## Bookmark Illustration page

 * Action to load all recommended images
 * (with server) downloaded images are faded out
  
# Development

The extension is written in Typescript + React. Main application logic is stored under the 'src' folder. Build-specific information (chrome vs. firefox, etc.) is set up in vendor/<vendor> folders and loaded into the app's bootstrap function. There are a collection of page definitions that are dispatched depending on the url path.
