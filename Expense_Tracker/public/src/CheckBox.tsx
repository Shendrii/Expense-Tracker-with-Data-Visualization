function App() {
  return (
    <div>
      <p>Current Date: {new Date().toLocaleDateString()}</p>
      <p>Current Time: {new Date(Date.now()).toLocaleTimeString()}</p>
    </div>
  );
}

export default App;
