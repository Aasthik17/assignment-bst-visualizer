/**
 * Main Application - BST Visualizer
 * Wires together BST, Renderer, and Animator
 */

document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════════════
    // Initialize Components
    // ═══════════════════════════════════════════════════════════

    const svg = document.getElementById('tree-svg');
    const bst = new BinarySearchTree();
    const renderer = new BSTRenderer(svg);
    const animator = new BSTAnimator(renderer);

    // UI Elements
    const insertInput = document.getElementById('insert-input');
    const insertBtn = document.getElementById('insert-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const inorderBtn = document.getElementById('inorder-btn');
    const preorderBtn = document.getElementById('preorder-btn');
    const postorderBtn = document.getElementById('postorder-btn');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stepBackBtn = document.getElementById('step-back-btn');
    const stepFwdBtn = document.getElementById('step-fwd-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const clearBtn = document.getElementById('clear-btn');
    const randomBtn = document.getElementById('random-btn');
    const statusMessage = document.getElementById('status-message');
    const stepCounter = document.getElementById('step-counter');
    const progressFill = document.getElementById('progress-fill');

    // ═══════════════════════════════════════════════════════════
    // Animator Callbacks
    // ═══════════════════════════════════════════════════════════

    animator.onStepChange = (step, current, total) => {
        updateStatus(step.description, step.action);
    };

    animator.onStatusChange = (progress) => {
        stepCounter.textContent = `Step ${progress.current}/${progress.total}`;
        progressFill.style.width = `${progress.percentage}%`;

        // Update button states
        playBtn.disabled = progress.isPlaying;
        pauseBtn.disabled = !progress.isPlaying;
    };

    animator.onComplete = () => {
        updateStatus('Animation complete!', 'complete');
    };

    // ═══════════════════════════════════════════════════════════
    // Event Handlers
    // ═══════════════════════════════════════════════════════════

    // Insert
    insertBtn.addEventListener('click', () => {
        const value = parseInt(insertInput.value);
        if (isNaN(value)) {
            updateStatus('Please enter a valid number', 'error');
            return;
        }

        const steps = bst.insert(value);
        renderer.render(bst.root);
        animator.setSteps(steps);
        animator.play();
        insertInput.value = '';
    });

    insertInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') insertBtn.click();
    });

    // Search
    searchBtn.addEventListener('click', () => {
        const value = parseInt(searchInput.value);
        if (isNaN(value)) {
            updateStatus('Please enter a valid number', 'error');
            return;
        }

        const steps = bst.search(value);
        animator.setSteps(steps);
        animator.play();
        searchInput.value = '';
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    // Traversals
    inorderBtn.addEventListener('click', () => {
        const steps = bst.inorderTraversal();
        animator.setSteps(steps);
        animator.play();
    });

    preorderBtn.addEventListener('click', () => {
        const steps = bst.preorderTraversal();
        animator.setSteps(steps);
        animator.play();
    });

    postorderBtn.addEventListener('click', () => {
        const steps = bst.postorderTraversal();
        animator.setSteps(steps);
        animator.play();
    });

    // Animation Controls
    playBtn.addEventListener('click', () => animator.play());
    pauseBtn.addEventListener('click', () => animator.pause());
    stepBackBtn.addEventListener('click', () => animator.stepBackward());
    stepFwdBtn.addEventListener('click', () => animator.stepForward());
    resetBtn.addEventListener('click', () => {
        animator.stop();
        updateStatus('Ready. Insert values to build the tree.', 'ready');
    });

    // Speed Control
    speedSlider.addEventListener('input', () => {
        const speed = parseInt(speedSlider.value);
        animator.setSpeed(speed);
        speedValue.textContent = `${speed}ms`;
    });

    // Quick Build Buttons
    document.querySelectorAll('.quick-actions .btn[data-values]').forEach(btn => {
        btn.addEventListener('click', () => {
            const values = btn.dataset.values.split(',').map(Number);
            buildTree(values);
        });
    });

    // Random Tree
    randomBtn.addEventListener('click', () => {
        const count = Math.floor(Math.random() * 5) + 5; // 5-9 nodes
        const values = [];
        while (values.length < count) {
            const val = Math.floor(Math.random() * 100) + 1;
            if (!values.includes(val)) values.push(val);
        }
        buildTree(values);
    });

    // Clear Tree
    clearBtn.addEventListener('click', () => {
        bst.clear();
        renderer.render(null);
        animator.stop();
        updateStatus('Tree cleared. Ready to build.', 'ready');
    });

    // ═══════════════════════════════════════════════════════════
    // Helper Functions
    // ═══════════════════════════════════════════════════════════

    function buildTree(values) {
        bst.clear();
        values.forEach(v => bst.insert(v));
        renderer.render(bst.root);
        animator.stop();
        updateStatus(`Built tree with [${values.join(', ')}]`, 'ready');
    }

    function updateStatus(message, type = 'info') {
        statusMessage.innerHTML = message;
        statusMessage.className = 'status-message';
        if (type) statusMessage.classList.add(type);
    }

    // ═══════════════════════════════════════════════════════════
    // Initialize with empty tree
    // ═══════════════════════════════════════════════════════════

    renderer.render(null);
    updateStatus('Ready. Insert values to build the tree.', 'ready');
});
