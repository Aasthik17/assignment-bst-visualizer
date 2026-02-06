# Binary Search Tree with Animation Step Recording

A Binary Search Tree implementation that records each comparison and node visit step for visualization/animation purposes, similar to [Visualgo](https://visualgo.net/en/bst).

## Features

- **Insert** - Add values with step-by-step comparison recording
- **Search** - Find values with highlighted comparison path
- **Traversals** - Inorder, preorder, and postorder with step tracking
- **Animation Controller** - Play, pause, step through recorded operations
- **Tree Structure** - Get nodes/edges for visualization rendering

## Quick Start

```javascript
const { BinarySearchTree, AnimationController, StepType } = require('./bst.js');

const bst = new BinarySearchTree();

// Insert with steps
const insertResult = bst.insert(50);
console.log(insertResult.steps);  // Array of animation steps

// Search with steps
const searchResult = bst.search(50);
console.log(searchResult.found);  // true
console.log(searchResult.steps);  // Comparison steps

// Inorder traversal
const traversalResult = bst.inorderTraversal();
console.log(traversalResult.order);  // Sorted array
console.log(traversalResult.steps);  // Traversal steps
```

## Step Types

| Type | Description |
|------|-------------|
| `compare` | Value comparison |
| `visit` | Node being examined |
| `insert` | New node inserted |
| `found` | Search target found |
| `not_found` | Search target not in tree |
| `traverse` | Traversal processing node |
| `go_left` | Moving to left child |
| `go_right` | Moving to right child |
| `highlight` | Node highlighted |
| `complete` | Operation finished |

## Animation Controller

```javascript
const steps = bst.search(40).steps;
const animator = new AnimationController(steps);

animator.setSpeed(500);  // 500ms per step

animator.onStep((step, current, total) => {
    console.log(`Step ${current}/${total}: ${step.message}`);
});

animator.play();     // Auto-play
animator.pause();    // Pause
animator.stepForward();  // Manual step
animator.reset();    // Start over
```

## Run Demo

```bash
node demo.js
```

## API Reference

### BinarySearchTree

| Method | Returns | Description |
|--------|---------|-------------|
| `insert(value)` | `{success, value, steps}` | Insert value |
| `search(value)` | `{found, comparisons, path, steps}` | Find value |
| `inorderTraversal()` | `{order, steps}` | Left → Root → Right |
| `preorderTraversal()` | `{order, steps}` | Root → Left → Right |
| `postorderTraversal()` | `{order, steps}` | Left → Right → Root |
| `getTreeStructure()` | `{nodes, edges}` | For visualization |
| `getHeight()` | `number` | Tree height |
| `clear()` | - | Reset tree |

### AnimationController

| Method | Description |
|--------|-------------|
| `setSteps(steps)` | Load steps array |
| `setSpeed(ms)` | Set delay between steps |
| `play()` | Start/resume animation |
| `pause()` | Pause animation |
| `stepForward()` | Advance one step |
| `stepBackward()` | Go back one step |
| `reset()` | Return to start |
| `getProgress()` | Get current/total/percentage |