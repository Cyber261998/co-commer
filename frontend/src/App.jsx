import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Your app components */}
        <Analytics />
      </div>
    </Router>
  );
}

export default App; 