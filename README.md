# Colenso Project Website

A website interface to view the letters and writings of the New Zealand missionary [William Colenso](https://en.wikipedia.org/wiki/William_Colenso) (1811-1899).

## Requirements
Requires the `node` and `npm` packages.

Also requires the [BaseX](http://basex.org/products/download/all-downloads/) XML database which should be downloaded [here](http://files.basex.org/releases/8.4.1/BaseX841.zip) and extracted to a folder named `basex` in the parent directory.

## Installation
First create a parent directory.
```
mkdir colenso
cd colenso
```
Then clone this repository.
```
git clone https://github.com/JustaBitDope/colenso-project.git
```
Install the npm dependencies.
```
cd colenso-project
npm install
```
Extract the the letters database to the parent directory.
```
unzip Colenso_TEIs.zip -d ../Colenso
```

## Running
Before running you should have three folders in the parent directory: 
 - `colenso-project`
 - `basex`
 - `Colenso`

Run the server with the command `./server` and in a separate terminal run the client with `./client`. The website is then accessible from `localhost:3000` in your web browser.
