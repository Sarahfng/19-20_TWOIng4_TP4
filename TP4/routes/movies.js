var express = require('express');
var router = express.Router();
const _ = require('lodash');
const API = require('../routes/API_omdb');

let movies =[];
let newAPI = new API();

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
            message: 'Film introuvable'});
    }
    else {
        res.status(200).json({
            movies: [
                {
                    message: 'Film trouvé',
                    id: id,
                    movie: movieSelected.movie,
                    yearOfRelease: movieSelected.yearOfRelease,
                    duration: movieSelected.duration,
                    actors: movieSelected.actors,
                    poster: movieSelected.poster,
                    boxOffice: movieSelected.boxOffice,
                    rottenTomatoesScore: movieSelected.rottenTomatoesScore
                }]
        });
    }
});

/* PUT movie */
router.put('/', (req, res) => {
    const title = req.body.title;

    if (!title) {
        res.status(200).json({
            message: 'Film introuvable'
        });
    }

    else{
        const movieSelected = _.find(movies, ["movie", title]);

        if (!movieSelected) {
            const add = newAPI
                .fetchMovieTitle(title)
                .then(function (response) {

                    // Récupère la donnée d'une API
                    const data = response.data;

                    // On récupère les informations demandé
                    const id = data.imdbID;
                    const movie = data.Title;
                    const yearOfRelease = parseInt(data.Year);
                    const duration = parseInt(data.Runtime);
                    const actors = data.Actors.split(", ");
                    const poster = data.Poster;
                    const boxOffice = data.BoxOffice;
                    const rottenTomatoesScore = parseInt(data.Ratings[1].Value);

                    movies.push({
                        id: id,
                        movie: movie,
                        yearOfRelease: yearOfRelease,
                        duration: duration,
                        actors: actors,
                        poster: poster,
                        boxOffice: boxOffice,
                        rottenTomatoesScore: rottenTomatoesScore
                    });

                    res.status(200).json({
                        movies: [
                            {
                                message: `${movie} a été ajouté`,
                                id: id,
                                yearOfRelease: yearOfRelease,
                                duration: duration,
                                actors: actors,
                                poster: poster,
                                boxOffice: boxOffice,
                                rottenTomatoesScore: rottenTomatoesScore
                            }]
                    })
                })

                .catch(function(error) {
                    // Affiche une erreur
                    console.error(error);
                });
        }
    }
});


/* POST movie */
router.post('/:id', (req, res) => {
    const id = req.params.id;
    const modifiedMovieYear = req.body.movieYear;

    const movieSelected = _.find(movies, ["id", id]);

    movieSelected.yearOfRelease = parseInt(modifiedMovieYear);

    res.status(200).json({
        message: `L'année du film ${movieSelected.movie} a été modifié`
    })
});


/* DELETE movie */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const movieSelected = _.find(movies, ["id", id]);

    _.remove(movies, ["id", id]);

    res.status(200).json({
        message: `Le film ${movieSelected.movie} a été supprimé`
    })
});

module.exports = router;
