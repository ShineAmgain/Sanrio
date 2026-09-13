// Section 11 of the brief requires demo/sample content to be clearly
// distinguishable from genuine institutional information. Any page built
// with placeholder copy (rather than real data from the API) renders this
// banner so nobody mistakes it for authoritative Islington College content.
export default function SampleContentNotice({ text }) {
  return (
    <div className="sample-notice" role="note">
      {text ||
        "Sample content — replace with Islington College's actual information before launch."}
    </div>
  );
}
