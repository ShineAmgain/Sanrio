import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  Researcher,
  Project,
  Publication,
  EventItem,
  Opportunity,
  ActivityEntry,
} from "../types";
import {
  researchers as initialResearchers,
  projects as initialProjects,
  publications as initialPublications,
  events as initialEvents,
  opportunities as initialOpportunities,
  activity as initialActivity,
} from "../data/mockData";

interface DataContextValue {
  researchers: Researcher[];
  projects: Project[];
  publications: Publication[];
  events: EventItem[];
  opportunities: Opportunity[];
  activity: ActivityEntry[];
  upsertResearcher: (r: Researcher) => void;
  deleteResearcher: (id: string) => void;
  upsertProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  upsertPublication: (p: Publication) => void;
  deletePublication: (id: string) => void;
  upsertEvent: (e: EventItem) => void;
  deleteEvent: (id: string) => void;
  upsertOpportunity: (o: Opportunity) => void;
  deleteOpportunity: (id: string) => void;
  logActivity: (actor: string, action: string, color?: ActivityEntry["color"]) => void;
  researcherName: (id: string) => string;
  projectTitle: (id: string) => string;
}

const DataContext = createContext<DataContextValue | null>(null);

function upsertIn<T extends { id: string }>(list: T[], item: T): T[] {
  const exists = list.some((x) => x.id === item.id);
  return exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [researchers, setResearchers] = useState<Researcher[]>(initialResearchers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(initialActivity);

  const logActivity = (
    actor: string,
    action: string,
    color: ActivityEntry["color"] = "teal",
  ) => {
    setActivityLog((prev) => [
      {
        id: `a-${Date.now()}`,
        actor,
        action,
        color,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const value = useMemo<DataContextValue>(
    () => ({
      researchers,
      projects,
      publications,
      events,
      opportunities,
      activity: activityLog,
      upsertResearcher: (r) => {
        setResearchers((prev) => upsertIn(prev, r));
        logActivity("You", `${prev_exists(researchers, r.id) ? "updated" : "added"} researcher ${r.name}`, "cyan");
      },
      deleteResearcher: (id) =>
        setResearchers((prev) => prev.filter((x) => x.id !== id)),
      upsertProject: (p) => {
        setProjects((prev) => upsertIn(prev, p));
        logActivity("You", `${prev_exists(projects, p.id) ? "updated" : "added"} project ${p.title}`, "teal");
      },
      deleteProject: (id) => setProjects((prev) => prev.filter((x) => x.id !== id)),
      upsertPublication: (p) => {
        setPublications((prev) => upsertIn(prev, p));
        logActivity("You", `${prev_exists(publications, p.id) ? "updated" : "published"} ${p.title}`, "teal");
      },
      deletePublication: (id) =>
        setPublications((prev) => prev.filter((x) => x.id !== id)),
      upsertEvent: (e) => {
        setEvents((prev) => upsertIn(prev, e));
        logActivity("You", `${prev_exists(events, e.id) ? "updated" : "added"} event ${e.title}`, "pink");
      },
      deleteEvent: (id) => setEvents((prev) => prev.filter((x) => x.id !== id)),
      upsertOpportunity: (o) => {
        setOpportunities((prev) => upsertIn(prev, o));
        logActivity("You", `${prev_exists(opportunities, o.id) ? "updated" : "added"} opportunity ${o.title}`, "pink");
      },
      deleteOpportunity: (id) =>
        setOpportunities((prev) => prev.filter((x) => x.id !== id)),
      logActivity,
      researcherName: (id) =>
        researchers.find((r) => r.id === id)?.name ?? "Unassigned",
      projectTitle: (id) => projects.find((p) => p.id === id)?.title ?? "—",
    }),
    [researchers, projects, publications, events, opportunities, activityLog],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function prev_exists<T extends { id: string }>(list: T[], id: string) {
  return list.some((x) => x.id === id);
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
