const { Router } = require('express');
const controllers = require('../controllers');
const upload = require('../middleware/upload');

const router = Router();

router.get('/', (req, res) => res.send("Welcome to Music API"));

router.get('/albums', controllers.getAllAlbums);
router.get('/albums/:id', controllers.getAlbumById);
router.post('/albums', upload.single('image'), controllers.createAlbum);
router.put('/albums/:id', upload.single('image'), controllers.updateAlbum);
router.delete('/albums/:id', controllers.deleteAlbum);

router.get('/songs', controllers.getAllSongs);
router.get('/songs/:id', controllers.getSongById);
router.post('/songs', controllers.createSong);
router.put('/songs/:id', controllers.updateSong);
router.delete('/songs/:id', controllers.deleteSong);

module.exports = router;