# Colenso Project Website

A website interface to view the letters and writings of the New Zealand missionary [William Colenso](https://en.wikipedia.org/wiki/William_Colenso) (1811-1899).

## Requirements
Requires the Node 6.

Also requires the [BaseX](http://basex.org/products/download/all-downloads/) XML database. Installatino instructions for this are included below.

## Installation
First create a parent directory.
```bash
mkdir colenso
cd colenso
```
Clone this repository.
```bash
git clone https://github.com/pjpscriv/colenso-project.git
```
Install the npm dependencies.
```bash
cd colenso-project
npm install
```
Extract the the letters database to the parent directory.
```bash
unzip Colenso_TEIs.zip -d ../Colenso
```
Download and unzip BaseX folder.
```bash
cd ..
wget http://files.basex.org/releases/8.4.1/BaseX841.zip
unzip BaseX841.zip 
rm BaseX841.zip
```

## Running
Before running your directory structure should look like this:
(result of `tree -L 1 colenso\` command)
```
colenso/
├── basex
├── Colenso
└── colenso-project
```

Run the server with the command `./server` and in a separate terminal run the client with `./client`. The website is then accessible from `localhost:3000` in your web browser.
