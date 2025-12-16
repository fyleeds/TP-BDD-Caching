// src/controllers/productController.js
const Product = require("../models/Product");
const redisClient = require("../config/redis");

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    // Mettre en cache avec un TTL aléatoire entre 30 et 120 secondes
    const ttl = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
    // Utiliser set avec l'option EX pour définir le TTL
    await redisClient.set("products", JSON.stringify(products), { EX: ttl });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Mettre en cache avec un TTL aléatoire entre 30 et 120 secondes
    const ttl = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
    const key = `product:${req.params.id}`;
    // Utiliser set avec l'option EX pour définir le TTL
    await redisClient.set(key, JSON.stringify(product), { EX: ttl });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    // Invalider le cache pour la liste des produits
    await redisClient.del("products");
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.update(productId, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Supprimer la clé Redis correspondante pour invalider le cache
    const productKey = `product:${productId}`;
    await redisClient.del(productKey);

    // Optionnel : Invalider aussi le cache de la liste des produits
    await redisClient.del("products");

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.delete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Invalider le cache pour le produit et la liste des produits
    const productKey = `product:${req.params.id}`;
    await redisClient.del(productKey);
    await redisClient.del("products");
    res.json(deletedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
