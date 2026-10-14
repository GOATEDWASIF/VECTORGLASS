/**
 * Tool: Direct Node and Coordinate Array Path Modifier
 */
class PathEditorTool extends AbstractVectorTool {
    bindEvents() {
        const svgTarget = document.getElementById('production-canvas');

        this.listeners['mousedown'] = (e) => {
            if (e.target.parentNode?.id === 'vector-runtime-stage' && e.target.getAttribute('data-type') === 'path') {
                this.canvasManager.selectNode(e.target);
            }
        };

        svgTarget.addEventListener('mousedown', this.listeners['mousedown']);
    }

    onSelectElement(svgNode) {
        this.canvasManager.clearOverlay();
        if (svgNode.getAttribute('data-type') !== 'path') return;

        const dString = svgNode.getAttribute('d') || '';
        const commandTokens = dString.split(/(?=[MLZ])/);
        
        commandTokens.forEach((token, index) => {
            const cleanToken = token.trim();
            if (!cleanToken) return;

            const letter = cleanToken[0];
            const parts = cleanToken.substring(1).trim().split(/[\s,]+/);
            if (parts.length < 2) return;

            const currentX = parseFloat(parts[0]);
            const currentY = parseFloat(parts[1]);

            const dynamicNodeAnchor = document.createElementNS("http://w3.org", "circle");
            dynamicNodeAnchor.setAttribute('cx', currentX);
            dynamicNodeAnchor.setAttribute('cy', currentY);
            dynamicNodeAnchor.setAttribute('r', '5');
            dynamicNodeAnchor.setAttribute('fill', '#6366f1');
            dynamicNodeAnchor.setAttribute('stroke', '#ffffff');
            dynamicNodeAnchor.setAttribute('stroke-width', '1.5');
            
            // Implement individual structural sub-node control matrix mechanics
            dynamicNodeAnchor.addEventListener('mousedown', (anchorEvent) => {
                anchorEvent.stopPropagation();
                
                const dragMove = (moveEvt) => {
                    const relativeCoords = this.getRelativeCoords(moveEvt);
                    dynamicNodeAnchor.setAttribute('cx', relativeCoords.x);
                    dynamicNodeAnchor.setAttribute('cy', relativeCoords.y);
                    
                    parts[0] = relativeCoords.x;
                    parts[1] = relativeCoords.y;
                    commandTokens[index] = `${letter}${parts[0]} ${parts[1]}`;
                    
                    svgNode.setAttribute('d', commandTokens.join(' '));
                };

                const dragUp = () => {
                    window.removeEventListener('mousemove', dragMove);
                    window.removeEventListener('mouseup', dragUp);
                    this.onSelectElement(svgNode);
                };

                window.addEventListener('mousemove', dragMove);
                window.addEventListener('mouseup', dragUp);
            });

            this.canvasManager.interactiveOverlay.appendChild(dynamicNodeAnchor);
        });
    }
}
