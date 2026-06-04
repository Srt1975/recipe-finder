// conversion helpers with ingredient-specific densities (approximate)
function cupsToGramsByIngredient(itemKey) {
  const map = {
    flour: 120,
    "all-purpose flour": 120,
    sugar: 200,
    "granulated sugar": 200,
    milk: 240,
    cream: 240,
    "olive oil": 218,
    butter: 227,
    tomatoes: 180,
    rice: 195,
    couscous: 173,
    chickpeas: 240,
    oats: 90
  };
  return map[itemKey];
}

function toGrams(qty, unit, item) {
  const u = (unit || '').toLowerCase();
  const itemKey = (item || '').toLowerCase();
  if (u === 'g' || u === 'gram' || u === 'grams') return qty;
  if (u === 'kg') return qty * 1000;
  if (u === 'oz' || u === 'ounce' || u === 'ounces') return qty * 28.3495;
  if (u === 'lb' || u === 'pound' || u === 'pounds') return qty * 453.592;
  // cups -> grams using density if available
  if (u === 'cup' || u === 'cups') {
    // find a matching key in itemKey
    for (const key in {flour:1, sugar:1, milk:1, cream:1, 'olive oil':1, butter:1, tomatoes:1, rice:1, couscous:1, chickpeas:1, oats:1}) {
      if (itemKey.includes(key)) {
        const gpc = cupsToGramsByIngredient(key);
        if (gpc) return qty * gpc;
      }
    }
    // fallback for liquids: 240 g per cup
    return qty * 240;
  }
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') return qty * 15;
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') return qty * 5;
  return null;
}

function toFluidOunces(qty, unit) {
  const u = (unit || '').toLowerCase();
  if (['floz','fl oz','fl. oz','fluid ounce','fluid ounces'].includes(u)) return qty;
  if (u === 'cup' || u === 'cups') return qty * 8;
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') return qty * 0.5;
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') return qty * (1/6);
  if (u === 'ml') return qty * 0.033814;
  if (u === 'l' || u === 'litre' || u === 'liters') return qty * 33.814;
  return null;
}

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return '-';
  if (Math.abs(n - Math.round(n)) < 0.001) return String(Math.round(n));
  return Number(n.toFixed(2)).toString();
}

export function convertIngredient(ing, scaledQty) {
  const unit = (ing.unit || '').toLowerCase();
  const itemKey = (ing.item || '').toLowerCase();
  const countUnits = ['unit', 'each', 'pcs', 'pieces', 'piece', 'count'];
  if (countUnits.includes(unit) || itemKey.match(/egg|egg\b|piece|slice/)) {
    return { qty: formatNumber(scaledQty), unit: 'each' };
  }

  const grams = toGrams(scaledQty, unit, itemKey);
  if (grams != null) {
    return { qty: String(Math.round(grams)), unit: 'g' };
  }

  const floz = toFluidOunces(scaledQty, unit);
  if (floz != null) {
    // show fl oz with one decimal
    return { qty: Number(floz.toFixed(1)), unit: 'fl oz' };
  }

  return { qty: formatNumber(scaledQty), unit: ing.unit || '' };
}

export default { convertIngredient };
