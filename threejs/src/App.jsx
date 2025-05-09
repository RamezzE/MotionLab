// App.jsx
import React from 'react';
import AvatarCreatorComponent from './components/AvatarCreatorComponent';

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ready Player Me Avatar Creator</h1>
      <AvatarCreatorComponent />
    </div>
  );
}

export default App;