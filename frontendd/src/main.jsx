import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { api } from './lib/api';
import logo from './pages/logo.png';
import './styles.css';

const NAV = [
  ['Dashboard', '/', '▦'],
  ['Researchers', '/researchers', '♙'],
  ['Projects', '/projects', '□'],
  ['Publications', '/publications', '✎'],
  ['Meetings', '/meetings', '▤'],
  ['Events', '/events', '□'],
  ['Opportunities', '/grants', '☆'],
];

const MANAGEMENT = [
  [
    'research-areas',
    '/research-areas',
    '•',
    'Research Areas',
    () => researchAreaFields,
    () => researchAreaColumns,
    'name'
  ],
  [
    'research-groups',
    '/research-groups',
    '•',
    'Research Groups',
    () => researchGroupFields,
    () => researchGroupColumns,
    'name'
  ],
  [
    'resources',
    '/resources',
    '•',
    'Resources',
    () => resourceFields,
    () => resourceColumns,
    'title'
  ],
  [
    'announcements',
    '/announcements',
    '•',
    'Announcements',
    () => announcementFields,
    () => announcementColumns,
    'title'
  ],
  [
    'partners',
    '/partners',
    '•',
    'Partners',
    () => partnerFields,
    () => partnerColumns,
    'name'
  ],
  [
    'statistics',
    '/statistics',
    '•',
    'Statistics',
    () => statisticFields,
    () => statisticColumns,
    'label'
  ],
];

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange(
      (_e, s) => setSession(s)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) return <SetupScreen />;

  if (!session) return <Login />;

  return <Shell session={session} />;
}

function SetupScreen() {
  return (
    <div className="center-screen">
      <div className="login-card">
        <div className="brand-mark">
          <img src={logo} alt="Logo" />
        </div>

        <h1>Admin setup required</h1>

        <p>
          Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>
          {' '}to <code>.env</code>. Never put the service-role key in React.
        </p>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="center-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark">
          <img src={logo} alt="Logo" />
        </div>

        <h1>Admin sign in</h1>

        <p>
          Sign in with a Supabase user that has an{' '}
          <b>admin_profiles</b> record.
        </p>

        <label>
          Email
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          className="primary full"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function Shell({ session }) {
  const [mobile, setMobile] = useState(false);

  const signOut = () =>
    supabase.auth.signOut();

  return (
    <div className="app">
      <aside
        className={
          mobile
            ? 'sidebar open'
            : 'sidebar'
        }
      >
        <div className="brand">
          <div className="brand-logo">
            <img src={logo} alt="Logo" />
          </div>

          <div>
            <strong>Islington College</strong>
            <span>Research & Development</span>
          </div>
        </div>

        <div className="divider" />

        {NAV.map(([label, to, icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMobile(false)}
            className={({ isActive }) =>
              isActive
                ? 'nav-item active'
                : 'nav-item'
            }
          >
            <span className="nav-icon">
              {icon}
            </span>

            {label}
          </NavLink>
        ))}

        <div className="nav-section">
          Management
        </div>

        {MANAGEMENT.map(
          ([resource, to, icon, title]) => (
            <NavLink
              key={resource}
              to={to}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                isActive
                  ? 'nav-item active'
                  : 'nav-item'
              }
            >
              <span className="nav-icon">
                {icon}
              </span>

              {title}
            </NavLink>
          )
        )}

        <button
          className="signout"
          onClick={signOut}
        >
          ↪ Sign out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menu"
            onClick={() =>
              setMobile(!mobile)
            }
          >
            ☰
          </button>

          <div className="top-search">
            ⌕
            <input placeholder="Search..." />
          </div>

          <div className="user-chip">
            {session.user.email}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/researchers"
            element={
              <CrudPage
                resource="researchers"
                title="Researchers"
                fields={researcherFields}
                columns={researcherColumns}
                searchable="name"
              />
            }
          />

          <Route
            path="/projects"
            element={
              <CrudPage
                resource="projects"
                title="Projects"
                fields={projectFields}
                columns={projectColumns}
                searchable="title"
              />
            }
          />

          <Route
            path="/publications"
            element={
              <CrudPage
                resource="publications"
                title="Publications"
                fields={publicationFields}
                columns={publicationColumns}
                searchable="title"
              />
            }
          />

          <Route
            path="/meetings"
            element={<MeetingsPage />}
          />

          <Route
            path="/events"
            element={
              <CrudPage
                resource="events"
                title="Events"
                fields={eventFields}
                columns={eventColumns}
                searchable="title"
              />
            }
          />

          <Route
            path="/grants"
            element={
              <CrudPage
                resource="grants"
                title="Opportunities / Grants"
                fields={grantFields}
                columns={grantColumns}
                searchable="title"
              />
            }
          />

          {MANAGEMENT.map(
            ([
              resource,
              to,
              ,
              title,
              getFields,
              getColumns,
              searchable
            ]) => (
              <Route
                key={resource}
                path={to}
                element={
                  <CrudPage
                    resource={resource}
                    title={title}
                    fields={getFields()}
                    columns={getColumns()}
                    searchable={searchable}
                  />
                }
              />
            )
          )}
        </Routes>
      </main>
    </div>
  );
}

const researcherFields = [
  ['name', 'Name', 'text', true],
  ['position', 'Position', 'text'],
  ['department_id', 'Department ID', 'number'],
  ['email', 'Email', 'email'],
  ['bio', 'Bio', 'textarea'],
  ['orcid_url', 'ORCID URL', 'url'],
  ['google_scholar_url', 'Google Scholar URL', 'url'],
  ['profile_url', 'Profile URL', 'url'],
  ['status', 'Status', 'select', ['active', 'inactive']],
  [
    'content_status',
    'Content status',
    'select',
    ['draft', 'published', 'archived']
  ]
];

const projectFields = [
  ['title', 'Title', 'text', true],
  ['description', 'Description', 'textarea'],
  ['objectives', 'Objectives', 'textarea'],
  ['outputs_summary', 'Outputs summary', 'textarea'],
  [
    'status',
    'Status',
    'select',
    [
      'proposed',
      'started',
      'ongoing',
      'under_data_collection',
      'completed',
      'archived'
    ]
  ],
  ['start_date', 'Start date', 'date'],
  ['end_date', 'End date', 'date'],
  [
    'recruitment_status',
    'Recruitment status',
    'select',
    [
      'accepting_researchers',
      'selection_closed',
      'not_applicable'
    ]
  ],
  [
    'lead_researcher_id',
    'Lead researcher ID',
    'number'
  ],
  ['external_url', 'External URL', 'url'],
  [
    'content_status',
    'Publish status',
    'select',
    ['draft', 'preview', 'published', 'archived']
  ]
];

const publicationFields = [
  ['title', 'Title', 'text', true],
  ['abstract', 'Abstract', 'textarea'],
  ['summary', 'Summary', 'textarea'],
  ['publication_year', 'Publication year', 'number'],
  ['publication_type', 'Publication type', 'text'],
  ['venue', 'Venue', 'text'],
  ['doi', 'DOI', 'text'],
  ['external_url', 'External URL', 'url'],
  [
    'content_status',
    'Publish status',
    'select',
    ['draft', 'preview', 'published', 'archived']
  ]
];

const eventFields = [
  ['title', 'Title', 'text', true],
  ['description', 'Description', 'textarea'],
  ['event_type', 'Event type', 'text'],
  ['start_at', 'Start at', 'datetime-local'],
  ['end_at', 'End at', 'datetime-local'],
  ['location', 'Location', 'text'],
  ['registration_url', 'Registration URL', 'url'],
  ['action_url', 'Action URL', 'url'],
  ['external_url', 'External URL', 'url'],
  [
    'status',
    'Status',
    'select',
    [
      'draft',
      'upcoming',
      'ongoing',
      'completed',
      'cancelled',
      'archived'
    ]
  ],
  [
    'content_status',
    'Content status',
    'select',
    ['draft', 'published', 'archived']
  ]
];

const grantFields = [
  ['title', 'Title', 'text', true],
  ['provider', 'Provider', 'text'],
  ['funding_type', 'Funding type', 'text'],
  ['description', 'Description', 'textarea'],
  ['eligibility', 'Eligibility', 'textarea'],
  ['amount', 'Amount', 'text'],
  ['deadline', 'Deadline', 'date'],
  ['requirements', 'Requirements', 'textarea'],
  ['application_process', 'Application process', 'textarea'],
  ['guidelines_url', 'Guidelines URL', 'url'],
  ['contact', 'Contact', 'text'],
  ['external_url', 'External URL', 'url'],
  [
    'status',
    'Status',
    'select',
    ['draft', 'open', 'closed', 'archived']
  ],
  [
    'content_status',
    'Content status',
    'select',
    ['draft', 'published', 'archived']
  ]
];

const researcherColumns = [
  ['name', 'Name'],
  ['position', 'Position'],
  ['department_id', 'Department'],
  ['status', 'Status']
];

const projectColumns = [
  ['title', 'Title'],
  ['status', 'Status'],
  ['content_status', 'Publish status'],
  ['start_date', 'Start date'],
  ['end_date', 'End date'],
  ['lead_researcher_id', 'Lead researcher']
];

const publicationColumns = [
  ['title', 'Title'],
  ['publication_year', 'Year'],
  ['publication_type', 'Type'],
  ['venue', 'Venue'],
  ['content_status', 'Publish status']
];

const eventColumns = [
  ['title', 'Title'],
  ['event_type', 'Type'],
  ['start_at', 'Start'],
  ['location', 'Location'],
  ['status', 'Status']
];

const grantColumns = [
  ['title', 'Title'],
  ['provider', 'Provider'],
  ['funding_type', 'Funding type'],
  ['deadline', 'Deadline'],
  ['status', 'Status']
];

const researchAreaFields = [
  ['name', 'Name', 'text', true],
  ['description', 'Description', 'textarea'],
  ['parent_area_id', 'Parent area ID', 'number']
];

const researchAreaColumns = [
  ['name', 'Name'],
  ['description', 'Description'],
  ['parent_area_id', 'Parent area']
];

const researchGroupFields = [
  ['name', 'Name', 'text', true],
  ['description', 'Description', 'textarea'],
  [
    'research_area_id',
    'Research area ID',
    'number'
  ],
  [
    'lead_researcher_id',
    'Lead researcher ID',
    'number'
  ]
];

const researchGroupColumns = [
  ['name', 'Name'],
  ['research_area_id', 'Research area'],
  ['lead_researcher_id', 'Lead researcher']
];

const resourceFields = [
  ['title', 'Title', 'text', true],
  ['description', 'Description', 'textarea'],
  ['category', 'Category', 'text'],
  ['url', 'URL', 'url'],
  [
    'content_status',
    'Content status',
    'select',
    ['draft', 'published', 'archived']
  ]
];

const resourceColumns = [
  ['title', 'Title'],
  ['category', 'Category'],
  ['content_status', 'Status']
];

const announcementFields = [
  ['title', 'Title', 'text', true],
  ['body', 'Body', 'textarea'],
  [
    'published_at',
    'Published at',
    'datetime-local'
  ],
  [
    'content_status',
    'Content status',
    'select',
    ['draft', 'published', 'archived']
  ]
];

const announcementColumns = [
  ['title', 'Title'],
  ['published_at', 'Published'],
  ['content_status', 'Status']
];

const partnerFields = [
  ['name', 'Name', 'text', true],
  ['partner_type', 'Partner type', 'text'],
  ['description', 'Description', 'textarea'],
  ['url', 'URL', 'url']
];

const partnerColumns = [
  ['name', 'Name'],
  ['partner_type', 'Type'],
  ['url', 'URL']
];

const statisticFields = [
  ['label', 'Label', 'text', true],
  ['value', 'Value', 'text'],
  ['category', 'Category', 'text']
];

const statisticColumns = [
  ['label', 'Label'],
  ['value', 'Value'],
  ['category', 'Category']
];

function ActivityLog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivity = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.list('activity-log');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <section className="panel activity-panel">
      <div className="panel-title">
        <h2>Activity Log</h2>
        <span className="muted">
          Important changes
        </span>
      </div>

      {loading ? (
        <Empty text="Loading activity…" />
      ) : error ? (
        <div className="error">
          {error}
        </div>
      ) : items.length === 0 ? (
        <Empty text="No activity recorded yet." />
      ) : (
        items.map(item => (
          <div
            className="activity"
            key={item.id}
          >
            <span className="activity-dot" />

            <span>
              <b>
                {item.action || 'Activity'}
              </b>

              <small>
                {item.description ||
                  'No description provided.'}

                {item.created_at
                  ? ` · ${new Date(
                      item.created_at
                    ).toLocaleString()}`
                  : ''}
              </small>
            </span>
          </div>
        ))
      )}
    </section>
  );
}

function Dashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all(
      [
        'researchers',
        'projects',
        'publications',
        'events',
        'grants'
      ].map(async r => {
        try {
          return [
            r,
            await api.list(r)
          ];
        } catch (e) {
          setError(e.message);
          return [r, []];
        }
      })
    ).then(entries =>
      setData(
        Object.fromEntries(entries)
      )
    );
  }, []);

  const cards = [
    ['Researchers', 'researchers'],
    ['Projects', 'projects'],
    ['Publications', 'publications'],
    ['Events', 'events'],
    ['Opportunities', 'grants']
  ];

  const attention = [];

  (data.projects || [])
    .filter(x => x.status === 'archived')
    .forEach(x =>
      attention.push({
        type: 'warning',
        title: 'Archived project',
        text: x.title
      })
    );

  (data.grants || [])
    .filter(x => x.status === 'closed')
    .forEach(x =>
      attention.push({
        type: 'warning',
        title: 'Closed opportunity',
        text: x.title
      })
    );

  const recent = [
    ...Object.entries(data).flatMap(
      ([resource, rows]) =>
        rows.map(r => ({
          resource,
          row: r
        }))
    )
  ].slice(0, 6);

  return (
    <Page title="Dashboard">
      <div className="stats">
        {cards.map(([label, key]) => (
          <div
            className="stat"
            key={key}
          >
            <b>
              {data[key]?.length ?? '—'}
            </b>

            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title">
            <h2>Needs attention</h2>

            <span className="muted">
              Live database checks
            </span>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {attention.length === 0 ? (
            <Empty text="No attention items found." />
          ) : (
            attention.map((x, i) => (
              <div
                className="attention"
                key={i}
              >
                <span className="dot yellow" />

                <div>
                  <b>{x.title}</b>
                  <p>{x.text}</p>
                </div>

                <span className="badge warning">
                  WARNING
                </span>
              </div>
            ))
          )}
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>Recent records</h2>
          </div>

          {recent.length === 0 ? (
            <Empty text="No records found." />
          ) : (
            recent.map((x, i) => (
              <div
                className="activity"
                key={i}
              >
                <span className="activity-dot" />

                <span>
                  <b>
                    {x.row.title ||
                      x.row.name}
                  </b>

                  <small>
                    {x.resource}
                  </small>
                </span>
              </div>
            ))
          )}
        </section>
      </div>
    </Page>
  );
}

function MeetingsPage() {
  const [tab, setTab] =
    useState('meetings');

  const [meetings, setMeetings] =
    useState([]);

  const [actions, setActions] =
    useState([]);

  const [researchers, setResearchers] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [meetingParticipants, setMeetingParticipants] =
    useState([]);

  const [meetingModal, setMeetingModal] =
    useState(null);

  const [actionModal, setActionModal] =
    useState(null);

  const [error, setError] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const token = async () =>
    (
      await supabase.auth.getSession()
    ).data.session?.access_token;

  const load = async () => {
    setError('');

    try {
      const [m, a, meta] =
        await Promise.all([
          api.list('meetings'),
          api.list('meetings/action-items'),
          api.list('meetings/meta')
        ]);

      setMeetings(m || []);
      setActions(a || []);
      setResearchers(
        meta?.researchers || []
      );
      setProjects(
        meta?.projects || []
      );
      setMeetingParticipants([]);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveMeeting = async values => {
    setSaving(true);

    try {
      const t = await token();

      const payload = {
        project_id:
          values.project_id || null,
        title:
          values.title || null,
        meeting_date:
          values.meeting_date || null,
        agenda:
          values.agenda || null,
        minutes:
          values.minutes || null,
        participants:
          values.participants || []
      };

      if (values.id) {
        await api.update(
          'meetings',
          values.id,
          payload,
          t
        );
      } else {
        await api.create(
          'meetings',
          payload,
          t
        );
      }

      setMeetingModal(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAction = async values => {
    setSaving(true);

    try {
      const t = await token();

      const payload = {
        task:
          values.task || null,
        assigned_researcher_id:
          values.assigned_researcher_id ||
          null,
        due_date:
          values.due_date || null,
        status:
          values.status || 'open',
        project_id:
          values.project_id || null,
        meeting_id:
          values.meeting_id || null
      };

      if (values.id) {
        await api.update(
          'meetings/action-items/' +
            values.id,
          payload,
          t
        );
      } else {
        await api.create(
          'meetings/action-items',
          payload,
          t
        );
      }

      setActionModal(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (kind, id) => {
    if (
      !confirm(
        'Delete this record? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const t = await token();

      if (kind === 'meeting') {
        await api.remove(
          'meetings',
          id,
          t
        );
      } else {
        await api.remove(
          'meetings/action-items/' + id,
          t
        );
      }

      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Page title="Meetings">
      <div className="meeting-tabs">
        <button
          className={
            tab === 'meetings'
              ? 'tab active'
              : 'tab'
          }
          onClick={() =>
            setTab('meetings')
          }
        >
          Meetings
          <span>{meetings.length}</span>
        </button>

        <button
          className={
            tab === 'actions'
              ? 'tab active'
              : 'tab'
          }
          onClick={() =>
            setTab('actions')
          }
        >
          Action Items
          <span>{actions.length}</span>
        </button>

        <button
          className={
            tab === 'activity'
              ? 'tab active'
              : 'tab'
          }
          onClick={() =>
            setTab('activity')
          }
        >
          Activity Log
        </button>
      </div>

      {error && (
        <div className="error page-error">
          {error}
        </div>
      )}

      {tab === 'meetings' && (
        <MeetingsSection
          meetings={meetings}
          onNew={() =>
            setMeetingModal({})
          }
          onEdit={setMeetingModal}
          onDelete={id =>
            remove('meeting', id)
          }
        />
      )}

      {tab === 'actions' && (
        <ActionItemsSection
          actions={actions}
          onNew={() =>
            setActionModal({
              status: 'open'
            })
          }
          onEdit={setActionModal}
          onDelete={id =>
            remove('action', id)
          }
        />
      )}

      {tab === 'activity' && (
        <ActivityLog />
      )}

      {meetingModal && (
        <MeetingModal
          initial={meetingModal}
          researchers={meetingParticipants}
          projects={projects}
          onClose={() =>
            setMeetingModal(null)
          }
          onSave={saveMeeting}
          saving={saving}
        />
      )}

      {actionModal && (
        <ActionModal
          initial={actionModal}
          researchers={researchers}
          projects={projects}
          meetings={meetings}
          onClose={() =>
            setActionModal(null)
          }
          onSave={saveAction}
          saving={saving}
        />
      )}
    </Page>
  );
}

function MeetingsSection({
  meetings,
  onNew,
  onEdit,
  onDelete
}) {
  return (
    <>
      <div className="manage-head">
        <div>
          <p className="section-kicker">
            PROJECT COLLABORATION
          </p>

          <h2 className="section-heading">
            Meetings
          </h2>
        </div>

        <button
          className="primary"
          onClick={onNew}
        >
          ＋ Create meeting
        </button>
      </div>

      <section className="table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Participants</th>
                <th>Agenda</th>
                <th>Minutes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {meetings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty"
                  >
                    No meetings recorded yet.
                  </td>
                </tr>
              ) : (
                meetings.map(m => (
                  <tr key={m.id}>
                    <td>
                      {m.meeting_date
                        ? new Date(
                            m.meeting_date +
                              'T00:00:00'
                          ).toLocaleDateString()
                        : '—'}

                      <small className="table-sub">
                        {m.project_title}
                      </small>
                    </td>

                    <td>
                      {m.participants?.length
                        ? m.participants
                            .map(p => p.name)
                            .join(', ')
                        : '—'}
                    </td>

                    <td>
                      {formatValue(
                        m.agenda
                      )}
                    </td>

                    <td>
                      {formatValue(
                        m.minutes
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() =>
                          onEdit(m)
                        }
                        aria-label="Edit"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() =>
                          onDelete(m.id)
                        }
                        aria-label="Delete"
                      >
                        ⌫
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ActionItemsSection({
  actions,
  onNew,
  onEdit,
  onDelete
}) {
  return (
    <>
      <div className="manage-head">
        <div>
          <p className="section-kicker">
            FOLLOW-UP
          </p>

          <h2 className="section-heading">
            Action Items
          </h2>
        </div>

        <button
          className="primary"
          onClick={onNew}
        >
          ＋ New action item
        </button>
      </div>

      <section className="table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned researcher</th>
                <th>Due date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {actions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty"
                  >
                    No action items recorded yet.
                  </td>
                </tr>
              ) : (
                actions.map(a => (
                  <tr key={a.id}>
                    <td>
                      {formatValue(
                        a.task
                      )}
                    </td>

                    <td>
                      {a.assigned_researcher_name ||
                        '—'}
                    </td>

                    <td>
                      {a.due_date
                        ? new Date(
                            a.due_date +
                              'T00:00:00'
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td>
                      <Status
                        value={a.status}
                      />
                    </td>

                    <td className="actions">
                      <button
                        onClick={() =>
                          onEdit(a)
                        }
                        aria-label="Edit"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() =>
                          onDelete(a.id)
                        }
                        aria-label="Delete"
                      >
                        ⌫
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function MeetingModal({
  initial,
  researchers,
  projects,
  onClose,
  onSave,
  saving
}) {
  const [v, setV] = useState(() => ({
    id: initial.id,
    title: initial.title || '',
    project_id:
      initial.project_id || '',
    meeting_date:
      initial.meeting_date || '',
    agenda:
      initial.agenda || '',
    minutes:
      initial.minutes || '',
    participants:
      (initial.participants || [])
        .map(p => p.id)
  }));

  const [
    participantList,
    setParticipantList
  ] = useState(
    () =>
      initial.project_id
        ? researchers || []
        : []
  );

  const [
    loadingParticipants,
    setLoadingParticipants
  ] = useState(false);

  const [
    participantError,
    setParticipantError
  ] = useState('');

  const set = (k, x) =>
    setV(s => ({
      ...s,
      [k]: x
    }));

  const loadProjectParticipants =
    async projectId => {
      if (!projectId) {
        setParticipantList([]);
        setParticipantError('');
        setLoadingParticipants(false);
        return;
      }

      setLoadingParticipants(true);
      setParticipantError('');

      try {
        const project =
          await api.get(
            'projects',
            projectId
          );

        const assignments =
          Array.isArray(
            project?.researcher_projects
          )
            ? project.researcher_projects
            : [];

        const list =
          assignments
            .map(a => a?.researchers)
            .filter(Boolean)
            .map(r => ({
              id: r.id,
              name: r.name
            }))
            .filter(
              r => r.id != null
            );

        const unique = [
          ...new Map(
            list.map(r => [
              String(r.id),
              r
            ])
          ).values()
        ].sort(
          (a, b) =>
            (a.name || '').localeCompare(
              b.name || ''
            )
        );

        setParticipantList(
          unique
        );

        const allowed =
          new Set(
            unique.map(r =>
              String(r.id)
            )
          );

        setV(s => ({
          ...s,
          participants:
            s.participants.filter(
              id =>
                allowed.has(
                  String(id)
                )
            )
        }));
      } catch (e) {
        setParticipantError(
          e.message
        );

        setParticipantList([]);

        setV(s => ({
          ...s,
          participants: []
        }));
      } finally {
        setLoadingParticipants(false);
      }
    };

  useEffect(() => {
    if (
      initial.id &&
      initial.project_id
    ) {
      loadProjectParticipants(
        initial.project_id
      );
    }
  }, []);

  const chooseProject =
    projectId => {
      setV(s => ({
        ...s,
        project_id: projectId,
        participants: []
      }));

      loadProjectParticipants(
        projectId
      );
    };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="section-kicker">
              MEETING
            </p>

            <h2>
              {initial.id
                ? 'Edit meeting'
                : 'Create meeting'}
            </h2>
          </div>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-grid">
          <label>
            Project

            <select
              value={v.project_id}
              onChange={e =>
                chooseProject(
                  e.target.value
                )
              }
            >
              <option value="">
                Select project…
              </option>

              {projects.map(p => (
                <option
                  value={p.id}
                  key={p.id}
                >
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Title

            <input
              value={v.title}
              onChange={e =>
                set(
                  'title',
                  e.target.value
                )
              }
              placeholder="e.g. Monthly research review"
            />
          </label>

          <label>
            Date

            <input
              type="date"
              value={v.meeting_date}
              onChange={e =>
                set(
                  'meeting_date',
                  e.target.value
                )
              }
              required
            />
          </label>

          <label className="wide">
            Participants

            {!v.project_id ? (
              <div className="participant-hint">
                Select a project first to see its researchers.
              </div>
            ) : loadingParticipants ? (
              <div className="participant-hint">
                Loading project researchers…
              </div>
            ) : participantError ? (
              <div className="error">
                {participantError}
              </div>
            ) : participantList.length === 0 ? (
              <div className="participant-hint">
                No researchers are assigned to this project.
              </div>
            ) : (
              <div className="check-grid">
                {participantList.map(r => (
                  <label
                    className="check-item"
                    key={r.id}
                  >
                    <input
                      type="checkbox"
                      checked={v.participants
                        .map(String)
                        .includes(
                          String(r.id)
                        )}
                      onChange={e =>
                        set(
                          'participants',
                          e.target.checked
                            ? [
                                ...v.participants,
                                r.id
                              ]
                            : v.participants.filter(
                                id =>
                                  String(id) !==
                                  String(r.id)
                              )
                        )
                      }
                    />

                    {r.name}
                  </label>
                ))}
              </div>
            )}
          </label>

          <label className="wide">
            Agenda

            <textarea
              value={v.agenda}
              onChange={e =>
                set(
                  'agenda',
                  e.target.value
                )
              }
              placeholder="Topics, decisions and discussion points…"
            />
          </label>

          <label className="wide">
            Minutes

            <textarea
              value={v.minutes}
              onChange={e =>
                set(
                  'minutes',
                  e.target.value
                )
              }
              placeholder="Meeting notes and decisions…"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary"
            onClick={() =>
              onSave(v)
            }
            disabled={saving}
          >
            {saving
              ? 'Saving…'
              : 'Save meeting'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionModal({
  initial,
  researchers,
  projects,
  meetings,
  onClose,
  onSave,
  saving
}) {
  const [v, setV] = useState(() => ({
    id: initial.id,
    task: initial.task || '',
    assigned_researcher_id:
      initial.assigned_researcher_id ||
      '',
    due_date:
      initial.due_date || '',
    status:
      initial.status || 'open',
    project_id:
      initial.project_id || '',
    meeting_id:
      initial.meeting_id || ''
  }));

  const set = (k, x) =>
    setV(s => ({
      ...s,
      [k]: x
    }));

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="section-kicker">
              FOLLOW-UP
            </p>

            <h2>
              {initial.id
                ? 'Edit action item'
                : 'New action item'}
            </h2>
          </div>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-grid">
          <label className="wide">
            Task

            <textarea
              value={v.task}
              onChange={e =>
                set(
                  'task',
                  e.target.value
                )
              }
              placeholder="What needs to be done?"
              required
            />
          </label>

          <label>
            Assigned researcher

            <select
              value={
                v.assigned_researcher_id
              }
              onChange={e =>
                set(
                  'assigned_researcher_id',
                  e.target.value
                )
              }
            >
              <option value="">
                Select researcher…
              </option>

              {researchers.map(r => (
                <option
                  value={r.id}
                  key={r.id}
                >
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Due date

            <input
              type="date"
              value={v.due_date}
              onChange={e =>
                set(
                  'due_date',
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Status

            <select
              value={v.status}
              onChange={e =>
                set(
                  'status',
                  e.target.value
                )
              }
            >
              {[
                'open',
                'in_progress',
                'completed',
                'blocked'
              ].map(x => (
                <option
                  key={x}
                  value={x}
                >
                  {x.replace(
                    '_',
                    ' '
                  )}
                </option>
              ))}
            </select>
          </label>

          <label>
            Project

            <select
              value={v.project_id}
              onChange={e =>
                set(
                  'project_id',
                  e.target.value
                )
              }
            >
              <option value="">
                Select project…
              </option>

              {projects.map(p => (
                <option
                  value={p.id}
                  key={p.id}
                >
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Meeting

            <select
              value={v.meeting_id}
              onChange={e =>
                set(
                  'meeting_id',
                  e.target.value
                )
              }
            >
              <option value="">
                No meeting
              </option>

              {meetings.map(m => (
                <option
                  value={m.id}
                  key={m.id}
                >
                  {m.title ||
                    m.meeting_date ||
                    'Meeting'}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <button
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary"
            onClick={() =>
              onSave(v)
            }
            disabled={saving}
          >
            {saving
              ? 'Saving…'
              : 'Save action item'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CrudPage({
  resource,
  title,
  fields,
  columns,
  searchable
}) {
  const [rows, setRows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [query, setQuery] =
    useState('');

  const [modal, setModal] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      setRows(
        await api.list(resource)
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resource]);

  const filtered = useMemo(
    () =>
      rows.filter(r =>
        String(
          r[searchable] ?? ''
        )
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
      ),
    [
      rows,
      query,
      searchable
    ]
  );

  const save = async values => {
    setSaving(true);

    try {
      const token =
        (
          await supabase.auth.getSession()
        ).data.session
          ?.access_token;

      if (modal?.id) {
        await api.update(
          resource,
          modal.id,
          values,
          token
        );
      } else {
        await api.create(
          resource,
          values,
          token
        );
      }

      setModal(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async id => {
    if (
      !confirm(
        'Delete this record? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const token =
        (
          await supabase.auth.getSession()
        ).data.session
          ?.access_token;

      await api.remove(
        resource,
        id,
        token
      );

      setRows(r =>
        r.filter(
          x => x.id !== id
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Page title={title}>
      <div className="manage-head">
        <div className="search-box">
          ⌕

          <input
            value={query}
            onChange={e =>
              setQuery(
                e.target.value
              )
            }
            placeholder={`Search by ${searchable}...`}
          />
        </div>

        <button
          className="primary"
          onClick={() =>
            setModal({})
          }
        >
          ＋ New{' '}
          {title.replace(
            /s$/,
            ''
          )}
        </button>
      </div>

      {error && (
        <div className="error page-error">
          {error}
        </div>
      )}

      <section className="table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map(
                  ([, label]) => (
                    <th key={label}>
                      {label}
                    </th>
                  )
                )}

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + 1
                    }
                    className="empty"
                  >
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + 1
                    }
                    className="empty"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map(row => (
                  <tr key={row.id}>
                    {columns.map(
                      ([key]) => (
                        <td key={key}>
                          {key.includes(
                            'status'
                          ) ? (
                            <Status
                              value={
                                row[key]
                              }
                            />
                          ) : (
                            formatValue(
                              row[key]
                            )
                          )}
                        </td>
                      )
                    )}

                    <td className="actions">
                      <button
                        onClick={() =>
                          setModal(row)
                        }
                        aria-label="Edit"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() =>
                          remove(row.id)
                        }
                        aria-label="Delete"
                      >
                        ⌫
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <Modal
          title={
            modal.id
              ? `Edit ${title.replace(
                  /s$/,
                  ''
                )}`
              : `New ${title.replace(
                  /s$/,
                  ''
                )}`
          }
          fields={fields}
          initial={modal}
          onClose={() =>
            setModal(null)
          }
          onSave={save}
          saving={saving}
          resource={resource}
        />
      )}
    </Page>
  );
}

function Modal({
  resource,
  title,
  fields,
  initial,
  onClose,
  onSave,
  saving
}) {
  const isPublishFlow =
    fields.some(
      ([k, , type, opts]) =>
        k === 'content_status' &&
        type === 'select' &&
        Array.isArray(opts) &&
        opts.includes('preview')
    );

  const [values, setValues] =
    useState(() =>
      Object.fromEntries(
        fields.map(([k]) => [
          k,
          initial[k] ?? ''
        ])
      )
    );

  const [step, setStep] =
    useState('edit');

  const change = (k, v) =>
    setValues(x => ({
      ...x,
      [k]: v
    }));

  const editFields =
    isPublishFlow
      ? fields.filter(
          ([k]) =>
            k !== 'content_status'
        )
      : fields;

  const renderControl = (
    key,
    label,
    type,
    requiredOrOptions
  ) => {
    const options =
      type === 'select'
        ? requiredOrOptions
        : [];

    if (type === 'select') {
      return (
        <select
          value={
            values[key] ?? ''
          }
          onChange={e =>
            change(
              key,
              e.target.value
            )
          }
        >
          <option value="">
            Select…
          </option>

          {options.map(o => (
            <option
              key={o}
              value={o}
            >
              {o}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={
            values[key] ?? ''
          }
          required={
            requiredOrOptions ===
            true
          }
          onChange={e =>
            change(
              key,
              e.target.value
            )
          }
        />
      );
    }

    return (
      <input
        type={type}
        value={
          values[key] ?? ''
        }
        required={
          requiredOrOptions ===
          true
        }
        onChange={e =>
          change(
            key,
            e.target.value
          )
        }
      />
    );
  };

  const publicationRequiredFields =
    resource === 'publications'
      ? [
          ['title', 'Title'],
          [
            'publication_year',
            'Publish year'
          ],
          [
            'external_url',
            'External URL'
          ]
        ]
      : [];

  const validatePublishFields =
    () => {
      const missing =
        publicationRequiredFields
          .filter(([key]) => {
            const value =
              values[key];

            return (
              value ===
                undefined ||
              value === null ||
              String(
                value
              ).trim() === ''
            );
          })
          .map(
            ([, label]) =>
              label
          );

      if (missing.length) {
        alert(
          `Before publishing, please provide: ${missing.join(
            ', '
          )}.`
        );

        return false;
      }

      return true;
    };

  const saveWithStatus =
    status => {
      if (
        status === 'published' &&
        !validatePublishFields()
      ) {
        return;
      }

      onSave(
        clean({
          ...values,
          ...(isPublishFlow
            ? {
                content_status:
                  status
              }
            : {})
        })
      );
    };

  const goToPreview = () => {
    if (
      resource === 'publications' &&
      !validatePublishFields()
    ) {
      return;
    }

    setStep('preview');
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <h2>{title}</h2>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        {isPublishFlow && (
          <div className="flow-steps">
            <span
              className={
                `flow-step${
                  step === 'edit'
                    ? ' active'
                    : ' done'
                }`
              }
            >
              1. Draft
            </span>

            <span className="flow-arrow">
              →
            </span>

            <span
              className={
                `flow-step${
                  step === 'preview'
                    ? ' active'
                    : ''
                }`
              }
            >
              2. Preview
            </span>

            <span className="flow-arrow">
              →
            </span>

            <span className="flow-step">
              3. Publish
            </span>
          </div>
        )}

        {step === 'edit' && (
          <div className="form-grid">
            {editFields.map(
              ([
                key,
                label,
                type,
                requiredOrOptions
              ]) => (
                <label
                  key={key}
                  className={
                    type === 'textarea'
                      ? 'wide'
                      : ''
                  }
                >
                  {label}

                  {renderControl(
                    key,
                    label,
                    type,
                    requiredOrOptions
                  )}
                </label>
              )
            )}
          </div>
        )}

        {step === 'preview' &&
          isPublishFlow && (
            <div className="preview-panel">
              <div className="preview-banner">
                Previewing how this record will look.
                It will not be visible publicly until
                you publish it.
              </div>

              {editFields.map(
                ([key, label]) =>
                  values[key] ? (
                    <div
                      className="preview-row"
                      key={key}
                    >
                      <b>{label}</b>

                      <span>
                        {String(
                          values[key]
                        )}
                      </span>
                    </div>
                  ) : null
              )}
            </div>
          )}

        <div className="modal-actions">
          {isPublishFlow ? (
            step === 'edit' ? (
              <>
                <button
                  className="secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    saveWithStatus(
                      'draft'
                    )
                  }
                  disabled={saving}
                >
                  {saving
                    ? 'Saving…'
                    : 'Save as draft'}
                </button>

                <button
                  className="primary"
                  onClick={
                    goToPreview
                  }
                >
                  Preview →
                </button>
              </>
            ) : (
              <>
                <button
                  className="secondary"
                  onClick={() =>
                    setStep('edit')
                  }
                >
                  ← Back to edit
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    saveWithStatus(
                      'preview'
                    )
                  }
                  disabled={saving}
                >
                  {saving
                    ? 'Saving…'
                    : 'Save as preview'}
                </button>

                <button
                  className="primary"
                  onClick={() =>
                    saveWithStatus(
                      'published'
                    )
                  }
                  disabled={saving}
                >
                  {saving
                    ? 'Publishing…'
                    : 'Publish'}
                </button>
              </>
            )
          ) : (
            <>
              <button
                className="secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={() =>
                  onSave(
                    clean(values)
                  )
                }
                disabled={saving}
              >
                {saving
                  ? 'Saving…'
                  : 'Save changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function clean(obj) {
  const out = {
    ...obj
  };

  Object.keys(out).forEach(k => {
    if (out[k] === '') {
      out[k] = null;
    }

    if (
      [
        'department_id',
        'lead_researcher_id',
        'publication_year',
        'parent_area_id',
        'research_area_id'
      ].includes(k) &&
      out[k] !== null
    ) {
      out[k] = Number(
        out[k]
      );
    }
  });

  return out;
}

function formatValue(v) {
  if (
    v === null ||
    v === undefined ||
    v === ''
  ) {
    return '—';
  }

  const s = String(v);

  return s.length > 70
    ? s.slice(0, 70) + '…'
    : s;
}

function Status({ value }) {
  return (
    <span
      className={
        `badge ${
          [
            'active',
            'published',
            'upcoming',
            'ongoing',
            'open',
            'started',
            'completed'
          ].includes(value)
            ? 'success'
            : [
                'draft',
                'preview',
                'proposed',
                'under_data_collection'
              ].includes(value)
            ? 'warning'
            : 'neutral'
        }`
      }
    >
      {value || '—'}
    </span>
  );
}

function Page({
  title,
  children
}) {
  return (
    <div className="page">
      <div className="page-title">
        <h1>{title}</h1>
      </div>

      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty">
      {text}
    </div>
  );
}

createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);