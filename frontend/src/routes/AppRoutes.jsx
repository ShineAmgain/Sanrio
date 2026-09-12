import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Search from "../pages/Search";
import About from "../pages/About";
import ResearchAreas from "../pages/ResearchAreas";
import ResearchGroups from "../pages/ResearchGroups";
import ResearchSupport from "../pages/ResearchSupport";
import Ethics from "../pages/Ethics";
import IJMR from "../pages/IJMR";
import Partnerships from "../pages/Partnerships";
import Researchers from "../pages/Researchers";
import ResearcherDetail from "../pages/ResearcherDetail";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Publications from "../pages/Publications";
import PublicationDetail from "../pages/PublicationDetail";
import Events from "../pages/Events";
import EventDetail from "../pages/EventDetail";
import Opportunities from "../pages/Opportunities";
import OpportunityDetail from "../pages/OpportunityDetail";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />

      <Route path="/about" element={<About />} />
      <Route path="/research-areas" element={<ResearchAreas />} />
      <Route path="/research-groups" element={<ResearchGroups />} />
      <Route path="/research-support" element={<ResearchSupport />} />
      <Route path="/ethics" element={<Ethics />} />
      <Route path="/ijmr" element={<IJMR />} />
      <Route path="/partnerships" element={<Partnerships />} />

      <Route path="/researchers" element={<Researchers />} />
      <Route path="/researchers/:id" element={<ResearcherDetail />} />

      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />

      <Route path="/publications" element={<Publications />} />
      <Route path="/publications/:id" element={<PublicationDetail />} />

      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />

      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/opportunities/:id" element={<OpportunityDetail />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
