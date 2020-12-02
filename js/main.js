/**
 @file Milestone 1: Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere 
 completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API 
 tutti i film che contengono ciò che ha scritto l’utente. 
 Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori 
 per ogni film trovato: 
 1) Titolo 
 2) Titolo Originale 
 3) Lingua 
 4) Voto

 Features implementate:
 1) Ricerca sull'API dei film e rispettive informazioni.
 2) Campo cerca nel quale inserire il titolo del film e pulsante (oppure il tasto enter) per attivare la ricerca nell'API.
 3) Se il campo input è vuoto, il tasto cerca concella la ricerca precedente.
 4) Nel caso in cui un immagine non fosse disponibile, viene visualizzata un'immagine alternativa.
 5) Possibilità di ricercare il titolo del film con un filtro in base al genere.

 @author Giuseppe Perna <giuseppeperna.cg@gmail.com>
 */

//  Personal API key for Movie DB.
const API_KEY = "0189f77da4edb430313b6634735866fc";

// Init Vue object
const boolFlix = new Vue({
    el: '#boolFlix',
    data: {
        movies:[],
        genres:[],
        search:"",
        searchResult:[],
        selectedGenre:"all",
    },
    mounted() { // API call to get movie genres
        axios.get("https://api.themoviedb.org/3/genre/movie/list", {
            params: {
                'api_key': API_KEY,
            }
        }).then(result => {
            this.genres= result.data.genres;
        })
     },
    methods: {
        searchMovie() { 
            axios.get("https://api.themoviedb.org/3/search/movie", {
                params: {
                    'api_key': API_KEY,
                    query: this.search,
                }
            }).then(result => {
                this.movies = result.data.results;
                this.searchResult = [this.search];
                this.search ="";
            }).catch(()=> this.movies = []);
        },
    },
    computed: { 
        filterMovies() {
            if (this.selectedGenre !== 'all') {
                return this.movies.filter (movie => {
                    return movie.genre_ids.includes(this.selectedGenre);
                })
            } else {
                return this.movies;
            }
        }
      }
});
