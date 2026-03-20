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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'Album',
  });

  return Album;
};