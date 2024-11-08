![node](https://img.shields.io/badge/Node-green)
![npm](https://img.shields.io/badge/npm-red)
![electron](https://img.shields.io/badge/Electron%20-purple)
![typescript](https://img.shields.io/badge/Typescript%20-blue)


This is just simple application built using Electron, with minimal dependencies to keep it lightweight and straightforward. It leverages core Electron modules and a small set of production libraries, focusing on essential functionality without additional frameworks.

#### UI:
The interface is designed with basic HTML and CSS for simplicity and ease of customization. This approach minimizes the app's size and dependencies, ensuring faster load times and a clean, accessible design.

#### Backend:
The application’s backend logic is implemented in TypeScript, providing type safety and clarity for handling filesystem interactions, folder navigation, and file extraction operations.

## Development Setup

#### Prerequisites

Ensure [Node](https://nodejs.org/en) is installed

#### Installation
Clone the repository and navigate to the project directory

Install required dependencies:
```` 
npm install
````

#### Compile the project

````
npm run build
````

#### Start the project (will rebuild itself before the start)

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

#### Remove all downloaded dependencies, compiled sources and executables

````
npm run purge
````