import { PipelineResult, RankedCandidate } from '../types';

interface ShortlistDisplayProps {
  result: PipelineResult;
}

const ScoreGauge = ({ score }: { score: number }) => {
  let className = 'score-value';
  if (score >= 75) className += ' high';
  else if (score >= 50) className += ' medium';
  else className += ' low';
  return <span className={className}>{score}</span>;
};

export default function ShortlistDisplay({ result }: ShortlistDisplayProps) {
  const stats = result.statistics || {
    total: 0,
    average_match_score: 0,
    average_interest_score: 0,
    high_interest_count: 0,
    strong_fit_count: 0,
  };
  const candidates = result.ranked_candidates || result.top_candidates || [];
  const recommendations = result.recommendations || [];

  const handleExport = () => {
    const data = {
      generated_at: new Date().toISOString(),
      statistics: stats,
      top_candidates: candidates.slice(0, 5).map((candidate: RankedCandidate) => ({
        name: candidate.candidate.name,
        title: candidate.candidate.title,
        company: candidate.candidate.company,
        match_score: candidate.match_score,
        interest_score: candidate.interest_score,
        combined_score: candidate.combined_score,
        skills: candidate.candidate.skills,
        experience_years: candidate.candidate.experience_years,
      })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `shortlist-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="shortlist-container">
        <h2>Ranked Shortlist</h2>

        {result.parsed_jd && (
          <div className="parsed-summary">
            <div>
              <strong>Detected skills:</strong> {(result.parsed_jd.technical_skills || []).slice(0, 6).join(', ') || 'None'}
            </div>
            <div>
              <strong>Priority responsibility:</strong> {result.parsed_jd.key_responsibilities?.[0] || 'Not detected'}
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Evaluated</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.average_match_score}</div>
            <div className="stat-label">Avg Match</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.average_interest_score}</div>
            <div className="stat-label">Avg Interest</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.high_interest_count}</div>
            <div className="stat-label">High Interest</div>
          </div>
        </div>

        <div className="candidates-list">
          {candidates.slice(0, 10).map((candidate: RankedCandidate) => (
            <div key={candidate.candidate.id} className="candidate-card">
              <div className="candidate-header">
                <div>
                  <div className="candidate-title">#{candidate.rank} - {candidate.candidate.name}</div>
                  <div className="candidate-subtitle">
                    {candidate.candidate.title} at {candidate.candidate.company || 'Unknown'}
                  </div>
                </div>
                <div className="rank-badge">Rank #{candidate.rank}</div>
              </div>

              <div className="scores-row">
                <div className="score-item">
                  <div className="score-label">Match Score</div>
                  <ScoreGauge score={candidate.match_score} />
                </div>
                <div className="score-item">
                  <div className="score-label">Interest Score</div>
                  <ScoreGauge score={candidate.interest_score} />
                </div>
                <div className="score-item">
                  <div className="score-label">Combined</div>
                  <ScoreGauge score={candidate.combined_score} />
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <strong>{candidate.candidate.experience_years}y experience</strong> | {candidate.candidate.location || 'Location TBD'}
              </div>

              <div style={{ fontSize: '12px', marginBottom: '10px', padding: '8px', background: '#f8fafc', borderRadius: '10px' }}>
                Skills: {candidate.match_breakdown.skills_match}% | Experience: {candidate.match_breakdown.experience_match}% | Seniority: {candidate.match_breakdown.seniority_match}%
              </div>

              <div className="reasoning-box">{candidate.interest_assessment.fit_alignment_comments}</div>

              {candidate.candidate.skills.length > 0 && (
                <div className="skills-list">
                  <div className="skills-label">Key Skills:</div>
                  {candidate.candidate.skills.slice(0, 5).map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {candidate.candidate.skills.length > 5 && <span className="skill-tag">+{candidate.candidate.skills.length - 5} more</span>}
                </div>
              )}

              <div style={{ fontSize: '12px', marginTop: '8px', padding: '8px', background: 'rgba(29, 78, 216, 0.05)', borderRadius: '10px' }}>
                <strong>Interest Level:</strong> {candidate.interest_assessment.engagement_level || 'Not assessed'}<br />
                <strong>Likelihood to apply:</strong> {candidate.interest_assessment.likelihood_to_apply}
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h3>Recruiter Recommendations</h3>
            <ul>
              {recommendations.slice(0, 3).map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {result.scoring_explanation && (
          <div className="scoring-explanation">
            <h3>Scoring Logic</h3>
            <pre>{result.scoring_explanation}</pre>
          </div>
        )}

        <button className="btn btn-primary export-button" onClick={handleExport}>
          Export to JSON
        </button>
      </div>
    </div>
  );
}
