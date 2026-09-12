// Shared domain types for the R&D Digital Hub admin dashboard.
// These mirror the "Core Content & Information" fields from the challenge brief.

export type ResearcherStatus = "Active" | "Invited" | "Archived";
export type ProjectStatus = "Proposed" | "Ongoing" | "Completed" | "Archived";
export type PublicationType =
  | "Journal Article"
  | "Conference Paper"
  | "Book Chapter"
  | "Research Report"
  | "Working Paper";
export type EventType =
  | "Conference"
  | "Seminar"
  | "Workshop"
  | "Guest Lecture"
  | "Call for Papers";
export type EventLifecycle = "Draft" | "Preview" | "Published" | "Past";
export type OpportunityType =
  | "Research Assistantship"
  | "Internship"
  | "Grant"
  | "Call for Papers"
  | "Competition";
export type OpportunityStatus = "Draft" | "Open" | "Closing Soon" | "Closed";

export interface Researcher {
  id: string;
  name: string;
  position: string;
  department: string;
  researchArea: string | "Unassigned";
  projectIds: string[];
  status: ResearcherStatus;
  email: string;
  bio?: string;
  updatedAt: string; // ISO date
}

export interface Project {
  id: string;
  projectCode: string; // e.g. RD-2026-014 — demonstrates duplicate-ID detection
  title: string;
  researchArea: string;
  status: ProjectStatus;
  leadResearcherId: string;
  teamIds: string[];
  startDate: string;
  endDate: string;
  description: string;
  updatedAt: string;
}

export interface Publication {
  id: string;
  title: string;
  authorIds: string[];
  year: number;
  type: PublicationType;
  researchArea: string;
  doi?: string;
  relatedProjectId?: string;
  venue: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  registrationLink?: string;
  researchArea: string;
  lifecycle: EventLifecycle;
  speakerIds: string[];
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  provider: string;
  researchArea: string;
  deadline: string;
  status: OpportunityStatus;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  color: "teal" | "pink" | "cyan";
  timestamp: string;
}

export interface AttentionItem {
  id: string;
  severity: "CRITICAL" | "WARNING";
  title: string;
  detail: string;
  linkLabel: string;
  linkTo: string;
}
