import * as THREE from 'three';

/**
 * Generates a high-fidelity 4K procedural normal map for cricket ball stitching.
 */
export function createStitchTexture() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Neutral normal
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, size, size);

    const rowCount = 6;
    const rowSpacing = 32;
    const stitchCount = 80;
    const stitchWidth = 12;
    const stitchLength = 24;

    for (let r = 0; r < rowCount; r++) {
        const y = (size / 2) - ((rowCount - 1) * rowSpacing / 2) + (r * rowSpacing);
        for (let i = 0; i < stitchCount; i++) {
            const x = (i / stitchCount) * size;
            
            const offsetX = (Math.random() - 0.5) * 4;
            const offsetY = (Math.random() - 0.5) * 4;
            
            const gradient = ctx.createRadialGradient(x + offsetX, y + offsetY, 0, x + offsetX, y + offsetY, stitchLength/2);
            gradient.addColorStop(0, 'rgb(200, 200, 255)');
            gradient.addColorStop(0.8, 'rgb(160, 160, 255)');
            gradient.addColorStop(1, 'rgb(128, 128, 255)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(x + offsetX, y + offsetY, stitchLength / 2, stitchWidth / 2, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
}

/**
 * Generates a realistic 4K leather grain normal map with pores and micro-scratches.
 */
export function createLeatherNormalMap() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, size, size);

    // Fine pores
    for (let i = 0; i < 100000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 1.5 + 0.5;
        const val = 128 - Math.random() * 30;
        ctx.fillStyle = `rgb(${val}, ${val}, 255)`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Micro-scratches
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Generates a 4K gold leaf branding texture.
 */
export function createBrandingTexture() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Arched KOOKABURRA
    ctx.font = 'bold 220px serif';
    const text = "KOOKABURRA";
    const radius = 700;
    const startAngle = -Math.PI / 2 - 0.7;
    const endAngle = -Math.PI / 2 + 0.7;
    
    for (let i = 0; i < text.length; i++) {
        const angle = startAngle + (i / (text.length - 1)) * (endAngle - startAngle);
        ctx.save();
        ctx.translate(size / 2 + Math.cos(angle) * radius, size / 2 + Math.sin(angle) * radius);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }

    // Bird Logo
    ctx.font = 'bold 320px serif';
    ctx.fillText('𓅦', size / 2, size / 2);
    
    // Bottom COUNTY MATCH
    ctx.font = 'bold 140px serif';
    ctx.fillText('COUNTY MATCH', size / 2, size / 2 + 450);
    
    // Bottom A
    ctx.font = 'bold 120px serif';
    ctx.fillText('A', size / 2, size / 2 + 650);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

/**
 * Generates a 4K roughness map (Leather: 0.4, Gold: 0.25).
 */
export function createRoughnessMap() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Leather base roughness (0.4)
    ctx.fillStyle = 'rgb(102, 102, 102)';
    ctx.fillRect(0, 0, size, size);

    // Branding area (Gold: 0.25)
    ctx.fillStyle = 'rgb(64, 64, 64)';
    // Simplified: draw a circle where branding usually is
    ctx.beginPath();
    ctx.arc(size/2, size/2, 1200, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Generates a 4K metalness map (Gold: 1.0, Leather: 0.0).
 */
export function createMetalnessMap() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Leather base metalness (0.0)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);

    // Branding area (Gold: 1.0)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(size/2, size/2, 1200, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Generates a 4K AO map for leather pores.
 */
export function createAOMap() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Darken pores
    for (let i = 0; i < 200000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 1.5;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Generates a 4K alpha map for cricket ball stitching.
 */
export function createStitchAlphaMap() {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Transparent background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);

    const rowCount = 6;
    const rowSpacing = 32;
    const stitchCount = 80;
    const stitchWidth = 12;
    const stitchLength = 24;

    ctx.fillStyle = 'white';
    for (let r = 0; r < rowCount; r++) {
        const y = (size / 2) - ((rowCount - 1) * rowSpacing / 2) + (r * rowSpacing);
        for (let i = 0; i < stitchCount; i++) {
            const x = (i / stitchCount) * size;
            const offsetX = (Math.random() - 0.5) * 4;
            const offsetY = (Math.random() - 0.5) * 4;
            
            ctx.beginPath();
            ctx.ellipse(x + offsetX, y + offsetY, stitchLength / 2, stitchWidth / 2, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Generates a 4K base color map with custom gradient.
 */
export function createLeatherColorMap(color1 = '#5A0A0A', color2 = '#2D0505') {
    const size = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}
