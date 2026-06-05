import { useState } from 'react';

export default function AddRecipeForm({ onCancel, onAdded }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [servings, setServings] = useState(4);
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ qty: '', unit: '', item: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function setIngredient(index, field, value) {
    setIngredients(prev => {
      const copy = prev.slice();
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addRow() {
    setIngredients(prev => [...prev, { qty: '', unit: '', item: '' }]);
  }

  function removeRow(i) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) return setError('Name is required');
    const ingr = ingredients
      .map(({ qty, unit, item }) => ({ qty: qty === '' ? '' : Number(qty), unit: unit || '', item: (item || '').trim() }))
      .filter(i => i.item);
    if (ingr.length === 0) return setError('At least one ingredient with an item name is required');

    const payload = {
      name: trimmedName,
      category: category.trim() || '',
      origin: origin.trim() || '',
      servings: Number(servings) || 1,
      ingredients: ingr,
      instructions: instructions.trim() || ''
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed ${res.status}`);
      }
      const data = await res.json();
      onAdded && onAdded(data);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit} style={{marginTop: 16}}>
      <h3>Add Recipe</h3>
      {error && <div style={{color: 'var(--danger)', marginBottom: 8}}>{error}</div>}
      <div style={{display: 'grid', gap: 8}}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Category (optional)" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Origin (optional)" value={origin} onChange={e => setOrigin(e.target.value)} />
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <label style={{minWidth: 80}}>Servings</label>
          <input type="number" min={1} value={servings} onChange={e => setServings(Number(e.target.value) || 1)} />
        </div>

        <div>
          <label style={{display: 'block', marginBottom: 6}}>Ingredients</label>
          {ingredients.map((ing, i) => (
            <div key={i} style={{display: 'flex', gap: 8, marginBottom: 8}}>
              <input placeholder="qty" value={ing.qty} onChange={e => setIngredient(i, 'qty', e.target.value)} style={{width: 80}} />
              <input placeholder="unit" value={ing.unit} onChange={e => setIngredient(i, 'unit', e.target.value)} style={{width: 80}} />
              <input placeholder="item" value={ing.item} onChange={e => setIngredient(i, 'item', e.target.value)} style={{flex: 1}} />
              <button type="button" onClick={() => removeRow(i)} aria-label="Remove ingredient">✕</button>
            </div>
          ))}
          <button type="button" onClick={addRow}>Add ingredient</button>
        </div>

        <textarea placeholder="Instructions (optional)" value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} />

        <div style={{display: 'flex', gap: 8}}>
          <button type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add Recipe'}</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
