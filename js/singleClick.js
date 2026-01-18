let lastClickedNode = null;
let lastClickTime = 0; 
const DOUBLE_CLICK_DELAY = 300; 

import { showNodeInfo } from "./popupInfo.js";
import { setSelectedNode } from './arrowNav.js';

function singleClickhandler (node, event, Graph, gData) {


        if (event.metaKey) {
        //console.log('CMD+Click');
        showNodeInfo(node, event, Graph, gData);
        return;
        }

        //console.log('Click detected:', node.id);
        const currentTime = Date.now();
        //console.log('Time since last click:', currentTime - lastClickTime);

        if (lastClickedNode && lastClickedNode.id === node.id && 
            (currentTime - lastClickTime) < DOUBLE_CLICK_DELAY) {
            
          //console.log('Double click detected!');
          // Sets node as selected for arrow key navigation
          setSelectedNode(node);
          
          // Zoom to node
          const distance = 60;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

          const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          Graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            2000  // ms transition duration
          );

          lastClickedNode = null;
          lastClickTime = 0;

            } else {
    // Single click - just update tracking
          //console.log('Single click - tracking');
          lastClickedNode = node;
          lastClickTime = currentTime;
          }
        };

export { singleClickhandler };