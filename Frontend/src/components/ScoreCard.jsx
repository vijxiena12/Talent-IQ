function ScoreCard({ result }) {
  if (!result) return null;

  return (
    <div>
      <h3>Final Score: {result.final_score}%</h3>
      <p>Overall: {result.overall}%</p>
      <p>Skills: {result.skill_score}%</p>
      <p>Experience: {result.experience_score}%</p>
    </div>
  );
}

export default ScoreCard;