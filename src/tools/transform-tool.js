/**
 * Tool: Transform Layer and Bound-Box Modifier
 */
class TransformTool extends AbstractVectorTool {
    bindEvents() {
        const svgTarget = document.getElementById('production-canvas');
        
        this.listeners['mousedown'] = (e) => {
            const clickedStage = e.target.id === 'production-canvas' || e.target.id === 'vector-runtime-stage';
            if (clickedStage) {
                this.canvasManager.selectNode(null);
            } else if (e.target.parentNode?.id === 'vector-runtime-stage') {
                this.canvasManager.selectNode(e.target);
                this.startDragging(e);
            }
        };

        svgTarget.addEventListener('mousedown', this.listeners['mousedown']);
    }

    startDragging(e) {
        const node = this.canvasManager.selectedElement;
        if (!node) return;

        let startCoords = this.getRelativeCoords(e);
        const type = node.getAttribute('data-type');

        const moveFallback = (moveEvt) => {
            const curCoords = this.getRelativeCoords(moveEvt);
            const deltaX = curCoords.x - startCoords.x;
            const deltaY = curCoords.y - startCoords.y;
            startCoords = curCoords;

            if (type === 'text') {
                const x = parseFloat(node.getAttribute('x') || 0) + deltaX;
                const y = parseFloat(node.getAttribute('y') || 0) + deltaY;
                node.setAttribute('x', x);
                node.setAttribute('y', y);
            }
            
            this.onSelectElement(node);
        };

        const upFallback = () => {
            window.removeEventListener('mousemove', moveFallback);
            window.removeEventListener('mouseup', upFallback);
        };

        window.addEventListener('mousemove', moveFallback);
        window.addEventListener('mouseup', upFallback);
    }

    onSelectElement(svgNode) {
        this.canvasManager.clearOverlay();
        const bbox = svgNode.getBBox();
        
        // Instantiate real-time analytical bounding boxes overlay wrappers
        const rect = document.createElementNS("http://w3.org", "rect");
        rect.setAttribute('x', bbox.x - 4);
        rect.setAttribute('y', bbox.y - 4);
        rect.setAttribute('width', bbox.width + 8);
        rect.setAttribute('height', bbox.height + 8);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', '#6366f1');
        rect.setAttribute('stroke-width', '1.5');
        rect.setAttribute('stroke-dasharray', '4');

        this.canvasManager.interactiveOverlay.appendChild(rect);
    }
}
