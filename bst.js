/**
 * Binary Search Tree with Step Recording for Animation
 * Each step contains: { node, action, description }
 */

/**
 * BST Node
 */
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

/**
 * Action types for animation steps
 */
const Action = {
    VISITED: 'visited',
    COMPARED: 'compared',
    MOVED_LEFT: 'moved_left',
    MOVED_RIGHT: 'moved_right',
    INSERTED: 'inserted',
    FOUND: 'found',
    NOT_FOUND: 'not_found'
};

/**
 * Binary Search Tree with step-by-step recording
 */
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    /**
     * INSERT: Inserts a value and returns list of steps
     * @param {number} value - Value to insert
     * @returns {Array} List of steps: { node, action, description }
     */
    insert(value) {
        const steps = [];
        const newNode = new BSTNode(value);

        // Empty tree - insert as root
        if (this.root === null) {
            this.root = newNode;
            steps.push({
                node: value,
                action: Action.INSERTED,
                description: `Inserted ${value} as root`
            });
            return steps;
        }

        let current = this.root;

        while (true) {
            // Visit current node
            steps.push({
                node: current.value,
                action: Action.VISITED,
                description: `Visiting node ${current.value}`
            });

            // Compare
            steps.push({
                node: current.value,
                action: Action.COMPARED,
                description: `Comparing ${value} with ${current.value}`
            });

            if (value < current.value) {
                // Move left
                steps.push({
                    node: current.value,
                    action: Action.MOVED_LEFT,
                    description: `${value} < ${current.value}, moving left`
                });

                if (current.left === null) {
                    current.left = newNode;
                    steps.push({
                        node: value,
                        action: Action.INSERTED,
                        description: `Inserted ${value} as left child of ${current.value}`
                    });
                    return steps;
                }
                current = current.left;

            } else if (value > current.value) {
                // Move right
                steps.push({
                    node: current.value,
                    action: Action.MOVED_RIGHT,
                    description: `${value} > ${current.value}, moving right`
                });

                if (current.right === null) {
                    current.right = newNode;
                    steps.push({
                        node: value,
                        action: Action.INSERTED,
                        description: `Inserted ${value} as right child of ${current.value}`
                    });
                    return steps;
                }
                current = current.right;

            } else {
                // Duplicate - don't insert
                steps.push({
                    node: current.value,
                    action: Action.FOUND,
                    description: `${value} already exists, skipping`
                });
                return steps;
            }
        }
    }

    /**
     * SEARCH: Searches for a value and returns list of steps
     * @param {number} value - Value to search for
     * @returns {Array} List of steps: { node, action, description }
     */
    search(value) {
        const steps = [];

        if (this.root === null) {
            steps.push({
                node: null,
                action: Action.NOT_FOUND,
                description: `Tree is empty, ${value} not found`
            });
            return steps;
        }

        let current = this.root;

        while (current !== null) {
            // Visit current node
            steps.push({
                node: current.value,
                action: Action.VISITED,
                description: `Visiting node ${current.value}`
            });

            // Compare
            steps.push({
                node: current.value,
                action: Action.COMPARED,
                description: `Comparing ${value} with ${current.value}`
            });

            if (value === current.value) {
                // Found!
                steps.push({
                    node: current.value,
                    action: Action.FOUND,
                    description: `Found ${value}!`
                });
                return steps;

            } else if (value < current.value) {
                // Move left
                steps.push({
                    node: current.value,
                    action: Action.MOVED_LEFT,
                    description: `${value} < ${current.value}, moving left`
                });
                current = current.left;

            } else {
                // Move right
                steps.push({
                    node: current.value,
                    action: Action.MOVED_RIGHT,
                    description: `${value} > ${current.value}, moving right`
                });
                current = current.right;
            }
        }

        // Not found
        steps.push({
            node: null,
            action: Action.NOT_FOUND,
            description: `${value} not found in tree`
        });
        return steps;
    }

    /**
     * INORDER TRAVERSAL: Returns list of steps (Left → Root → Right)
     * @returns {Array} List of steps: { node, action, description }
     */
    inorderTraversal() {
        const steps = [];
        this._inorderHelper(this.root, steps);
        return steps;
    }

    /**
     * Helper for inorder traversal
     * @private
     */
    _inorderHelper(node, steps) {
        if (node === null) {
            return;
        }

        // Go left
        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._inorderHelper(node.left, steps);
        }

        // Visit current (process)
        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });

        // Go right
        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._inorderHelper(node.right, steps);
        }
    }

    /**
     * PREORDER TRAVERSAL: Returns list of steps (Root → Left → Right)
     * @returns {Array} List of steps
     */
    preorderTraversal() {
        const steps = [];
        this._preorderHelper(this.root, steps);
        return steps;
    }

    _preorderHelper(node, steps) {
        if (node === null) return;

        // Visit current first
        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });

        // Go left
        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._preorderHelper(node.left, steps);
        }

        // Go right
        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._preorderHelper(node.right, steps);
        }
    }

    /**
     * POSTORDER TRAVERSAL: Returns list of steps (Left → Right → Root)
     * @returns {Array} List of steps
     */
    postorderTraversal() {
        const steps = [];
        this._postorderHelper(this.root, steps);
        return steps;
    }

    _postorderHelper(node, steps) {
        if (node === null) return;

        // Go left
        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._postorderHelper(node.left, steps);
        }

        // Go right
        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._postorderHelper(node.right, steps);
        }

        // Visit current last
        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });
    }

    /**
     * Get tree structure for visualization
     */
    getTreeStructure() {
        const nodes = [];
        const edges = [];
        this._buildStructure(this.root, null, 'root', nodes, edges, 1);
        return { nodes, edges };
    }

    _buildStructure(node, parentId, position, nodes, edges, nodeId) {
        if (node === null) return;

        nodes.push({
            id: nodeId,
            value: node.value,
            position: position
        });

        if (parentId !== null) {
            edges.push({ from: parentId, to: nodeId, direction: position });
        }

        if (node.left) {
            this._buildStructure(node.left, nodeId, 'left', nodes, edges, nodeId * 2);
        }
        if (node.right) {
            this._buildStructure(node.right, nodeId, 'right', nodes, edges, nodeId * 2 + 1);
        }
    }

    /**
     * Clear the tree
     */
    clear() {
        this.root = null;
    }
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BSTNode, BinarySearchTree, Action };
} else if (typeof window !== 'undefined') {
    window.BSTNode = BSTNode;
    window.BinarySearchTree = BinarySearchTree;
    window.Action = Action;
}
