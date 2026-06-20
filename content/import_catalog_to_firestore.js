/**
 * Hemet Valley Tools - Firebase Catalog Importer & Seeding Utility
 * 
 * This script seeds your Firestore database with the high-fidelity Makita & Milwaukee product 
 * and rental datasets. It also includes helper logic to parse custom Excel/CSV catalog files.
 * 
 * Pre-requisites:
 * 1. Ensure `firebase-admin` is installed: npm install firebase-admin
 * 2. Ensure application default credentials are set or GCP environment is logged in.
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 1. Initialize Firebase Admin SDK
// By default, it will leverage your active gcloud login credentials.
admin.initializeApp({
  projectId: "hemetvalleytools"
});

// CRITICAL: Point to the custom named Firestore database "hemetvalleytools"
const db = admin.firestore("hemetvalleytools");

/**
 * Seeds Firestore with the standard high-fidelity catalog from JSON
 */
async function seedCatalog() {
  console.log("Reading catalog file...");
  const catalogPath = path.join(__dirname, "hemet_valley_tools_catalog.json");
  
  if (!fs.existsSync(catalogPath)) {
    console.error(`Error: Catalog JSON file not found at ${catalogPath}`);
    return;
  }

  const rawData = fs.readFileSync(catalogPath, "utf8");
  const catalog = JSON.parse(rawData);

  console.log("Seeding products...");
  for (const product of catalog.products) {
    try {
      await db.collection("products").doc(product.id).set({
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Successfully seeded product: ${product.name} [ID: ${product.id}]`);
    } catch (error) {
      console.error(`Error seeding product ${product.id}:`, error.message);
    }
  }

  console.log("Seeding rentals...");
  for (const rental of catalog.rentals) {
    try {
      await db.collection("rentals").doc(rental.id).set({
        ...rental,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Successfully seeded rental: ${rental.name} [ID: ${rental.id}]`);
    } catch (error) {
      console.error(`Error seeding rental ${rental.id}:`, error.message);
    }
  }

  console.log("Catalog seeding completed successfully.");
}

/**
 * Parses and imports a custom CSV file of tools into Firestore.
 * Expects a CSV structure with headers: id, brand, name, modelNumber, category, subCategory, price, features (comma-separated), spec_keys, spec_values
 */
async function importFromCSV(csvFilePath) {
  console.log(`Attempting to parse CSV catalog from: ${csvFilePath}`);
  if (!fs.existsSync(csvFilePath)) {
    console.error("Error: CSV file path does not exist.");
    return;
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf8");
  const lines = fileContent.split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  let importCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle standard CSV comma splitting (supporting basic quotes)
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
    const row = {};
    headers.forEach((header, idx) => {
      let val = values[idx] ? values[idx].trim() : "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      row[header] = val;
    });

    if (!row.id || !row.name) {
      console.log(`Skipping invalid CSV line ${i}: Missing ID or Name.`);
      continue;
    }

    // Build product schema from CSV row
    const product = {
      id: row.id,
      brand: row.brand || "Unknown",
      name: row.name,
      modelNumber: row.modelNumber || "N/A",
      category: row.category || "general",
      subCategory: row.subCategory || "General",
      price: parseFloat(row.price) || 0.0,
      specs: {},
      features: row.features ? row.features.split(";").map(f => f.trim()) : [],
      imageUrl: row.imageUrl || "/assets/products/placeholder.png",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Reconstruct dynamic specifications if present as semi-colon separated lists of key:value
    if (row.specs) {
      row.specs.split(";").forEach(pair => {
        const parts = pair.split(":");
        if (parts.length === 2) {
          product.specs[parts[0].trim()] = parts[1].trim();
        }
      });
    }

    try {
      await db.collection("products").doc(product.id).set(product);
      console.log(`Imported tool from CSV: ${product.name} [ID: ${product.id}]`);
      importCount++;
    } catch (err) {
      console.error(`Failed to import CSV item at line ${i}:`, err.message);
    }
  }

  console.log(`Successfully imported ${importCount} tools from CSV.`);
}

// 4. Command Execution Routing
const args = process.argv.slice(2);
const command = args[0] || "seed";

if (command === "seed") {
  seedCatalog().catch(console.error);
} else if (command === "csv") {
  const filePath = args[1];
  if (!filePath) {
    console.error("Please specify the path to your CSV catalog file. e.g., node import_catalog_to_firestore.js csv ./my_tools.csv");
  } else {
    importFromCSV(filePath).catch(console.error);
  }
}
