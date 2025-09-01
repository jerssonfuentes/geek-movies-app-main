// testMongoConnection.js
const { MongoClient } = require("mongodb");

// 🔹 Cambia la URL de conexión con la de tu servidor MongoDB
const uri = "mongodb://localhost:27017"; // Ejemplo local
// const uri = "mongodb+srv://usuario:password@cluster.mongodb.net"; // Ejemplo Atlas

// 🔹 Nombre de la base de datos
const dbName = "mi_base_datos";

async function testConnection() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    console.log("⏳ Conectando a MongoDB...");
    await client.connect();
    console.log("✅ Conexión exitosa a MongoDB");

    const db = client.db(dbName);
    // Probar una colección
    const collections = await db.listCollections().toArray();
    console.log("📂 Colecciones en la base de datos:", collections.map(c => c.name));
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Conexión cerrada");
  }
}

testConnection();
