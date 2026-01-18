
function nodeHoverhandler(Graph, gData) {
    return (hoveredNode) => {
        if (hoveredNode) {

            // Access the scene and find all sprite materials
                const connectedNodeIds = new Set();
                gData.links.forEach(link => {
                  if (link.source.id === hoveredNode.id || link.source === hoveredNode.id) {
                    connectedNodeIds.add(link.target.id || link.target);
                  }
                  if (link.target.id === hoveredNode.id || link.target === hoveredNode.id) {
                    connectedNodeIds.add(link.source.id || link.source);
                  }
                });
                
                // Update node opacities
                const scene = Graph.scene();
                scene.traverse((object) => {
                  if (object.material && object.material.map) {
                    if (object.userData.nodeId === hoveredNode.id) {
                      object.material.opacity = 1.0; // Hovered node - full opacity
                    } else if (connectedNodeIds.has(object.userData.nodeId)) {
                      object.material.opacity = 0.90; // Connected nodes 
                    } else {
                      object.material.opacity = 0.45; // All other nodes 
                    }
                  }
                });

            Graph.linkColor(link => {
             const isConnected = (link.source.id || link.source) === hoveredNode.id || 
                         (link.target.id || link.target) === hoveredNode.id;
              return isConnected ? 'black' : '#808080';
            });

          } else {
            // Reset all sprites to full opacity
            const scene = Graph.scene();
            scene.traverse((object) => {
              if (object.material && object.material.map) {
                object.material.opacity = 1.0;
              }
            });

            Graph.linkColor('#808080');
          }
      };
    }

    // **CHANGED**: Export the function so main.js can import it
export { nodeHoverhandler };