function JobDescription({ setJd }) {
  return (
    <textarea
      placeholder="Enter Job Description"
      onChange={(e) => setJd(e.target.value)}
    />
  );
}

export default JobDescription;