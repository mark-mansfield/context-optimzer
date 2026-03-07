import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
