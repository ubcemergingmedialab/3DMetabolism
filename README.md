# 3D Metabolism

Visualizing metabolic pathways using A-frame

Design:
* Model View Presenter
	* The Model for this pattern is the information we have
	about gluconeogenesis and its pathways (from the video and screenshot).
	* The View needs to be a condensed way to represent the model, with enough information to be able to turn the information into a visualization (positions, links to other elements, special states, color maybe)
	* The Presenter is a script that will take the information from the View and turn it into the desired visualization (creating aframe entites to represent nodes and edges, adding the correct text entity to each node) 

* Camera movement, the way I see it there are two ways the camera moves:
	1. The camera travels around the space freely (use mousedown + camera's forward vector to update camera rig position)
	2. when clicking on a node, the camera should "zoom in" to the node in question, so that it can present more information. A second click should put the camera back in the original position.

trello board: https://trello.com/b/l29H2MNb
trello board INVITATION: https://trello.com/invite/b/l29H2MNb/34d1434d2473021495a1ebb5ef79c1df/metabolism
