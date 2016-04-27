# Pixiv Assistant (Server)

The optional server component of the Pixiv Assistant extension. The browser component is responsible for the user interface extensions and the translation functionality, this server component provides several complementary features.

The server supports:
* Single and bulk downloading of images
* Opening of either the repository folder or a direct artist folder in the default system file browser
* Reporting status of already downloaded images so that the browser extension can hide them

If building yourself, run as 

	npm start -- --repo [artist|flat] --path <path>
	
Otherwise, run as

	./pixiv-assistant-server --repo [artist|flat] --path <path>

Where path is the local or fixed path of the root folder of the repository.

The Artist repo option assumes the folders are structured as:

	repo/[<artist.id>] - <artist.name>/<image>

The flat repo makes no assumptions, but will create a db.json file with the information that it has collected on folder structure on program exit. This file exists to avoid having to reload the folder structure every execution of the program. 

## To Build

	npm install
	tsd install
	gulp
	
