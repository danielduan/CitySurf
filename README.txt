CitySurf

http://citysurf.herokuapp.com

Final Project for CS 174A
Members: Elison Chen, Benjamin Lin, Jia Dan (Daniel) Duan
==================================================================

Our project is a game where cubes are randomly generated depending
on traffic in the UCLA region to downtown LA region.

The objective of the game is to dodge the cubes using right and
left arrows. The further you get the more points you score. 

We made our project in WebGL and incorporated Bing and Google
Maps API for randomizing numbers when generating the cubes.
We also used Webkit's Web Audio API to analyze the background
music and drew fading circles on a canvas based on the spectrum.

We are a group of three so we only implemented one advanced topic
which was collision detection. We implemented it by calculating
the distance from the center of a cube to the center of the
triangle. If the distance between the two objects are less than a
certain amount then that means we have collided and the player
loses. Since we make this computation every time each frame is
drawn, we used a simple distance formula to cut down the amount
of computations, thus making the objects appear as spheres to the
collision detection system.

This differed from our proposal in that we chose to have a set
path and generate cubes on a flat surface instead of a 360 degree
view of flying objects. We also integrated the mapping component
because it seemed like a natural way to add variations in the
game play. We also chose to use WebGL and javascript instead of
OpenGL and C++ because it allowed us to collaborate across
different operating systems and makes it much easier to share
across different platforms.

Please visit our site to get a working demo. Due to cross origin
security issues in many browsers, mapping and music will not work
when the site is opened directly from the html file.