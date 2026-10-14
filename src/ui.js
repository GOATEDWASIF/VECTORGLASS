/**
 * User Interface & Soft Cursor Rendering Framework 
 */
class UserInterfaceController {
    constructor(core) {
        this.core = core;
        this.adRemoverStatus = true;
    }

    init() {
        this.setupCustomCursor();
        this.bindPropertyControls();
        this.toggleAdRemover(); // Default to runtime active initialization configuration
    }

    setupCustomCursor() {
        const cursor = document.getElementById('vg-custom-cursor');
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        window.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        window.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    }

    bindPropertyControls() {
        const triggers = ['prop-fill-type', 'prop-fill-color', 'prop-stroke-color', 'prop-stroke-width'];
        triggers.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.applyPropertiesToSelected());
        });
    }

    toggleAdRemover() {
        this.adRemoverStatus = !this.adRemoverStatus;
        const pill = document.getElementById('ad-remover-pill');
        const text = document.getElementById('ad-status-text');
        const wrapper = document.getElementById('ad-wrapper');

        if (this.adRemoverStatus) {
            pill.className = 'adblock-toggle active glass-panel';
            text.innerText = 'AdRemover: Active';
            wrapper.classList.add('adblock-eliminated');
        } else {
            pill.className = 'adblock-toggle disabled glass-panel';
            text.innerText = 'AdRemover: Disabled';
            wrapper.classList.remove('adblock-eliminated');
        }
    }

    syncLayerTree() {
        const container = document.getElementById('layer-tree');
        container.innerHTML = '';
        
        // Render top layer visual precedence indexes
        [...this.core.canvasManager.registry].reverse().forEach(nodeData => {
            const row = document.createElement('div');
            row.className = `layer-node ${this.core.canvasManager.selectedElement?.id === nodeData.id ? 'active' : ''}`;
            row.onclick = () => this.core.canvasManager.selectNode(nodeData.domElement);
            
            row.innerHTML = `
                <span>${nodeData.name}</span>
                <button onclick="event.stopPropagation(); App.canvasManager.selectNode(document.getElementById('${nodeData.id}')); App.canvasManager.deleteSelected();">✕</button>
            `;
            container.appendChild(row);
        });
    }

    highlightLayerNode(id) {
        document.querySelectorAll('.layer-node').forEach(el => el.classList.remove('active'));
        this.syncLayerTree();
    }

    reflectElementProperties(node) {
        const fill = node.getAttribute('fill');
        const stroke = node.getAttribute('stroke');
        const strokeW = node.getAttribute('stroke-width');

        if (fill && fill.startsWith('url')) {
            document.getElementById('prop-fill-type').value = 'gradient';
        } else if (fill === 'none') {
            document.getElementById('prop-fill-type').value = 'none';
        } else {
            document.getElementById('prop-fill-type').value = 'solid';
            if (fill) document.getElementById('prop-fill-color').value = fill;
        }

        if (stroke) document.getElementById('prop-stroke-color').value = stroke;
        if (strokeW) document.getElementById('prop-stroke-width').value = strokeW;
    }

    applyPropertiesToSelected() {
        const activeNode = this.core.canvasManager.selectedElement;
        if (!activeNode) return;

        const fillType = document.getElementById('prop-fill-type').value;
        const strokeColor = document.getElementById('prop-stroke-color').value;
        const strokeWidth = document.getElementById('prop-stroke-width').value;

        activeNode.setAttribute('stroke', strokeColor);
        activeNode.setAttribute('stroke-width', strokeWidth);

        if (fillType === 'none') {
            activeNode.setAttribute('fill', 'none');
        } else if (fillType === 'solid') {
            activeNode.setAttribute('fill', document.getElementById('prop-fill-color').value);
        } else if (fillType === 'gradient') {
            // Re-instantiate gradient generation matrix bindings if tool initialized
            const gradId = `grad-${activeNode.id}`;
            activeNode.setAttribute('fill', `url(#${gradId})`);
        }
        
        // Refresh overlays dynamically
        this.core.canvasManager.selectNode(activeNode);
    }
}
