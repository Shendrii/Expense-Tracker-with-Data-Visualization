import "./App.css";

import Inputfield from "./components/Inputfield";
import ExpenseList from "./components/ExpenseList";
import BarGraph from "./AnalyticsCharts/BarGraph";

function App() {
  return (
    <div className="App">
      <h1 className="h1ex">Expense Tracker</h1>
      <div className="InputField">
        <Inputfield />
      </div>

      <br />
      <br />
      <div className="ExpenseList">
        <ExpenseList />
      </div>
      <div className="BarGraph">
        <BarGraph />
      </div>
    </div>
  );
}

export default App;
