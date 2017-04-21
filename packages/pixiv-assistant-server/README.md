# Pixiv Assistant (Server)

The optional server component of the Pixiv Assistant extension. The browser component is responsible for the user interface extensions and the translation functionality, this server component provides several complementary features.

The server supports:
* Single and bulk downloading of images
* Opening of either the repository folder or a direct artist folder in the default system file browser
* Reporting status of already downloaded images so that the browser extension can hide them

## To Build

	npm install
	tsd install
	gulp
	
