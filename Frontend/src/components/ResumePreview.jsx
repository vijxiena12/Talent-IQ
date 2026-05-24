function ResumePreview({ text }) {
  if (!text) return null;

  return <pre>{text}</pre>;
}

export default ResumePreview;