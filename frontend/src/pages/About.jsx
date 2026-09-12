import { Link } from "react-router-dom";

const DEPARTMENTS = [
  {
    title: "Computing",
    desc: "Software, systems and applied technology research.",
  },
  {
    title: "AI & Data Science",
    desc: "Machine learning, data-driven insight and intelligent systems.",
  },
  {
    title: "Business",
    desc: "Enterprise, strategy and applied management research.",
  },
  {
    title: "Management",
    desc: "Organisational practice, leadership and workplace research.",
  },
  {
    title: "Interdisciplinary Research",
    desc: "Cross-department projects that connect multiple fields.",
  },
];

export default function About() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-hero-inner">
          <p className="about-eyebrow">Research &amp; Development</p>

          <h1>
            Learn, Explore, and{" "}
            <span>Contribute</span>{" "}
            through Research
          </h1>

          <p className="about-hero-text">
            At Islington College, we believe meaningful education extends
            beyond learning what exists — it&apos;s about asking new questions,
            testing new ideas, and building solutions that matter.
          </p>
        </div>
      </section>


      <main className="about-main">

        {/* WHO WE ARE */}

        <section className="about-intro">
          <div>
            <span className="about-section-label">Who We Are</span>
          </div>

          <div className="about-intro-content">
            <h2>
              Research that connects ideas, people and real-world needs.
            </h2>

            <p>
              The Research and Development community at Islington College
              brings together students, faculty and external partners to
              explore meaningful questions and develop practical solutions.
            </p>

            <p>
              Our work encourages curiosity, collaboration and the exchange
              of ideas across different areas of study.
            </p>
          </div>
        </section>


        {/* OUR PURPOSE */}

        <section className="about-purpose">
          <div className="purpose-heading">
            <span className="about-section-label">Our Purpose</span>

            <h2>
              Creating an environment where good research can grow.
            </h2>
          </div>

          <div className="purpose-columns">

            <div className="purpose-column">
              <h3>Our Vision</h3>

              <p>
                To become Nepal&apos;s leading R&amp;D centre for applied
                research and innovation — growing a culture of inquiry that
                connects students, faculty and industry partners around
                research that matters.
              </p>
            </div>

            <div className="purpose-column">
              <h3>Our Mission</h3>

              <p>
                To advance applied research through faculty-student
                collaboration, coordinating activity across departments and
                the shared digital hub, and delivering practical,
                evidence-based solutions to real-world problems.
              </p>
            </div>

          </div>
        </section>


        {/* RESEARCH ECOSYSTEM */}

        <section className="research-ecosystem">
          <div className="ecosystem-header">

            <div>
              <span className="about-section-label">
                Research Ecosystem
              </span>

              <h2>
                A connected research community.
              </h2>
            </div>

            <p>
              R&amp;D activity is coordinated across five departments, each
              contributing researchers, projects and outputs to the shared
              research environment.
            </p>

          </div>


          <div className="department-list">

            {DEPARTMENTS.map((dept) => (
              <div className="department-row" key={dept.title}>

                <h3>{dept.title}</h3>

                <p>{dept.desc}</p>

              </div>
            ))}

          </div>
        </section>


        {/* HOW IT WORKS */}

        <section className="leadership-section">

          <div className="leadership-title">
            <span className="about-section-label">
              How It Works
            </span>

            <h2>
              Supporting research from idea to impact.
            </h2>
          </div>


          <div className="leadership-content">

            <div className="leadership-intro">
              <p>
                The R&amp;D office is led by a Research Coordinator,
                supported by an advisory panel of senior faculty who guide
                the direction of the ecosystem and keep research activity
                accountable to good research practice.
              </p>
            </div>


            <div className="leadership-list">

              <div className="leadership-item">
                <h3>Project Proposals</h3>

                <p>
                  Reviewed for feasibility, scope and academic merit.
                </p>
              </div>


              <div className="leadership-item">
                <h3>Ethics Applications</h3>

                <p>
                  Assessed to protect participants and uphold research
                  integrity.
                </p>
              </div>


              <div className="leadership-item">
                <h3>Funding Recommendations</h3>

                <p>
                  Advised on grants and internal support for approved
                  projects.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* BEYOND DEPARTMENTS */}

        <section className="beyond-section">

          <div className="beyond-header">
            <span className="about-section-label">
              Beyond Departments
            </span>

            <h2>
              Collaboration beyond individual disciplines.
            </h2>
          </div>


          <div className="beyond-grid">

            <div className="beyond-column">

              <h3>Research Teams</h3>

              <p>
                Teams are organised around research areas and bring together
                researchers with related interests to collaborate on projects
                and publications.
              </p>

              <Link to="/research-areas">
                Explore Research Areas &amp; Groups
              </Link>

            </div>


            <div className="beyond-column">

              <h3>Partners</h3>

              <p>
                We work alongside academic, industry and community partners
                who help shape, fund and apply the research happening across
                the college.
              </p>

              <Link to="/partnerships">
                See Partnerships &amp; Collaboration
              </Link>

            </div>

          </div>

        </section>


        {/* CONTACT */}

        <section className="about-contact">

          <span className="about-section-label">
            Get in Touch
          </span>

          <h2>
            Have a question about research?
          </h2>

          <p>
            Have questions about R&amp;D structure, proposals, or
            collaboration opportunities? Reach us at
          </p>

          <p className="contact-email">
            academic.research@islingtoncollege.edu.np
          </p>

        </section>

      </main>

    </div>
  );
}