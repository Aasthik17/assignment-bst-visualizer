import { useState, useEffect } from 'react';
import './Tutorial.css';

const TUTORIAL_STEPS = [
    {
        target: null,
        title: 'Welcome to BST Visualizer! 🌳',
        content: 'This interactive tool helps you understand Binary Search Trees through visualization. Let\'s take a quick tour!',
        position: 'center'
    },
    {
        target: '.controls section:nth-child(1)',
        title: 'Insert Nodes',
        content: 'Enter a number and click "Insert" to add nodes to the tree. Watch as the BST property is maintained!',
        position: 'right'
    },
    {
        target: '.controls section:nth-child(2)',
        title: 'Search Nodes',
        content: 'Search for a value to see the path taken through the tree. Found nodes are highlighted in green.',
        position: 'right'
    },
    {
        target: '.traversal-buttons',
        title: 'Tree Traversals',
        content: 'Explore three traversal methods:\n• Inorder (L→N→R): Sorted order\n• Preorder (N→L→R): Root first\n• Postorder (L→R→N): Root last',
        position: 'right'
    },
    {
        target: '.animation-controls',
        title: 'Animation Controls',
        content: 'Control the animation playback. Play, pause, step forward/back, or reset to watch operations at your pace.',
        position: 'bottom'
    },
    {
        target: '.speed-control',
        title: 'Animation Speed',
        content: 'Adjust the slider to change animation speed. Slower speeds help understand each step better.',
        position: 'right'
    },
    {
        target: '.legend',
        title: 'Color Legend',
        content: 'Each color represents a different state: visiting (orange), comparing (pink), found (green), or inserted (purple).',
        position: 'top'
    },
    {
        target: null,
        title: 'Ready to Explore! 🚀',
        content: 'Click "Sample Tree" to start with a pre-built tree, or insert your own values. Enjoy learning!',
        position: 'center'
    }
];

export default function Tutorial({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    const step = TUTORIAL_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;

    // Find and highlight target element
    useEffect(() => {
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, step.target]);

    const handleNext = () => {
        if (isLast) {
            handleComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirst) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('bst-tutorial-completed', 'true');
        onComplete?.();
    };

    const handleSkip = () => {
        handleComplete();
    };

    if (!isVisible) return null;

    // Calculate tooltip position
    const getTooltipStyle = () => {
        if (!targetRect || step.position === 'center') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            };
        }

        const padding = 20;
        const tooltipWidth = 320;

        switch (step.position) {
            case 'right':
                return {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    left: `${targetRect.right + padding}px`,
                    transform: 'translateY(-50%)'
                };
            case 'bottom':
                return {
                    top: `${targetRect.bottom + padding}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)'
                };
            case 'top':
                return {
                    top: `${targetRect.top - padding}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translate(-50%, -100%)'
                };
            case 'left':
                return {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    left: `${targetRect.left - tooltipWidth - padding}px`,
                    transform: 'translateY(-50%)'
                };
            default:
                return {};
        }
    };

    return (
        <div className="tutorial-overlay">
            {/* Spotlight effect */}
            {targetRect && (
                <div
                    className="tutorial-spotlight"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16
                    }}
                />
            )}

            {/* Tooltip */}
            <div className="tutorial-tooltip" style={getTooltipStyle()}>
                <div className="tutorial-header">
                    <h3>{step.title}</h3>
                    <button className="tutorial-close" onClick={handleSkip} title="Skip tutorial">
                        ✕
                    </button>
                </div>

                <p className="tutorial-content">{step.content}</p>

                <div className="tutorial-footer">
                    <div className="tutorial-progress">
                        {TUTORIAL_STEPS.map((_, idx) => (
                            <span
                                key={idx}
                                className={`progress-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="tutorial-buttons">
                        {!isFirst && (
                            <button onClick={handlePrev} className="btn-prev">
                                ← Back
                            </button>
                        )}
                        <button onClick={handleNext} className="btn-next">
                            {isLast ? 'Get Started' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
