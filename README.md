![node](https://img.shields.io/badge/Node-green)
![npm](https://img.shields.io/badge/npm-red)
![electron](https://img.shields.io/badge/Electron%20-purple)
![typescript](https://img.shields.io/badge/Typescript%20-blue)

## Psp content manager

### Purpose

- Instant folder navigation: instantly opening file explorer in root of target folder
- Folder structure creation: generation of the necessary directory tree for PSP files
- Extraction of specific files to their target destinations, such as ARK4, Chronoswitch and official sw updates

### How to setup development environment

#### Make sure to have installed

* [Node](https://nodejs.org/en)

#### Install dependencies

```` 
npm install
````

#### Build the project

````
npm run build
````

#### Start the project

````
npm start
````

#### Creating executables

````
npm run package-linux
````

````
npm run package-win
````

Executables can be then found under [release](release)

- [linux](release/linux)
- [windows](release/win)

#### Remove all downloaded dependencies and generated files

````
npm run purge
````