/**
 * Tool: SVG Typography & Dynamic Type Layer Editor
 */
class TextTool extends AbstractVectorTool {
    bindEvents() {
        const svgTarget = document.getElementById('production-canvas');

        this.listeners['mousedown'] = (e) => {
            if (e.target.id !== 'production-canvas' && e.target.id !== 'vector-runtime-stage') return;
            
            const pos = this.getRelativeCoords(e);
            const userString = prompt("Enter vector typesetting parameters:", "VectorGlass Text");
            if (!userString) return;

            const textNode = document.createElementNS("http://w3.org", "text");
            textNode.setAttribute('x', pos.x);
            textNode.setAttribute('y', pos.y);
            textNode.setAttribute('fill', document.getElementById('prop-fill-color').value);
            textNode.setAttribute('font-family', 'sans-serif');
            textNode.setAttribute('font-size', '24');
            textNode.textContent = userString;

            this.canvasManager.registerNewNode(textNode, 'text');
            window.App.toolManager.activateTool('transform');
        };

        svgTarget.addEventListener('mousedown', this.listeners['mousedown']);
    }
}
