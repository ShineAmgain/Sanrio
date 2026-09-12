import type {
  AttentionItem,
  Project,
  EventItem,
  Opportunity,
  Publication,
} from "../types";

const DAY = 24 * 60 * 60 * 1000;

export function getAttentionItems({
  projects,
  events,
  opportunities,
  publications,
  now = new Date(),
}: {
  projects: Project[];
  events: EventItem[];
  opportunities: Opportunity[];
  publications: Publication[];
  now?: Date;
}): AttentionItem[] {
  const items: AttentionItem[] = [];

  // 1. Duplicate project codes
  const byCode = new Map<string, Project[]>();
  for (const p of projects) {
    byCode.set(p.projectCode, [...(byCode.get(p.projectCode) ?? []), p]);
  }
  for (const [code, group] of byCode) {
    if (group.length > 1) {
      items.push({
        id: `dup-${code}`,
        severity: "CRITICAL",
        title: "Duplicate project ID",
        detail: `"${code}" is used by ${group.length} records — ${group
          .map((p) => p.title)
          .join(" and ")}`,
        linkLabel: "Review records",
        linkTo: "/projects",
      });
    }
  }

  // 2. Invalid date ranges (events where end implied before start — here we
  // use registration/incomplete info as the closest analogue on EventItem,
  // plus explicit start/end range checks on projects)
  for (const p of projects) {
    if (new Date(p.endDate) < new Date(p.startDate)) {
      items.push({
        id: `date-${p.id}`,
        severity: "WARNING",
        title: "Invalid data range",
        detail: `End date falls before the start date — ${p.title}`,
        linkLabel: "Review records",
        linkTo: "/projects",
      });
    }
  }

  // 3. Incomplete event information
  for (const e of events) {
    if (!e.location || !e.registrationLink) {
      items.push({
        id: `event-incomplete-${e.id}`,
        severity: "WARNING",
        title: "Incomplete event information",
        detail: `${e.title} is missing ${
          !e.location && !e.registrationLink
            ? "a location and registration link"
            : !e.location
              ? "a location"
              : "a registration link"
        }`,
        linkLabel: "Review records",
        linkTo: "/events",
      });
    }
  }

  // 4. Opportunities closing soon (within 7 days) or already closed but still marked open
  for (const o of opportunities) {
    const daysLeft = Math.ceil(
      (new Date(o.deadline).getTime() - now.getTime()) / DAY,
    );
    if (o.status !== "Closed" && daysLeft <= 7 && daysLeft >= 0) {
      items.push({
        id: `opp-closing-${o.id}`,
        severity: "WARNING",
        title: "Opportunity closing soon",
        detail: `${o.title} closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
        linkLabel: "Review records",
        linkTo: "/opportunities",
      });
    }
  }

  // 5. Publications missing a DOI
  for (const pub of publications) {
    if (!pub.doi) {
      items.push({
        id: `pub-doi-${pub.id}`,
        severity: "WARNING",
        title: "Missing DOI",
        detail: `${pub.title} has no DOI on file`,
        linkLabel: "Review records",
        linkTo: "/publications",
      });
    }
  }

  // 6. Projects with no recent update (90+ days)
  for (const p of projects) {
    const daysSince = Math.floor(
      (now.getTime() - new Date(p.updatedAt).getTime()) / DAY,
    );
    if (p.status === "Ongoing" && daysSince > 90) {
      items.push({
        id: `stale-${p.id}`,
        severity: "WARNING",
        title: "Project with no recent update",
        detail: `${p.title} hasn't been updated in ${daysSince} days`,
        linkLabel: "Review records",
        linkTo: "/projects",
      });
    }
  }

  return items;
}
