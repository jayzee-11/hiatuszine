import * as THREE from 'https://esm.sh/three';

let selectedNode = null;

function setSelectedNode(node) {
    selectedNode = node;
}

function initArrowNavigation(Graph, gData) {
    document.addEventListener('keydown', (event) => {
        if (!selectedNode) return;
        
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(event.key)) return;
        
        // Find neighbors
        const neighbors = gData.links
            .filter(link => link.source.id === selectedNode.id || link.target.id === selectedNode.id)
            .map(link => link.source.id === selectedNode.id ? link.target : link.source);
        
        if (neighbors.length === 0) return;
        
        // Get camera position to determine relative directions
        const camera = Graph.camera();
        const selectedPos = new THREE.Vector3(selectedNode.x, selectedNode.y, selectedNode.z);
        
        // Find best neighbor based on arrow direction
        let bestNeighbor = null;
        let bestScore = -Infinity;
        
        neighbors.forEach(neighbor => {
            const neighborPos = new THREE.Vector3(neighbor.x, neighbor.y, neighbor.z);
            const direction = neighborPos.clone().sub(selectedPos).normalize();
            
            // Project to screen space relative to camera
            const cameraDir = camera.position.clone().sub(selectedPos).normalize();
            const right = new THREE.Vector3().crossVectors(camera.up, cameraDir).normalize();
            const up = new THREE.Vector3().crossVectors(cameraDir, right).normalize();
            
            const screenX = direction.dot(right);
            const screenY = direction.dot(up);
            
            let score = 0;
            if (event.key === 'ArrowRight') score = screenX;
            if (event.key === 'ArrowLeft') score = -screenX;
            if (event.key === 'ArrowUp') score = screenY;
            if (event.key === 'ArrowDown') score = -screenY;
            
            if (score > bestScore) {
                bestScore = score;
                bestNeighbor = neighbor;
            }
        });
        
        if (bestNeighbor) {
            // Zoom to neighbor (same as double-click)
            const distance = 60;
            const distRatio = 1 + distance/Math.hypot(bestNeighbor.x, bestNeighbor.y, bestNeighbor.z);
            
            const newPos = bestNeighbor.x || bestNeighbor.y || bestNeighbor.z
                ? { x: bestNeighbor.x * distRatio, y: bestNeighbor.y * distRatio, z: bestNeighbor.z * distRatio }
                : { x: 0, y: 0, z: distance };
            
            Graph.cameraPosition(newPos, bestNeighbor, 2000);
            selectedNode = bestNeighbor;
        }
    });
}

export { initArrowNavigation };
export { setSelectedNode };