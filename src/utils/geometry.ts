import * as THREE from 'three';

/**
 * Creates a high-poly sphere geometry with a "girdled" bulge at the equator.
 */
export function createGirdledSphereGeometry(radius: number, detail: number) {
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    const position = geometry.attributes.position;
    const vector = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
        vector.fromBufferAttribute(position, i);
        
        // Calculate distance from equator (y = 0)
        const distFromEquator = Math.abs(vector.y);
        const bulgeThreshold = radius * 0.15;
        
        if (distFromEquator < bulgeThreshold) {
            // Apply a smooth bulge factor
            const factor = 1.0 + (1.0 - distFromEquator / bulgeThreshold) * 0.03;
            vector.x *= factor;
            vector.z *= factor;
            position.setXYZ(i, vector.x, vector.y, vector.z);
        }
    }
    
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}
