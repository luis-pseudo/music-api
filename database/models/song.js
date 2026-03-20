'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.belongsTo(models.Album, {
        foreignKey: 'albumId',
        as: 'album',
      });
    }
  }

  Song.init({
    title: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
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
    modelName: 'Song',
  });

  return Song;
};