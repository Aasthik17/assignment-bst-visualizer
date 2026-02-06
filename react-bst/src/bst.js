/**
 * Binary Search Tree Data Structure
 * With step recording for animation
 */

// Action types
export const Action = {
    VISITED: 'visited',
    COMPARED: 'compared',
    MOVED_LEFT: 'moved_left',
    MOVED_RIGHT: 'moved_right',
    INSERTED: 'inserted',
    FOUND: 'found',
    NOT_FOUND: 'not_found'
};

// BST Node class
export class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Insert with step recording
    insert(value) {
        const steps = [];
        const newNode = new BSTNode(value);

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
            steps.push({
                node: current.value,
                action: Action.VISITED,
                description: `Visiting node ${current.value}`
            });

            steps.push({
                node: current.value,
                action: Action.COMPARED,
                description: `Comparing ${value} with ${current.value}`
            });

            if (value < current.value) {
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
                steps.push({
                    node: current.value,
                    action: Action.FOUND,
                    description: `${value} already exists, skipping`
                });
                return steps;
            }
        }
    }

    // Search with step recording
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
            steps.push({
                node: current.value,
                action: Action.VISITED,
                description: `Visiting node ${current.value}`
            });

            steps.push({
                node: current.value,
                action: Action.COMPARED,
                description: `Comparing ${value} with ${current.value}`
            });

            if (value === current.value) {
                steps.push({
                    node: current.value,
                    action: Action.FOUND,
                    description: `Found ${value}!`
                });
                return steps;
            } else if (value < current.value) {
                steps.push({
                    node: current.value,
                    action: Action.MOVED_LEFT,
                    description: `${value} < ${current.value}, moving left`
                });
                current = current.left;
            } else {
                steps.push({
                    node: current.value,
                    action: Action.MOVED_RIGHT,
                    description: `${value} > ${current.value}, moving right`
                });
                current = current.right;
            }
        }

        steps.push({
            node: null,
            action: Action.NOT_FOUND,
            description: `${value} not found in tree`
        });
        return steps;
    }

    // Inorder traversal with step recording
    inorderTraversal() {
        const steps = [];
        this._inorderHelper(this.root, steps);
        return steps;
    }

    _inorderHelper(node, steps) {
        if (node === null) return;

        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._inorderHelper(node.left, steps);
        }

        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });

        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._inorderHelper(node.right, steps);
        }
    }

    // Preorder traversal (Root -> Left -> Right)
    preorderTraversal() {
        const steps = [];
        this._preorderHelper(this.root, steps);
        return steps;
    }

    _preorderHelper(node, steps) {
        if (node === null) return;

        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });

        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._preorderHelper(node.left, steps);
        }

        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._preorderHelper(node.right, steps);
        }
    }

    // Postorder traversal (Left -> Right -> Root)
    postorderTraversal() {
        const steps = [];
        this._postorderHelper(this.root, steps);
        return steps;
    }

    _postorderHelper(node, steps) {
        if (node === null) return;

        if (node.left !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_LEFT,
                description: `Moving left from ${node.value}`
            });
            this._postorderHelper(node.left, steps);
        }

        if (node.right !== null) {
            steps.push({
                node: node.value,
                action: Action.MOVED_RIGHT,
                description: `Moving right from ${node.value}`
            });
            this._postorderHelper(node.right, steps);
        }

        steps.push({
            node: node.value,
            action: Action.VISITED,
            description: `Visited ${node.value}`
        });
    }

    // Clear tree
    clear() {
        this.root = null;
    }
}

