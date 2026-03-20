const { Album, Song } = require('../database/models');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageBuffer = async (file) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: 'music-api',
    resource_type: 'image',
  });
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      include: {
        model: Song,
        as: 'songs',
        attributes: ['id', 'title', 'duration'],
      },
    });
    res.status(200).json({
      success: true,
      data: albums,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching albums',
      error: error.message,
    });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id, {
      include: {
        model: Song,
        as: 'songs',
        attributes: ['id', 'title', 'duration'],
      },
    });
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching album',
      error: error.message,
    });
  }
};

const createAlbum = async (req, res) => {
  try {
    const { title, artist, year } = req.body;
    
    if (!title || !artist || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, artist, year',
      });
    }
    
    const albumData = { title, artist, year };
    
    // Handle image upload if file is provided
    if (req.file) {
      const uploadedImage = await uploadImageBuffer(req.file);
      albumData.imageUrl = uploadedImage.secure_url;
      albumData.imagePublicId = uploadedImage.public_id;
    }
    
    const album = await Album.create(albumData);
    
    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating album',
      error: error.message,
    });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, year } = req.body;
    
    const album = await Album.findByPk(id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    const updateData = { title, artist, year };
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (album.imagePublicId) {
        await cloudinary.uploader.destroy(album.imagePublicId);
      }
      const uploadedImage = await uploadImageBuffer(req.file);
      updateData.imageUrl = uploadedImage.secure_url;
      updateData.imagePublicId = uploadedImage.public_id;
    }
    
    await album.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Album updated successfully',
      data: album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating album',
      error: error.message,
    });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const album = await Album.findByPk(id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (album.imagePublicId) {
      await cloudinary.uploader.destroy(album.imagePublicId);
    }
    
    await album.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Album deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting album',
      error: error.message,
    });
  }
};

// =============== SONG CONTROLLERS ===============

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: {
        model: Album,
        as: 'album',
        attributes: ['id', 'title', 'artist', 'year'],
      },
    });
    
    res.status(200).json({
      success: true,
      data: songs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching songs',
      error: error.message,
    });
  }
};

const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findByPk(id, {
      include: {
        model: Album,
        as: 'album',
        attributes: ['id', 'title', 'artist', 'year'],
      },
    });
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message,
    });
  }
};

const createSong = async (req, res) => {
  try {
    const { title, duration, albumId } = req.body;
    
    if (!title || !duration || !albumId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, duration, albumId',
      });
    }
    
    // Verify album exists
    const album = await Album.findByPk(albumId);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    const songData = { title, duration, albumId };
    
    // Handle image upload if file is provided
    if (req.file) {
      const uploadedImage = await uploadImageBuffer(req.file);
      songData.imageUrl = uploadedImage.secure_url;
      songData.imagePublicId = uploadedImage.public_id;
    }
    
    const song = await Song.create(songData);
    
    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: song,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating song',
      error: error.message,
    });
  }
};

const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration, albumId } = req.body;
    
    const song = await Song.findByPk(id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    // Verify album exists if albumId is being updated
    if (albumId && albumId !== song.albumId) {
      const album = await Album.findByPk(albumId);
      if (!album) {
        return res.status(404).json({
          success: false,
          message: 'Album not found',
        });
      }
    }
    
    const updateData = { title, duration, albumId };
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (song.imagePublicId) {
        await cloudinary.uploader.destroy(song.imagePublicId);
      }
      const uploadedImage = await uploadImageBuffer(req.file);
      updateData.imageUrl = uploadedImage.secure_url;
      updateData.imagePublicId = uploadedImage.public_id;
    }
    
    await song.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: song,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating song',
      error: error.message,
    });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findByPk(id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (song.imagePublicId) {
      await cloudinary.uploader.destroy(song.imagePublicId);
    }
    
    await song.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting song',
      error: error.message,
    });
  }
};

// =============== EXPORTS ===============

module.exports = {
  // Album controllers
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  // Song controllers
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
};
