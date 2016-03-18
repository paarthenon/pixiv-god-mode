# Pixiv Assistant (Userscript)
[![Build Status](https://travis-ci.org/paarthk/pixiv-assistant.svg?branch=master)](https://travis-ci.org/paarthk/pixiv-assistant)

Pixiv Assistant is an extension to the popular gallery site Pixiv providing translation services and quality of life improvements. Used in concert with the downloadable executable, the extension provides some repository management functionality. 

# Translation features

There are two dictionaries maintained by the extension. 

One is a global dictionary provided by the pixiv-assistant/dictionary repository. This is shared among all users and provides sane translations for many of the most popular tags on Pixiv. This dictionary is managed in the control panel. This is a github repo and takes pull requests, please feel free to submit translations. 

The other is a locally stored user dictionary for any definitions that the global dictionary may not provide. The user dictionary takes priority over the global dictionary, meaning users can override the global translation with one of their own locally.

# Page Features

## Global

### Control Panel

### Add Translation

A small modal to immediately add a translation to the user dictionary. On pages that focus on a specific tag (the search page for a single tag, the member tag works page) the modal will automatically load with the Japanese text and a machine translation to English.

## Search Page

 * Jump to last page

## Works page

 * Jump to last page
 * Open to artist folder
 * Open all images in new tabs

## Illustration page

 * Autoexpand image
 * Open artist repo
 * Download artist image

## Manga page

 * Automatically switch to expanded images
 