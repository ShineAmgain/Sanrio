import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { DataProvider } from "./context/DataContext";
import Dashboard from "./pages/Dashboard";
import Researchers from "./pages/Researchers";
import Projects from "./pages/Projects";
import Publications from "./pages/Publications";
import Events from "./pages/Events";
import Opportunities from "./pages/Opportunities";

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="researchers" element={<Researchers />} />
            <Route path="projects" element={<Projects />} />
            <Route path="publications" element={<Publications />} />
            <Route path="events" element={<Events />} />
            <Route path="opportunities" element={<Opportunities />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
