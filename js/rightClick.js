
let selectedNodeForConnection = null; 
let selectedSpriteMaterial = null;

function rightClickhandler (Graph, gData) {

    return (node) => {
        if (!selectedNodeForConnection) {
        // First selection - outline the node
        selectedNodeForConnection = node;
        
        // Add outline effect
        const scene = Graph.scene();
        scene.traverse((object) => {
        if (object.userData.nodeId === node.id && object.material) {
        // Create outline by adding a slightly larger sprite behind
        selectedSpriteMaterial = object.material;
        object.material.color.setHex(0xff6666); // Red tint
         }
        });
      
        } else if (selectedNodeForConnection.id === node.id) {
        // Clicked same node - cancel selection
        clearSelection();
        
        } else {
        // Second selection - create connection
        const sourceId = selectedNodeForConnection.id;
        const targetId = node.id;
        
        // Check for duplicate links
        const existingLinkIndex = gData.links.findIndex(link => 
          (link.source.id === sourceId && link.target.id === targetId) ||
          (link.source.id === targetId && link.target.id === sourceId) ||
          (link.source === sourceId && link.target === targetId) ||
          (link.source === targetId && link.target === sourceId)
        );
        
        if (existingLinkIndex !== -1) {
          // Link exists - ask to disconnect
          if (confirm('Disconnect nodes?')) {
            // Remove the link from data
            gData.links.splice(existingLinkIndex, 1);
            
            // Update graph
            Graph.graphData(gData);
          }
          
          clearSelection();
          return;
        }
        
        // Add new link to data
        const newLink = {
          source: sourceId,
          target: targetId,
          userCreated: true
        };
        gData.links.push(newLink);
        
        // Update graph
        Graph.graphData(gData);
        
        clearSelection();
        }
      }
    }


function clearSelection() {
  // Reset sprite color back to normal
    if (selectedSpriteMaterial) {
    selectedSpriteMaterial.color.setHex(0xffffff); // White (normal)
    }
  
    selectedNodeForConnection = null;
    selectedSpriteMaterial = null;
}

export { clearSelection };
export { rightClickhandler };