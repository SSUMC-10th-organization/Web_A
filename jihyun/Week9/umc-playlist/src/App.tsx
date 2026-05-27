import CartList from "./components/CartList";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <CartList />
      </main>
      <Modal />
    </div>
  );
}

export default App;
