/**
 * Master Canvas Presentation Context and SVG Node Factory
 */
class ProductionCanvasManager {
    constructor() {
        this.svgStage = null;
        this.interactiveOverlay = null;
        this.defs = null;
        this.selectedElement = null;
        this.registry = [];
        this.idIncrement = 0;
    }

    init() {
        this.svgStage = document.getElementById('vector-runtime-stage');
        this.interactiveOverlay = document.getElementById('vector-interactive-overlay');
        this.defs = document.getElementById('canvas-defs');
    }

    resetStage() {
        this.svgStage.innerHTML = '';
        this.interactiveOverlay.innerHTML = '';
        this.defs.innerHTML = '';
        this.registry = [];
        this.selectedElement = null;
    }

    registerNewNode(svgNode, typePrefix) {
        this.idIncrement++;
        const uniqueID = `vg-${typePrefix}-${this.idIncrement}`;
        svgNode.setAttribute('id', uniqueID);
        svgNode.setAttribute('data-type', typePrefix);
        this.svgStage.appendChild(svgNode);
        
        this.registry.push({
            id: uniqueID,
            domElement: svgNode,
            name: `${typePrefix.toUpperCase()} Node #${this.idIncrement}`
        });

        this.selectNode(svgNode);
        window.App.ui.syncLayerTree();
        return svgNode;
    }

    selectNode(svgNode) {
        this.clearOverlay();
        this.selectedElement = svgNode;
        if (!svgNode) return;

        // Apply interactive highlighting markers
        window.App.toolManager.getActiveToolInstance().onSelectElement(svgNode);
        window.App.ui.reflectElementProperties(svgNode);
        window.App.ui.highlightLayerNode(svgNode.id);
    }

    clearOverlay() {
        this.interactiveOverlay.innerHTML = '';
    }

    deleteSelected() {
        if (!this.selectedElement) return;
        const targetId = this.selectedElement.id;
        this.registry = this.registry.filter(item => item.id !== targetId);
        this.selectedElement.remove();
        this.selectedElement = null;
        this.clearOverlay();
        window.App.ui.syncLayerTree();
    }

    clearCanvas() {
        this.resetStage();
        window.App.ui.syncLayerTree();
    }

    exportSVG() {
        this.clearOverlay();
        const fullCanvas = document.getElementById('production-canvas').cloneNode(true);
        // Stripping dynamic interaction configurations prior to raw serialization 
        fullCanvas.removeAttribute('id');
        fullCanvas.style.backgroundImage = 'none';
        fullCanvas.style.backgroundColor = 'transparent';
        fullCanvas.querySelector('#vector-interactive-overlay').remove();

        const xmlString = new XMLSerializer().serializeToString(fullCanvas);
        const fileBlob = new Blob([xmlString], {type: 'image/svg+xml;charset=utf-8'});
        const directUrl = URL.createObjectURL(fileBlob);
        
        const anchor = document.createElement('a');
        anchor.href = directUrl;
        anchor.download = `vectorglass-production-${Date.now()}.svg`;
        anchor.click();
        URL.revokeObjectURL(directUrl);
    }
}
