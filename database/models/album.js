'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.hasMany(models.Song, {
        foreignKey: 'albumId',
        as: 'songs',
      });
    }
  }

  Album.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    year: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Album',
  });

  return Album;
};