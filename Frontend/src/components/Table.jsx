function Table({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Resume</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.Resume}</td>
            <td>{row["Final Score (%)"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;