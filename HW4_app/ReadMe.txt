Tower Defense Project for CS5410, Spring 2016

----------------------------------
Project structure:
----------------------------------
I included the whole Visual Studio typescript project (this project builds its own server by default, but I don't use it).

The project front end is written in TypeScript. The transpiled build js files are included for your convenience, so that you don't have to transpile it on your machine.

|
├───HW4_app
│   ├───data #back end highscore database
│   ├───node_modules
│   ├───public #front end server code
│   │   ├───img #visual resources
│   │   ├───js	#JS libraries included (require, jquery)
│   │   ├───sound #audio resources
│   │   ├───styles #Style info
│   │   └───ts 		#My front end js/ts code is here
│   │       ├───Graphics
│   │       └───Menus
│   └───Scripts	# NuGet packages that contain typing information for TypeScript
│       └───typings
└───packages	# NuGet packages that contain typing information for TypeScript

----------------------------------
To run:
----------------------------------

$cd HW4_app
$node app.js

Point your browser to http://localhost:3000

----------------------------------
Credits:
----------------------------------

Front end, back end: Fabio Gottlicher, A01647928

Art courtesy of :
http://www.hirefreelanceartist.com/free-tower-defense-graphics.html
http://opengameart.org/

Sound courtesy of:
http://soundimage.org/fantasywonder/
http://freesound.org
http://wikipedia.org
