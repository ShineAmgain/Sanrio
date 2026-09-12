import SampleContentNotice from "../components/SampleContentNotice";

export default function About() {
  return (
    <div className="page-container detail-page">
      <h1>About R&amp;D</h1>
      <SampleContentNotice />

      <section>
        <h3>Vision &amp; Mission</h3>
        <p>
          Islington College's Research &amp; Development ecosystem exists to
          grow a culture of inquiry, innovation and evidence-based practice
          across the college — connecting students, faculty and industry
          partners around research that matters.
        </p>
      </section>

      <section>
        <h3>Structure</h3>
        <p>
          R&amp;D activity is coordinated across departments (Computing, AI
          &amp; Data Science, Business, Management, and Interdisciplinary
          Research), each contributing researchers, projects and outputs to
          the shared digital hub.
        </p>
      </section>

      <section>
        <h3>Leadership &amp; Advisory Structure</h3>
        <p>
          The R&amp;D office is led by a Research Coordinator supported by an
          advisory panel of senior faculty who review project proposals,
          ethics applications, and funding recommendations.
        </p>
      </section>

      <section>
        <h3>Research Teams</h3>
        <p>
          Teams are organised around research areas — see{" "}
          <a href="/research-areas">Research Areas &amp; Groups</a> — and
          bring together researchers with related interests to collaborate on
          projects and publications.
        </p>
      </section>

      <section>
        <h3>Partners</h3>
        <p>
          See the <a href="/partnerships">Partnerships &amp; Collaboration</a>{" "}
          page for a full list of academic, industry, and community partners
          working with the R&amp;D ecosystem.
        </p>
      </section>
    </div>
  );
}
