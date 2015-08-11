#watchout
This is a project I completed as a student at [hackreactor](http://hackreactor.com). This project was worked on with a pair.


The source code in this repository was written as part of a sprint at Hack Reactor. The code is a reimplementation of the game from this link: http://latentflip.com/LearningD3/collider/. The basic requirement to implement the game was finished as a pair. However, I implemented the extra credit particle system on my own after the sprint was over.


============================================================================================================================================================================


The code uses D3 and SVG to render the game assets. Although D3 might not necessarily be the ideal choice for a game, the game was created as a "fun" exercise to learn the framework.

The extra credit portion of the Watchout game - to add a particle system in which particles/circles/enemies bounce off each other as well as walls - has been completed.

The particle system uses a priority queue to keep track of collisions instead of checking for all collisions every X seconds. This model is based off of the event driven simulation in Princeton's Algorithms course on Coursera. More information about event driven simulation can found here: http://algs4.cs.princeton.edu/61event/

The Watchout game integrates code based on the event driven simulation code from Princeton's Algorithms course. The code was taken from a blogger's GitHub who had ported to Javascript the event driven simulation Java code from the course. The blogger's post about it can be found here: http://victorarias.com.br/2013/03/15/event-driven-collision-simulation.html

The integrated code helps set up the particle system and can be found in the "lib" folder. The code was refactored to use a more psuedoclassical Javascript style, and the classes from the integrated code were extended to create new Enemy and Watchout classes.

The Watchout class inherits from the CoolCollisionSystem class and overrides the start, loadResources, draw, and loop functions. The Watchout class uses D3 and SVG instead of canvas and native Javascript to manipulate the screen.


DEMO: [watchout](http://andrew-li.github.io/watchout/index.html)
Note: Have only tested this in Chrome. May not work correctly in other browsers.

