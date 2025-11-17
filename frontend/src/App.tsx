import GameManager from './components/GameManager';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <GameManager />
      </div>
    </ErrorBoundary>
  );
}

export default App;
