let adRemoverActive = false;

function toggleAdRemover() {
    adRemoverActive = !adRemoverActive;
    const toggleBtn = document.getElementById('adRemoverToggle');
    const statusText = document.getElementById('adStatusText');
    const adBox = document.getElementById('workspaceAdBox');

    if (adRemoverActive) {
        toggleBtn.classList.add('active');
        statusText.innerText = "AdRemover: ON";
        adBox.classList.add('blocked');
    } else {
        toggleBtn.classList.remove('active');
        statusText.innerText = "AdRemover: OFF";
        adBox.classList.remove('blocked');
    }
}

function buildLayersList() {
    const layersContainer = document.getElementById('layersContainer');
    const canvas = document.getElementById('vector-canvas');
    layersContainer.innerHTML = '';
    
    Array.from(canvas.children).reverse().forEach(el => {
        const id = el.getAttribute('id');
        const name = el.getAttribute('data-name') || id;
        
        const item = document.createElement('div');
        item.className = 'layer-item';
        item.setAttribute('data-id', id);
        item.onclick = () => selectElement(el);
        
        item.innerHTML = `
            <span>${name}</span>
            <button class="layer-del-btn" onclick="event.stopPropagation(); deleteLayerById('${id}')">✕</button>
        `;
        layersContainer.appendChild(item);
    });
}

function highlightLayerRow(id) {
    document.querySelectorAll('.layer-item').forEach(row => {
        if (row.getAttribute('data-id') === id) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
}

function deleteLayerById(id) {
    const el = document.getElementById(id);
    if (el) {
        if (selectedElement === el) deSelectAll();
        document.getElementById('vector-canvas').removeChild(el);
        buildLayersList();
    }
}

document.getElementById('adRemoverToggle').addEventListener('click', toggleAdRemover);

document.getElementById('btn-new').addEventListener('click', () => {
    deSelectAll();
    document.getElementById('vector-canvas').innerHTML = '';
    elementCount = 0;
    buildLayersList();
});

document.getElementById('btn-delete').addEventListener('click', () => {
    if (selectedElement) {
        deleteLayerById(selectedElement.getAttribute('id'));
    }
});

document.getElementById('btn-export').addEventListener('click', () => {
    deSelectAll();
    const svgData = new XMLSerializer().serializeToString(document.getElementById('vector-canvas'));
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "vectorglass-artboard.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

document.querySelectorAll('.tool-icon').forEach(btn => {
    btn.addEventListener('click', () => {
        const toolId = btn.id.replace('tool-', '');
        setTool(toolId);
    });
});
