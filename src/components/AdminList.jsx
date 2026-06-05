export default function AdminList({ recipes }) {
  return (
    <div style={{marginTop: 20}}>
      <h2>All Recipes (Admin)</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign: 'left', padding: 8}}>ID</th>
            <th style={{textAlign: 'left', padding: 8}}>Name</th>
            <th style={{textAlign: 'left', padding: 8}}>Category</th>
            <th style={{textAlign: 'left', padding: 8}}>Origin</th>
            <th style={{textAlign: 'left', padding: 8}}>Servings</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(r => (
            <tr key={r.id} style={{borderTop: '1px solid rgba(255,255,255,0.04)'}}>
              <td style={{padding: 8}}>{r.id}</td>
              <td style={{padding: 8}}>{r.name}</td>
              <td style={{padding: 8}}>{r.category}</td>
              <td style={{padding: 8}}>{r.origin}</td>
              <td style={{padding: 8}}>{r.servings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
