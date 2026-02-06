/**
 * Animation Controller for BST Visualization
 * Controls step-by-step playback of BST operations
 */

class BSTAnimator {
    constructor(renderer) {
        this.renderer = renderer;
        this.steps = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.speed = 800; // ms per step
        this.timeoutId = null;

        // Callbacks
        this.onStepChange = null;
        this.onComplete = null;
        this.onStatusChange = null;
    }

    /**
     * Load steps for animation
     */
    setSteps(steps) {
        this.stop();
        this.steps = steps;
        this.currentIndex = 0;
        this._notifyStatus();
    }

    /**
     * Set animation speed
     * @param {number} ms - Milliseconds per step
     */
    setSpeed(ms) {
        this.speed = ms;
    }

    /**
     * Start or resume animation
     */
    play() {
        if (this.steps.length === 0) return;

        if (this.currentIndex >= this.steps.length) {
            this.currentIndex = 0;
        }

        this.isPlaying = true;
        this._notifyStatus();
        this._executeStep();
    }

    /**
     * Pause animation
     */
    pause() {
        this.isPlaying = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this._notifyStatus();
    }

    /**
     * Stop and reset
     */
    stop() {
        this.pause();
        this.currentIndex = 0;
        this.renderer.clearHighlights();
        this._notifyStatus();
    }

    /**
     * Step forward manually
     */
    stepForward() {
        if (this.currentIndex < this.steps.length) {
            this._highlightStep(this.steps[this.currentIndex]);
            this.currentIndex++;
            this._notifyStatus();

            if (this.currentIndex >= this.steps.length && this.onComplete) {
                this.onComplete();
            }
        }
    }

    /**
     * Step backward
     */
    stepBackward() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderer.clearHighlights();

            // Replay all steps up to current
            for (let i = 0; i < this.currentIndex; i++) {
                this._highlightStep(this.steps[i], false);
            }

            if (this.currentIndex > 0) {
                this._highlightStep(this.steps[this.currentIndex - 1]);
            }

            this._notifyStatus();
        }
    }

    /**
     * Jump to specific step
     */
    goToStep(index) {
        if (index >= 0 && index < this.steps.length) {
            this.currentIndex = index;
            this.renderer.clearHighlights();
            this._highlightStep(this.steps[index]);
            this._notifyStatus();
        }
    }

    /**
     * Get current progress
     */
    getProgress() {
        return {
            current: this.currentIndex,
            total: this.steps.length,
            percentage: this.steps.length > 0
                ? Math.round((this.currentIndex / this.steps.length) * 100)
                : 0,
            isPlaying: this.isPlaying,
            currentStep: this.steps[this.currentIndex] || null
        };
    }

    /**
     * Execute current step and schedule next
     */
    _executeStep() {
        if (!this.isPlaying || this.currentIndex >= this.steps.length) {
            this.isPlaying = false;
            this._notifyStatus();
            if (this.onComplete) this.onComplete();
            return;
        }

        const step = this.steps[this.currentIndex];
        this._highlightStep(step);
        this.currentIndex++;
        this._notifyStatus();

        this.timeoutId = setTimeout(() => {
            this._executeStep();
        }, this.speed);
    }

    /**
     * Apply visual highlighting for a step
     */
    _highlightStep(step, clearPrevious = true) {
        if (clearPrevious) {
            this.renderer.clearHighlights();
        }

        if (step.node === null) return;

        // Map action to highlight state
        const stateMap = {
            'visited': 'active',
            'compared': 'compared',
            'found': 'found',
            'inserted': 'inserted',
            'not_found': 'active',
            'moved_left': 'active',
            'moved_right': 'active'
        };

        const state = stateMap[step.action] || 'active';
        this.renderer.highlightNode(step.node, state);

        // Highlight edge for movement
        if (step.action === 'moved_left') {
            this.renderer.highlightEdge(step.node, 'left');
        } else if (step.action === 'moved_right') {
            this.renderer.highlightEdge(step.node, 'right');
        }

        // Notify step change
        if (this.onStepChange) {
            this.onStepChange(step, this.currentIndex, this.steps.length);
        }
    }

    /**
     * Notify status change
     */
    _notifyStatus() {
        if (this.onStatusChange) {
            this.onStatusChange(this.getProgress());
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BSTAnimator };
} else if (typeof window !== 'undefined') {
    window.BSTAnimator = BSTAnimator;
}
