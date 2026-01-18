
function doubleClickhandler(Graph) {

    let lastClickedNode = null;
    let lastClickTime = 0;
    const DOUBLE_CLICK_DELAY = 300; 

    return (node, event) => {
    // Aim at node from outside it
        if (event.metaKey) {
        showNodeInfo(node, event);
        return;
        }
        
        const currentTime = Date.now();

        if (lastClickedNode && lastClickedNode.id === node.id && 
            (currentTime - lastClickTime) < DOUBLE_CLICK_DELAY) {

          const distance = 60;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

          const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          Graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );

          lastClickedNode = null;
          lastClickTime = 0;

            } else {
    // Single click - just update tracking
          lastClickedNode = node;
          lastClickTime = currentTime;
          }
        };
      }

    export { doubleClickhandler };