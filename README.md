Welcome to the Game-of-Voxels-JS wiki!

## MVP Features
### Interactive voxel plane
* 3d dimensional grid rendered via WebGL
* voxels are raised/change color depending on their living state
* the user can toggle the state of dead voxels via mouse clicks

### Fully working recreation of Conway's Game of Life
![game of life ex](https://i.stack.imgur.com/eEj5F.gif)
* Conway's Game of Life is a cellular automata created by a 2-D grid and a set of principles:
    * cells have two states: dead or alive
    1. Any living cell with fewer than two live neighbors dies
    2. Any live cell with more than three live neighbors dies
    3. Any live cell with two or three live neighbors lives on to the next 'generation'
    4. Any dead cell with exactly three live neighbors becomes a living cell.

### Isometric view of the game field (user can also rotate camera)
![Isometric Projection](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Axonometric_projection.svg/1200px-Axonometric_projection.svg.png)
* The x, y and z cube axes will be oriented 120° to each other
* Simulates a combination of a top-down perspective and a fully-3D perspective


## Technologies
* https://p5js.org/reference/#/p5/box

p5.js is how I'll be rendering voxels within the window. Specifically altering the box() API to match the state of Conway's Game. I chose this framework over [https://threejs.org/](three.js) because of it's low learning curve. It also seemed more robust than any other voxel Javascript frameworks available.

* https://en.wikipedia.org/wiki/Quadtree

![Quadtree Ex](http://www.i-programmer.info/images/stories/Core/Theory/QuadTrees/Tree3D.png)

The data structure I've chosen to implement the game's grid with is known as a quadtree. Here are the other options I considered:

* 2-D Array: A fallback, but lookup-time and iteration is a bit slow, especially if I'll be rendering this in 3-D

* [Hashlife](https://en.wikipedia.org/wiki/Hashlife): supposedly reduces lookup time drastically by combining a hashmap with a quadtree. Extremely interesting, but may be outside the scope of this project's allotted time.

## Wireframes
![voxels](https://i.imgur.com/RAJQLie.png)

![wireframe](https://i.imgur.com/87Xi2RK.png)

### Work accomplished over the weekend:
* Researched Conway's Game of Life and its algorithm
* Researched the appropriate data structure with which to implement the Game ([Quadtree](http://www.i-programmer.info/programming/theory/1679-quadtrees-and-octrees.html))
* Researched the appropriate voxel rendering engine ([p5.js](https://p5js.org/))
* Familiarized myself with the p5 framework

## Timeline
### Day 1:
* Implement Game Logic
### Day 2:
* Implement Voxel Plane rendering/integrate game logic
### Day 3:
* Complete integration of game logic/implement user interactions
### Day 4:
* UI and CSS
### Day 5:
* Fix Bugs and polish presentation
