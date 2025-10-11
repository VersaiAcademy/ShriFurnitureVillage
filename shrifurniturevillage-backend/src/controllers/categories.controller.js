import Category from '../models/Category.js';

export async function listCategories(req, res) {
  const categories = await Category.find({}).sort('name');
  res.json(categories);
}

export async function createCategory(req, res) {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
  const exists = await Category.findOne({ $or: [{ name }, { slug }] });
  if (exists) return res.status(409).json({ error: 'Category exists' });
  const created = await Category.create({ name, slug });
  res.status(201).json(created);
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
}


