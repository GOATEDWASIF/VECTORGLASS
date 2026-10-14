/**
 * Tool: Vector Bezier Pen Node Path Compiler
 */
class PenTool extends AbstractVectorTool {
    constructor(canvasManager) {
        super(canvasManager);
        this.activePathNode = null;
        this.pointsArray = [];
    }

    bindEvents() {
        const svgTarget = document.getElementById('production-canvas');

        this.listeners['mousedown'] = (e) => {
            const coords = this.getRelativeCoords(e);
            
            // Core path vector array pipeline
            if (!this.activePathNode) {
                this.pointsArray = [coords];
                this.activePathNode = document.createElementNS("http://w3.org", "path");
                this.activePathNode.setAttribute('fill', 'none');
                this.activePathNode.setAttribute('stroke', document.getElementById('prop-stroke-color').value);
                this.activePathNode.setAttribute('stroke-width', document.getElementById('prop-stroke-width').value);
                
                this.canvasManager.registerNewNode(this.activePathNode, 'path');
            } else {
                this.pointsArray.push(coords);
            }

            this.renderBezierString();
        };

        // Context menu breaks current vector draw sequence
        this.listeners['contextmenu'] = (e) => {
            e.preventDefault();
            this.terminateDrawingSequence();
        };

        svgTarget.addEventListener('mousedown', this.listeners['mousedown']);
        svgTarget.addEventListener('contextmenu', this.listeners['contextmenu']);
    }

    renderBezierString() {
        if (!this.activePathNode || this.pointsArray.length === 0) return;
        
        let pathString = `M ${this.pointsArray[0].x} ${this.pointsArray[0].y}`;
        for (let i = 1; i < this.pointsArray.length; i++) {
            pathString += ` L ${this.pointsArray[i].x} ${this.pointsArray[i].y}`;
        }

        this.activePathNode.setAttribute('d', pathString);
        this.canvasManager.selectNode(this.activePathNode);
    }

    terminateDrawingSequence() {
        this.activePathNode = null;
        this.pointsArray = [];
        window.App.toolManager.activateTool('transform');
    }

    onSelectElement(svgNode) {
        if (svgNode.getAttribute('data-type') !== 'path') return;
        
        const pathData = svgNode.getAttribute('d') || '';
        const coordsReg = /([ML])\s*(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/g;
        let match;

        // Overlay node anchor handles visual feedback layer
        while ((match = coordsReg.exec(pathData)) !== null) {
            const cx = match[2];
            const cy = match[3];

            const handle = document.createElementNS("http://w3.org", "circle");
            handle.setAttribute('cx', cx);
            handle.setAttribute('cy', cy);
            handle.setAttribute('r', '4');
            handle.setAttribute('fill', '#ffffff');
            handle.setAttribute('stroke', '#6366f1');
            handle.setAttribute('stroke-width', '2');
            this.canvasManager.interactiveOverlay.appendChild(handle);
        }
    }
}
