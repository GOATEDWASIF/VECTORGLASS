let currentTool = 'select';
let selectedElement = null;
let isDrawing = false;
let startX, startY;
let activeDraftElement = null;
let elementCount = 0;

const canvas = document.getElementById('vector-canvas');

function setTool(toolName) {
    currentTool = toolName;
    document.querySelectorAll('.tool-icon').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tool-${toolName}`).classList.add('active');
    
    const textRow = document.getElementById('text-input-row');
    if (textRow) {
        textRow.style.display = (toolName === 'text') ? 'flex' : 'none';
    }

    if (toolName !== 'select') {
        deSelectAll();
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    if (currentTool === 'select') {
        if (e.target !== canvas) {
            selectElement(e.target);
        } else {
            deSelectAll();
        }
    } else {
        isDrawing = true;
        const fill = document.getElementById('fillColor').value;
        const stroke = document.getElementById('strokeColor').value;
        const strokeW = document.getElementById('strokeWidth').value;
        elementCount++;
        
        if (currentTool === 'rect') {
            activeDraftElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            activeDraftElement.setAttribute("x", startX);
            activeDraftElement.setAttribute("y", startY);
            activeDraftElement.setAttribute("id", `rect-${elementCount}`);
            activeDraftElement.setAttribute("data-name", `Rectangle ${elementCount}`);
            activeDraftElement.setAttribute("fill", fill);
        } else if (currentTool === 'circle') {
            activeDraftElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            activeDraftElement.setAttribute("cx", startX);
            activeDraftElement.setAttribute("cy", startY);
            activeDraftElement.setAttribute("id", `circle-${elementCount}`);
            activeDraftElement.setAttribute("data-name", `Ellipse ${elementCount}`);
            activeDraftElement.setAttribute("fill", fill);
        } else if (currentTool === 'line') {
            activeDraftElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            activeDraftElement.setAttribute("x1", startX);
            activeDraftElement.setAttribute("y1", startY);
            activeDraftElement.setAttribute("x2", startX);
            activeDraftElement.setAttribute("y2", startY);
            activeDraftElement.setAttribute("id", `line-${elementCount}`);
            activeDraftElement.setAttribute("data-name", `Line ${elementCount}`);
            activeDraftElement.setAttribute("fill", "none");
        } else if (currentTool === 'text') {
            activeDraftElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            activeDraftElement.setAttribute("x", startX);
            activeDraftElement.setAttribute("y", startY);
            activeDraftElement.setAttribute("id", `text-${elementCount}`);
            activeDraftElement.setAttribute("data-name", `Text ${elementCount}`);
            activeDraftElement.setAttribute("fill", fill);
            activeDraftElement.textContent = document.getElementById('textString').value || "Text";
            activeDraftElement.setAttribute("font-size", "24");
            activeDraftElement.setAttribute("font-family", "sans-serif");
        }

        activeDraftElement.setAttribute("stroke", stroke);
        activeDraftElement.setAttribute("stroke-width", strokeW);
        canvas.appendChild(activeDraftElement);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !activeDraftElement) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (currentTool === 'rect') {
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        activeDraftElement.setAttribute("x", Math.min(currentX, startX));
        activeDraftElement.setAttribute("y", Math.min(currentY, startY));
        activeDraftElement.setAttribute("width", width);
        activeDraftElement.setAttribute("height", height);
    } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        activeDraftElement.setAttribute("r", radius);
    } else if (currentTool === 'line') {
        activeDraftElement.setAttribute("x2", currentX);
        activeDraftElement.setAttribute("y2", currentY);
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        if (activeDraftElement) {
            buildLayersList();
            selectElement(activeDraftElement);
        }
        activeDraftElement = null;
        setTool('select');
    }
});

function selectElement(el) {
    deSelectAll();
    selectedElement = el;
    selectedElement.style.outline = "1px dashed #6366f1";
    highlightLayerRow(selectedElement.getAttribute('id'));
}

function deSelectAll() {
    if (selectedElement) selectedElement.style.outline = "none";
    selectedElement = null;
    highlightLayerRow(null);
}

function updateSelectedProperty() {
    if (!selectedElement) return;
    if (selectedElement.tagName !== 'line') {
        selectedElement.setAttribute('fill', document.getElementById('fillColor').value);
    }
    selectedElement.setAttribute('stroke', document.getElementById('strokeColor').value);
    selectedElement.setAttribute('stroke-width', document.getElementById('strokeWidth').value);
    if (selectedElement.tagName === 'text') {
        selectedElement.textContent = document.getElementById('textString').value;
    }
}

document.getElementById('fillColor').addEventListener('input', updateSelectedProperty);
document.getElementById('strokeColor').addEventListener('input', updateSelectedProperty);
document.getElementById('strokeWidth').addEventListener('input', updateSelectedProperty);
if(document.getElementById('textString')) {
    document.getElementById('textString').addEventListener('input', updateSelectedProperty);
}
