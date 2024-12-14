import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar } from "./components/Navbar";
import Markets from "./pages/Markets";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Login from "./pages/Login";
import Bet from "./pages/Bet";
import { useEffect } from "react";
import Positions from "./pages/Positions";
import { useAccount } from 'wagmi'
function App() {

    const account = useAccount()

const currentAccount= account.address

  useEffect(() => {
    console.log(currentAccount);
  });

  if (currentAccount === undefined) {
    return <Login />;
  }
  return (
    <Navbar>
      <main className="bg-[#efe7f7] text-black font-brice-regular py-20 h-[100vh]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/Positions" element={<Positions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<Create />} />
            <Route path="/bet/:id" element={<Bet />} />
          </Routes>
        </BrowserRouter>
      </main>
    </Navbar>
  );
}

export default App;
