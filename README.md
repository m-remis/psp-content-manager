![node](https://img.shields.io/badge/Node-green)
![npm](https://img.shields.io/badge/npm-red)
![electron](https://img.shields.io/badge/Electron%20-purple)
![typescript](https://img.shields.io/badge/Typescript%20-blue)

## psp-tool - work in progress

### Purpose

The primary objective of this project is to automate the setup and organization of PSP memory cards.

- Folder Structure Creation: Instantly generating the necessary directory tree for PSP files, including folders for
  custom
  firmware, themes, plugins, homebrew applications, games, and media files.


- Automated File Placement: Automatically copying selected files to the appropriate folders within the structure. The
  tool
  intelligently recognizes each file type and places it into the correct directory, such as:
   - Custom Firmware Files for PSP customization and operation
  Homebrew Apps for custom software
   - Themes and Plugins for enhanced functionality and aesthetics
   - Media Files (music, videos, pictures) for multimedia enjoyment

#### Minimal viable product requirements we are trying to target

- Directory tree creation: Instantly generating the necessary directory tree for PSP files, including folders for custom
  firmware, themes, plugins, homebrew applications, games, and media files
- Cross-Platform Support: Works on multiple operating systems, making it accessible for various PSP users
- File Categorization and Copying: Automatically categorizes and copies files into the relevant PSP directories based on
  type

#### Possible enhancements in future

- Multi-language support ?
- others to be added later...

#### PSP technical resources:

* [File structure](https://www.psdevwiki.com/psp/index.php/File_Structures)
* [Themes](https://www.pspunk.com/psp-themes/)
* [Ark4 custom firmware installation](https://github.com/PSP-Archive/ARK-4?tab=readme-ov-file#Installation-on-PSP)
* [PSP OFW firmware update](https://www.pspunk.com/psp-update/)

## Milestones

### Technical
- [ ] **Choose Multiplatform Framework**  
  _Evaluate and select a framework that supports cross-platform development, allowing the tool to work on Windows, macOS, and Linux._

- [ ] **Choose Language**  
  _Decide on a language that aligns with the framework and provides robust file handling and directory management capabilities._

- [ ] **Create Project Skeleton**  
  _Set up the basic project structure, including directory organization, initial configurations, and essential files._

- [ ] **Setup Basic Application Window**  
_Develop a simple application window to verify the project setup and display an interface when the app starts._

- [ ] **Setup tooling for unified user interface desin**  
  _Buttons to use, animated background, etc..._

- [ ] **Setup Unit Tests**  
  _Implement a basic unit testing framework to validate individual components of the project as they are developed._

- [ ] **Setup Build Process**  
  _Establish a build pipeline to automate the running of unit tests and create executables for Windows (Linux support to be added later)._

### Features

- [ ] **Implement Folder Structure Creation - backend logic**  
  _Develop basic functionality to automatically generate the basic PSP folder tree required for different file types._

- [ ] **Implement Folder Structure Creation - user interface**  
  _Develop basic user interface to automatically generate the basic PSP folder tree required for different file types._


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