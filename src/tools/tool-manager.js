/**
 * Abstract Tool Management System Lifecycle Manager
 */
class ToolManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.tools = {};
        this.activeToolKey = 'transform';
    }

    init() {
        // Core functional tool matrix initialization mapping
        this.tools['transform'] = new TransformTool(this.canvasManager);
        this.tools['pen'] = new PenTool(this.canvasManager);
        this.tools['path-editor'] = new PathEditorTool(this.canvasManager);
        this.tools['gradient'] = new GradientTool(this.canvasManager);
        this.tools['text'] = new TextTool(this.canvasManager);

        this.setupToolBindingTriggers();
        this.activateTool(this.activeToolKey);
    }

    setupToolBindingTriggers() {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTool = e.target.getAttribute('data-tool');
                this.activateTool(targetTool);
            });
        });

        // Global hotkey routing structure mapping
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            switch(e.key.toLowerCase()) {
                case 'v': this.activateTool('transform'); break;
                case 'p': this.activateTool('pen'); break;
                case 'a': this.activateTool('path-editor'); break;
                case 'g': this.activateTool('gradient'); break;
                case 't': this.activateTool('text'); break;
            }
        });
    }

    activateTool(toolKey) {
        if (!this.tools[toolKey]) return;
        
        this.tools[this.activeToolKey].deactivate();
        this.activeToolKey = toolKey;
        this.tools[this.activeToolKey].activate();

        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tool') === toolKey);
        });

        this.canvasManager.clearOverlay();
        if (this.canvasManager.selectedElement) {
            this.tools[this.activeToolKey].onSelectElement(this.canvasManager.selectedElement);
        }
    }

    getActiveToolInstance() {
        return this.tools[this.activeToolKey];
    }
}

/**
 * Base Template Class for Structural Tools
 */
class AbstractVectorTool {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.listeners = {};
    }

    activate() { this.bindEvents(); }
    deactivate() { this.unbindEvents(); this.canvasManager.clearOverlay(); }
    
    bindEvents() {}
    unbindEvents() {
        const svgTarget = document.getElementById('production-canvas');
        for (const [event, fallback] of Object.entries(this.listeners)) {
            svgTarget.removeEventListener(event, fallback);
        }
        this.listeners = {};
    }

    getRelativeCoords(e) {
        const svgTarget = document.getElementById('production-canvas');
        const boundary = svgTarget.getBoundingClientRect();
        return {
            x: e.clientX - boundary.left,
            y: e.clientY - boundary.top
        };
    }

    onSelectElement(svgNode) {}
}
