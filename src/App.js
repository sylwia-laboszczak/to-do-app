
import "./App.css";
import DropDownList from "./Components/DropDownList";
import Footer from "./Components/Footer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <section className="todoapp">
          <h1>todos</h1>
          <DropDownList />
          
        
        </section>
          <Footer />
      </header>
    </div>
  );
}

export default App;
