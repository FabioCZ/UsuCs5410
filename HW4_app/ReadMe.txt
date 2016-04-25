Tower Defense Project for CS5410, Spring 2016

----------------------------------
Project structure:
----------------------------------
I included the whole Visual Studio typescript project (this project builds its own server by default, but I don't use it).

The project front end is written in TypeScript. The transpiled js files are included for your convenience, so that you don't have to transpile it on your machine.

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
$npm install #this might not be necessary
$node app.js

Point your browser to http://localhost:3000

----------------------------------
Controls:
----------------------------------
Mouse based
left click to select menu items, place towers...
right click to deselect tower/cancel placement
ESC to return to main menu from game

----------------------------------
Gameplay:
----------------------------------
There are 4 types of creep:
-Cow 60hp, land
-Llama 90hp, land
-Pig 120hp, land
-Bat 60hp, air

There are 4 kinds of towers:
bomb - can attack land units, shoots a bomb with an explosion radius
slow - any land unit in its vicinity gets slowed
mixed - can attack both land and air units, shoots a projectile that only damages the creep it hits (if any)
air - shoots a guided projectile at air units

Towers have 3 upgrade levels, where the radius, attack, projectile speed and cool down time get improved.

There are 5 levels, with increasing amount of enemy waves.

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
