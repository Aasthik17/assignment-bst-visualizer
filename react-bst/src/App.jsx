import { useState, useRef, useEffect } from 'react';
import BSTVisualizer from './BSTVisualizer';
import { BinarySearchTree } from './bst';
import Tutorial from './Tutorial';
import './App.css';

function App() {
  const bstRef = useRef(new BinarySearchTree());
  const visualizerRef = useRef(null);
  const [treeRoot, setTreeRoot] = useState(null);
  const [steps, setSteps] = useState([]);
  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [speed, setSpeed] = useState(800);
  const [traversalType, setTraversalType] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user has seen tutorial
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('bst-tutorial-completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  // Deep clone the tree to trigger React re-render
  const cloneTree = (node) => {
    if (!node) return null;
    return {
      value: node.value,
      left: cloneTree(node.left),
      right: cloneTree(node.right)
    };
  };

  // Force re-render of tree with deep clone
  const updateTree = () => {
    setTreeRoot(cloneTree(bstRef.current.root));
  };

  // Insert value
  const handleInsert = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;

    const insertSteps = bstRef.current.insert(value);
    updateTree();
    setSteps(insertSteps);
    setTraversalType(null);
    setInsertValue('');
  };

  // Search value
  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    const searchSteps = bstRef.current.search(value);
    setSteps(searchSteps);
    setTraversalType(null);
    setSearchValue('');
  };

  // Traversals
  const handleInorder = () => {
    const traversalSteps = bstRef.current.inorderTraversal();
    setSteps(traversalSteps);
    setTraversalType('Inorder');
  };

  const handlePreorder = () => {
    const traversalSteps = bstRef.current.preorderTraversal();
    setSteps(traversalSteps);
    setTraversalType('Preorder');
  };

  const handlePostorder = () => {
    const traversalSteps = bstRef.current.postorderTraversal();
    setSteps(traversalSteps);
    setTraversalType('Postorder');
  };

  // Build sample tree
  const handleBuildSample = () => {
    bstRef.current.clear();
    [50, 30, 70, 20, 40, 60, 80].forEach(v => bstRef.current.insert(v));
    updateTree();
    setSteps([]);
  };

  // Clear tree
  const handleClear = () => {
    bstRef.current.clear();
    setTreeRoot(null);
    setSteps([]);
    setTraversalType(null);
  };

  return (
    <div className="app">
      {/* Onboarding Tutorial */}
      {showTutorial && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}
      <header>
        <h1>BST Visualizer</h1>
        <p>React + SVG Animation</p>
      </header>

      <div className="main-layout">
        {/* Controls */}
        <aside className="controls">
          <section>
            <h3>Insert Value</h3>
            <div className="input-row">
              <input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                placeholder="Enter number"
              />
              <button onClick={handleInsert} className="btn-primary">Insert</button>
            </div>
          </section>

          <section>
            <h3>Search Value</h3>
            <div className="input-row">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter number"
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </section>

          <section>
            <h3>Traversals</h3>
            <div className="traversal-buttons">
              <button onClick={handleInorder} className="btn-traversal">
                Inorder
                <span className="traversal-hint">L → N → R</span>
              </button>
              <button onClick={handlePreorder} className="btn-traversal">
                Preorder
                <span className="traversal-hint">N → L → R</span>
              </button>
              <button onClick={handlePostorder} className="btn-traversal">
                Postorder
                <span className="traversal-hint">L → R → N</span>
              </button>
            </div>
          </section>

          <section>
            <h3>Animation Speed</h3>
            <div className="speed-control">
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
              <span>{speed}ms</span>
            </div>
          </section>

          <section>
            <h3>Quick Actions</h3>
            <div className="button-row">
              <button onClick={handleBuildSample}>Sample Tree</button>
              <button onClick={handleClear} className="btn-danger">Clear</button>
            </div>
          </section>
        </aside>

        {/* Visualization */}
        <main className="visualization">
          <BSTVisualizer
            ref={visualizerRef}
            root={treeRoot}
            steps={steps}
            animationSpeed={speed}
            traversalType={traversalType}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
