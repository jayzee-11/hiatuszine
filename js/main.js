//creates a random graph with 25 images

import * as THREE from 'https://esm.sh/three';
import { nodeHoverhandler } from './nodeHover.js';
import { rightClickhandler } from './rightClick.js';
import { clearSelection } from './rightClick.js';
import { singleClickhandler } from './singleClick.js';
import { closeInfoPopup } from './popupInfo.js';
import { initArrowNavigation } from './arrowNav.js';

const imgs = [];
    for (let i = 1; i <= 36; i++) {
    imgs.push(`${i}.jpg`);
    }


const gData = {
    nodes: imgs.map((img, id) => ({ id, img })),
    links: [...Array(imgs.length).keys()]
    .filter(id => id)
    .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id-1))
    }))
};

const Graph = new ForceGraph3D(document.getElementById('3d-graph'))
    .backgroundColor('#f0f0f0')  
    .linkColor(link =>'#808080')
    .linkWidth(0.75)
    .nodeThreeObject(node => {

    
        console.log('Node:', node);

    const imgTexture = new THREE.TextureLoader().load(`./imgs/${node.img}`);
    imgTexture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: imgTexture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(42, 30);

    sprite.userData.nodeId = node.id;

    return sprite;
    })


 
    .graphData(gData);

//Node Hover
Graph.onNodeHover(nodeHoverhandler(Graph, gData));

//Left Click
Graph.onNodeClick((node, event) => {
    singleClickhandler(node, event, Graph, gData);
});
Graph.onBackgroundClick(() => {
    closeInfoPopup();
});

//Right Click
Graph.onNodeRightClick(rightClickhandler(Graph, gData));
Graph.onBackgroundRightClick(() => {
        // Cancel selection when right-clicking background
        clearSelection();
      });
 
Graph.d3Force('link').distance(36);
Graph.d3Force('charge').strength(-36);

initArrowNavigation(Graph, gData);