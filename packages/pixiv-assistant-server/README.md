# Pixiv Assistant (Server)

This is the optional server component of the Pixiv Assistant extension. The browser component is responsible for the user interface extensions and the translation functionality, this server component provides repository management and querying along with download functionality.

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
	
