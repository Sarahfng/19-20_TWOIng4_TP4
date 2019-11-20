var express = require('express');
var router = express.Router();
const _ = require('lodash');

let movies =[];

/* GET all movies */
router.get('/', function(req, res) {
    res.status(200).json({ movies: movies });
});


/* GET movie by ID */
router.get('/:id', function(req, res, next) {
    const id = req.params.id;

    const movieSelected = _.find(movies, ["id", id]);
    if(!movieSelected){
        res.status(200).json({
            message: 'Movie not found'});
    }
    else {
        res.status(200).json({
            message: 'Movie found',
            movie: movieSelected
        });
    }
});

/* PUT movie */
router.put('/', (req, res) => {
    const movie = req.body.movie;
    const id = _.uniqueId();

    movies.push({
        movie:movie,
        id:id
    });

    res.status(200).json({
        message : `Just added ${id}`,
        movieAdded: movie
    })
});

/* POST movie */
router.post('/:id', (req, res) => {
    const id = req.params.id;
    const modifiedMovieName = req.body.movie;

    const movieSelected = _.find(movies, ["id", id]);

    movieSelected.movie = modifiedMovieName;

    res.status(200).json({
        message: `Hey le titre du film #${movieSelected.id} a été modifié`
    })
});

/* DELETE movie */
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    _.remove(movies, ["id", id]);

    res.status(200).json({
        message: `Hey le film #${id} a été supprimé`
    })
});

module.exports = router;
