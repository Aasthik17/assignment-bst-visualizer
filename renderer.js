/**
 * SVG Renderer for BST Visualization
 * Handles node positioning and SVG drawing
 */

const CONFIG = {
    NODE_RADIUS: 25,
    HORIZONTAL_SPACING: 60,
    VERTICAL_SPACING: 80,
    PADDING: 50
};

/**
 * BSTRenderer - Computes positions and renders tree as SVG
 */
class BSTRenderer {
    constructor(svgElement) {
        this.svg = svgElement;
        this.nodePositions = new Map(); // value -> {x, y}
        this.nodeElements = new Map();  // value -> SVG element
    }

    /**
     * Compute node positions using subtree-width algorithm
     * @param {BSTNode} root - Root of the tree
     * @returns {object} - { width, positions }
     */
    computePositions(root) {
        this.nodePositions.clear();
        if (!root) return { width: 0 };

        // First pass: calculate subtree widths
        const widths = new Map();
        this._calculateWidths(root, widths);

        // Second pass: assign x,y positions
        this._assignPositions(root, 0, 0, widths);

        return {
            width: widths.get(root) || 1,
            positions: this.nodePositions
        };
    }

    /**
     * Calculate width of each subtree (bottom-up)
     */
    _calculateWidths(node, widths) {
        if (!node) return 0;

        const leftWidth = this._calculateWidths(node.left, widths);
        const rightWidth = this._calculateWidths(node.right, widths);
        const totalWidth = leftWidth + 1 + rightWidth;

        widths.set(node, totalWidth);
        return totalWidth;
    }

    /**
     * Assign x,y positions (top-down)
     */
    _assignPositions(node, depth, leftBound, widths) {
        if (!node) return;

        const leftWidth = node.left ? widths.get(node.left) : 0;

        // X position = left bound + left subtree width
        const x = CONFIG.PADDING + (leftBound + leftWidth) * CONFIG.HORIZONTAL_SPACING;
        const y = CONFIG.PADDING + depth * CONFIG.VERTICAL_SPACING;

        this.nodePositions.set(node.value, { x, y, node });

        // Recurse left
        this._assignPositions(node.left, depth + 1, leftBound, widths);

        // Recurse right (starts after this node)
        this._assignPositions(node.right, depth + 1, leftBound + leftWidth + 1, widths);
    }

    /**
     * Render the tree to SVG
     * @param {BSTNode} root - Root of the tree
     */
    render(root) {
        this.svg.innerHTML = '';
        this.nodeElements.clear();

        if (!root) {
            this._renderEmptyMessage();
            return;
        }

        // Compute positions
        const result = this.computePositions(root);

        // Calculate SVG dimensions
        const positions = Array.from(this.nodePositions.values());
        const maxX = Math.max(...positions.map(p => p.x)) + CONFIG.PADDING + CONFIG.NODE_RADIUS;
        const maxY = Math.max(...positions.map(p => p.y)) + CONFIG.PADDING + CONFIG.NODE_RADIUS;

        this.svg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
        this.svg.style.minWidth = `${maxX}px`;
        this.svg.style.minHeight = `${maxY}px`;

        // Create groups for layering
        const edgeGroup = this._createGroup('edges');
        const nodeGroup = this._createGroup('nodes');

        // Draw edges first (behind nodes)
        this._renderEdges(root, edgeGroup);

        // Draw nodes on top
        this._renderNodes(nodeGroup);
    }

    /**
     * Create SVG group element
     */
    _createGroup(className) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', className);
        this.svg.appendChild(g);
        return g;
    }

    /**
     * Render edges recursively
     */
    _renderEdges(node, group) {
        if (!node) return;

        const parentPos = this.nodePositions.get(node.value);

        if (node.left) {
            const childPos = this.nodePositions.get(node.left.value);
            this._drawEdge(parentPos, childPos, 'left', group);
            this._renderEdges(node.left, group);
        }

        if (node.right) {
            const childPos = this.nodePositions.get(node.right.value);
            this._drawEdge(parentPos, childPos, 'right', group);
            this._renderEdges(node.right, group);
        }
    }

    /**
     * Draw a single edge between parent and child
     */
    _drawEdge(parent, child, direction, group) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        // Calculate edge endpoints (from bottom of parent to top of child)
        const angle = Math.atan2(child.y - parent.y, child.x - parent.x);

        line.setAttribute('x1', parent.x + CONFIG.NODE_RADIUS * Math.cos(angle));
        line.setAttribute('y1', parent.y + CONFIG.NODE_RADIUS * Math.sin(angle));
        line.setAttribute('x2', child.x - CONFIG.NODE_RADIUS * Math.cos(angle));
        line.setAttribute('y2', child.y - CONFIG.NODE_RADIUS * Math.sin(angle));
        line.setAttribute('class', `edge edge-${direction}`);
        line.setAttribute('data-parent', parent.node.value);
        line.setAttribute('data-child', child.node.value);

        group.appendChild(line);
    }

    /**
     * Render all nodes
     */
    _renderNodes(group) {
        this.nodePositions.forEach((pos, value) => {
            const nodeGroup = this._drawNode(pos.x, pos.y, value);
            group.appendChild(nodeGroup);
            this.nodeElements.set(value, nodeGroup);
        });
    }

    /**
     * Draw a single node (circle + text)
     */
    _drawNode(x, y, value) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node-group');
        g.setAttribute('data-value', value);

        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', CONFIG.NODE_RADIUS);
        circle.setAttribute('class', 'node');

        // Text label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('class', 'node-label');
        text.textContent = value;

        g.appendChild(circle);
        g.appendChild(text);

        return g;
    }

    /**
     * Render empty tree message
     */
    _renderEmptyMessage() {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('class', 'empty-message');
        text.textContent = 'Tree is empty';
        this.svg.appendChild(text);
    }

    // ═══════════════════════════════════════════════════════════
    // HIGHLIGHTING METHODS
    // ═══════════════════════════════════════════════════════════

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.nodeElements.forEach(el => {
            el.querySelector('.node').classList.remove('active', 'compared', 'found', 'inserted', 'visited');
        });
        this.svg.querySelectorAll('.edge').forEach(edge => {
            edge.classList.remove('active');
        });
    }

    /**
     * Highlight a node with given state
     * @param {number} value - Node value
     * @param {string} state - 'active', 'compared', 'found', 'inserted', 'visited'
     */
    highlightNode(value, state) {
        const nodeEl = this.nodeElements.get(value);
        if (nodeEl) {
            nodeEl.querySelector('.node').classList.add(state);
        }
    }

    /**
     * Highlight edge going to a child
     * @param {number} parentValue - Parent node value
     * @param {string} direction - 'left' or 'right'
     */
    highlightEdge(parentValue, direction) {
        const edge = this.svg.querySelector(
            `.edge[data-parent="${parentValue}"]${direction ? `.edge-${direction}` : ''}`
        );
        if (edge) {
            edge.classList.add('active');
        }
    }

    /**
     * Get node element by value
     */
    getNodeElement(value) {
        return this.nodeElements.get(value);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BSTRenderer, CONFIG };
} else if (typeof window !== 'undefined') {
    window.BSTRenderer = BSTRenderer;
    window.RENDERER_CONFIG = CONFIG;
}
