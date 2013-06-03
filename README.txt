Final Project for CS 174A
Members: Elison Chen, Benjamin Lin, Daniel Duan

Our project is a game where cubes are randomly generated depending
on traffic in the UCLA region to downtown LA region. We made our
project in WebGL and incorporated Bing and Google Maps API for
generating the cubes. 
The objective of the game is to dodge the cubes using right and
left arrows. The further you get the more points you score. 

We are a group of three so we only implemented one advanced topic
which was collision detection. We implemented it by calculating
the distance from a cube to the triangle. If the distance between
the two objects are less than a certain amount then that means we
have collided and the player loses. Each time a cube is drawn
we do a comparison of its location and the location of the triangle,
the comparison is a simple distance formula so it does not require
significant computation time.
