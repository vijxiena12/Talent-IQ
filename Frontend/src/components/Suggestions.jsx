function Suggestions({ suggestions }) {
  if (!suggestions) return null;

  return (
    <div>
      <h4>Suggestions</h4>
      <ul>
        {suggestions.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}

export default Suggestions;