/**
 * VectorGlass Professional System Core Core-Initializer
 */
class VectorGlassCore {
    constructor() {
        this.canvasManager = new ProductionCanvasManager();
        this.toolManager = new ToolManager(this.canvasManager);
        this.ui = new UserInterfaceController(this);
    }

    init() {
        this.canvasManager.init();
        this.toolManager.init();
        this.ui.init();
        this.createNewWorkspace();
    }

    createNewWorkspace() {
        this.canvasManager.resetStage();
        this.ui.syncLayerTree();
    }
}

// Instantiate on window load cycle
window.addEventListener('DOMContentLoaded', () => {
    window.App = new VectorGlassCore();
    window.App.init();
});

