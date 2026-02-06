import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Action } from './bst';

// Configuration
const CONFIG = {
    NODE_RADIUS: 25,
    HORIZONTAL_SPACING: 60,
    VERTICAL_SPACING: 80,
    PADDING: 50
};

/**
 * Compute positions for all nodes using subtree-width algorithm
 */
function computePositions(root) {
    if (!root) return new Map();

    const positions = new Map();
    const widths = new Map();

    function calculateWidths(node) {
        if (!node) return 0;
        const leftWidth = calculateWidths(node.left);
        const rightWidth = calculateWidths(node.right);
        const totalWidth = leftWidth + 1 + rightWidth;
        widths.set(node, totalWidth);
        return totalWidth;
    }

    function assignPositions(node, depth, leftBound) {
        if (!node) return;

        const leftWidth = node.left ? widths.get(node.left) : 0;
        const x = CONFIG.PADDING + (leftBound + leftWidth) * CONFIG.HORIZONTAL_SPACING;
        const y = CONFIG.PADDING + depth * CONFIG.VERTICAL_SPACING;

        positions.set(node.value, { x, y, node });

        assignPositions(node.left, depth + 1, leftBound);
        assignPositions(node.right, depth + 1, leftBound + leftWidth + 1);
    }

    calculateWidths(root);
    assignPositions(root, 0, 0);

    return positions;
}

/**
 * Collect all edges from the tree
 */
function collectEdges(root, positions) {
    const edges = [];

    function traverse(node) {
        if (!node) return;

        const parentPos = positions.get(node.value);

        if (node.left) {
            const childPos = positions.get(node.left.value);
            edges.push({ parent: parentPos, child: childPos, direction: 'left' });
            traverse(node.left);
        }

        if (node.right) {
            const childPos = positions.get(node.right.value);
            edges.push({ parent: parentPos, child: childPos, direction: 'right' });
            traverse(node.right);
        }
    }

    traverse(root);
    return edges;
}

/**
 * BST Visualizer React Component with Animation Controls
 */
const BSTVisualizer = forwardRef(function BSTVisualizer({ root, steps, animationSpeed = 800, traversalType = null }, ref) {
    const [positions, setPositions] = useState(new Map());
    const [edges, setEdges] = useState([]);
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [highlightState, setHighlightState] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const timeoutRef = useRef(null);
    const stepsRef = useRef([]);

    // Compute positions when root changes
    useEffect(() => {
        const newPositions = computePositions(root);
        setPositions(newPositions);
        setEdges(collectEdges(root, newPositions));
    }, [root]);

    // Update steps ref when steps change
    useEffect(() => {
        stepsRef.current = steps || [];
        if (steps && steps.length > 0) {
            setStepIndex(-1);
            setCurrentStep(null);
            setHighlightedNode(null);
            setHighlightState(null);
            setVisitedNodes([]);
        }
    }, [steps]);

    // Apply step highlight
    const applyStep = useCallback((index) => {
        if (index < 0 || index >= stepsRef.current.length) {
            setCurrentStep(null);
            setHighlightedNode(null);
            setHighlightState(null);
            return;
        }

        const step = stepsRef.current[index];
        setCurrentStep(step);
        setStepIndex(index);

        if (step.node !== null) {
            setHighlightedNode(step.node);
            setHighlightState(step.action);

            // Track visited nodes for traversal result
            if (step.action === Action.VISITED) {
                setVisitedNodes(prev => {
                    if (!prev.includes(step.node)) {
                        return [...prev, step.node];
                    }
                    return prev;
                });
            }
        }
    }, []);

    // Step forward
    const stepForward = useCallback(() => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < stepsRef.current.length) {
            applyStep(nextIndex);
            return true;
        }
        return false;
    }, [stepIndex, applyStep]);

    // Step backward
    const stepBackward = useCallback(() => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            applyStep(prevIndex);
            return true;
        } else if (stepIndex === 0) {
            setStepIndex(-1);
            setCurrentStep(null);
            setHighlightedNode(null);
            setHighlightState(null);
        }
        return false;
    }, [stepIndex, applyStep]);

    // Play animation
    const play = useCallback(() => {
        if (stepsRef.current.length === 0) return;
        setIsPlaying(true);
    }, []);

    // Stop animation
    const stop = useCallback(() => {
        setIsPlaying(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Reset animation
    const reset = useCallback(() => {
        stop();
        setStepIndex(-1);
        setCurrentStep(null);
        setHighlightedNode(null);
        setHighlightState(null);
        setVisitedNodes([]);
    }, [stop]);

    // Expose controls via ref
    useImperativeHandle(ref, () => ({
        play,
        stop,
        reset,
        stepForward,
        stepBackward,
        isPlaying,
        currentIndex: stepIndex,
        totalSteps: stepsRef.current.length
    }), [play, stop, reset, stepForward, stepBackward, isPlaying, stepIndex]);

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying) return;

        const executeStep = () => {
            const nextIndex = stepIndex + 1;
            if (nextIndex >= stepsRef.current.length) {
                setIsPlaying(false);
                return;
            }
            applyStep(nextIndex);
        };

        timeoutRef.current = setTimeout(executeStep, animationSpeed);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isPlaying, stepIndex, animationSpeed, applyStep]);

    // Calculate SVG dimensions
    const positionsArray = Array.from(positions.values());
    const svgWidth = positionsArray.length > 0
        ? Math.max(...positionsArray.map(p => p.x)) + CONFIG.PADDING + CONFIG.NODE_RADIUS + 50
        : 400;
    const svgHeight = positionsArray.length > 0
        ? Math.max(...positionsArray.map(p => p.y)) + CONFIG.PADDING + CONFIG.NODE_RADIUS + 50
        : 300;

    // Get node class based on highlight state
    const getNodeClass = (value) => {
        if (highlightedNode !== value) return 'node';

        const stateClasses = {
            [Action.VISITED]: 'node active',
            [Action.COMPARED]: 'node compared',
            [Action.FOUND]: 'node found',
            [Action.INSERTED]: 'node inserted',
            [Action.MOVED_LEFT]: 'node active',
            [Action.MOVED_RIGHT]: 'node active',
            [Action.NOT_FOUND]: 'node'
        };

        return stateClasses[highlightState] || 'node';
    };

    const totalSteps = stepsRef.current.length;
    const displayIndex = stepIndex + 1;

    return (
        <div className="bst-visualizer">
            {/* Status Bar */}
            <div className="status-bar">
                <div className="status-message">
                    {currentStep ? currentStep.description : 'Ready'}
                </div>
                <div className="step-counter">
                    Step {displayIndex}/{totalSteps}
                </div>
            </div>

            {/* Animation Controls */}
            <div className="animation-controls">
                <button
                    className="control-btn"
                    onClick={reset}
                    title="Reset"
                >
                    ⏮ Reset
                </button>
                <button
                    className="control-btn"
                    onClick={stepBackward}
                    disabled={stepIndex < 0}
                    title="Step Back"
                >
                    ◀ Back
                </button>
                {isPlaying ? (
                    <button
                        className="control-btn control-btn-primary"
                        onClick={stop}
                        title="Pause"
                    >
                        ⏸ Pause
                    </button>
                ) : (
                    <button
                        className="control-btn control-btn-primary"
                        onClick={play}
                        disabled={totalSteps === 0 || displayIndex >= totalSteps}
                        title="Play"
                    >
                        ▶ Play
                    </button>
                )}
                <button
                    className="control-btn"
                    onClick={stepForward}
                    disabled={displayIndex >= totalSteps}
                    title="Step Forward"
                >
                    Next ▶
                </button>
            </div>

            {/* SVG Tree */}
            <div className="svg-container">
                <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                    {/* Edges */}
                    <g className="edges">
                        {edges.map((edge, i) => {
                            const angle = Math.atan2(
                                edge.child.y - edge.parent.y,
                                edge.child.x - edge.parent.x
                            );
                            return (
                                <line
                                    key={i}
                                    x1={edge.parent.x + CONFIG.NODE_RADIUS * Math.cos(angle)}
                                    y1={edge.parent.y + CONFIG.NODE_RADIUS * Math.sin(angle)}
                                    x2={edge.child.x - CONFIG.NODE_RADIUS * Math.cos(angle)}
                                    y2={edge.child.y - CONFIG.NODE_RADIUS * Math.sin(angle)}
                                    className="edge"
                                />
                            );
                        })}
                    </g>

                    {/* Nodes */}
                    <g className="nodes">
                        {Array.from(positions.entries()).map(([value, pos]) => (
                            <g key={value} className="node-group">
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={CONFIG.NODE_RADIUS}
                                    className={getNodeClass(value)}
                                />
                                <text
                                    x={pos.x}
                                    y={pos.y}
                                    className="node-label"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {value}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Empty message */}
                    {positions.size === 0 && (
                        <text x="50%" y="50%" className="empty-message" textAnchor="middle">
                            Tree is empty
                        </text>
                    )}
                </svg>
            </div>

            {/* Legend */}
            <div className="legend">
                <div className="legend-item"><span className="legend-dot default"></span> Default</div>
                <div className="legend-item"><span className="legend-dot active"></span> Visiting</div>
                <div className="legend-item"><span className="legend-dot compared"></span> Compared</div>
                <div className="legend-item"><span className="legend-dot found"></span> Found</div>
                <div className="legend-item"><span className="legend-dot inserted"></span> Inserted</div>
            </div>

            {/* Traversal Result */}
            {traversalType && visitedNodes.length > 0 && (
                <div className="traversal-result">
                    <div className="result-label">
                        {traversalType} Result:
                    </div>
                    <div className="result-values">
                        [{visitedNodes.join(', ')}]
                    </div>
                </div>
            )}
        </div>
    );
});

export default BSTVisualizer;

