/**
 * Tool: Complex SVG Definition Gradient Linear Configurator
 */
class GradientTool extends AbstractVectorTool {
    bindEvents() {
        const svgTarget = document.getElementById('production-canvas');

        this.listeners['mousedown'] = (e) => {
            const targetNode = this.canvasManager.selectedElement;
            if (!targetNode) return;

            const startPos = this.getRelativeCoords(e);
            const targetGradId = `grad-${targetNode.id}`;

            let linearGradNode = document.getElementById(targetGradId);
            if (!linearGradNode) {
                linearGradNode = document.createElementNS("http://w3.org", "linearGradient");
                linearGradNode.setAttribute('id', targetGradId);
                
                const stopNodeA = document.createElementNS("http://w3.org", "stop");
                stopNodeA.setAttribute('offset', '0%');
                stopNodeA.setAttribute('stop-color', document.getElementById('prop-fill-color').value);

                const stopNodeB = document.createElementNS("http://w3.org", "stop");
                stopNodeB.setAttribute('offset', '100%');
                stopNodeB.setAttribute('stop-color', '#000000');

                linearGradNode.appendChild(stopNodeA);
                linearGradNode.appendChild(stopNodeB);
                this.canvasManager.defs.appendChild(linearGradNode);
            }

            const mouseDrag = (moveEvt) => {
                const currentPos = this.getRelativeCoords(moveEvt);
                linearGradNode.setAttribute('x1', `${(startPos.x / 800) * 100}%`);
                linearGradNode.setAttribute('y1', `${(startPos.y / 600) * 100}%`);
                linearGradNode.setAttribute('x2', `${(currentPos.x / 800) * 100}%`);
                linearGradNode.setAttribute('y2', `${(currentPos.y / 600) * 100}%`);
                
                targetNode.setAttribute('fill', `url(#${targetGradId})`);
                document.getElementById('prop-fill-type').value = 'gradient';
                this.renderVisualFeedbackRay(startPos, currentPos);
            };

            const mouseUp = () => {
                window.removeEventListener('mousemove', mouseDrag);
                window.removeEventListener('mouseup', mouseUp);
                this.canvasManager.clearOverlay();
            };

            window.addEventListener('mousemove', mouseDrag);
            window.addEventListener('mouseup', mouseUp);
        };

        svgTarget.addEventListener('mousedown', this.listeners['mousedown']);
    }

    renderVisualFeedbackRay(p1, p2) {
        this.canvasManager.clearOverlay();
        const visualLine = document.createElementNS("http://w3.org", "line");
        visualLine.setAttribute('x1', p1.x);
        visualLine.setAttribute('y1', p1.y);
        visualLine.setAttribute('x2', p2.x);
        visualLine.setAttribute('y2', p2.y);
        visualLine.setAttribute('stroke', '#6366f1');
        visualLine.setAttribute('stroke-width', '2');
        this.canvasManager.interactiveOverlay.appendChild(visualLine);
    }
}
