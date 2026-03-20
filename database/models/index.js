const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const envConfigs =  require('../config/config');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];
const db = {};

let sequelize;
try {
  if (config.url) {
    sequelize = new Sequelize(config.url, config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
} catch (error) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      console.log(`✓ Loaded model: ${model.name}`);
      db[model.name] = model;
    } catch (error) {
      console.error(`✗ Error loading model from ${file}:`, error.message);
      throw error;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
