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
 
Milestone 2:
Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della
nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
nazione ritornata dall’API (le flag non ci sono in FontAwesome).
Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca
dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando
attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di
risposta diversi, simili ma non sempre identici).

Milestone 3:
In questa milestone come prima cosa aggiungiamo la copertina del film o della serie
al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo
perché poi potremo generare da quella porzione di URL tante dimensioni diverse.

Milestone 4:
Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp,
creando un layout completo simil-Netflix:
● Un header che contiene logo e search bar
● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma
di “card” in cui lo sfondo è rappresentato dall’immagine di copertina ( consiglio
la poster_path con w342 )
● Andando con il mouse sopra una card (on hover), appaiono le informazioni
aggiuntive già prese nei punti precedenti più la overview.

 Features implementate:
 1) Ricerca sull'API dei film e rispettive informazioni.
 2) Campo cerca nel quale inserire il titolo del film e pulsante (oppure il tasto enter) per attivare la ricerca nell'API.
 3) Se il campo input è vuoto, il tasto cerca concella la ricerca precedente.
 4) Nel caso in cui un immagine non fosse disponibile, viene visualizzata un'immagine alternativa.
 5) Possibilità di filtrare le ricerche in base ai film o alle serie tv.
 6) Per indicare la lingua del film o della serie tv, viene mostrata la bandierina del paese. Una bandiera alternativa
 viene mostrata per quelle mancanti.
 7) Per ogni titolo, tramite hover vengono mostrate tutte le info riguardanti il film o la serie tv.
 8) Diverse sezioni con film e serie tv nella hompage, con slider per scorrere tra i titoli.
 9) Sezione film e sezione serie tv con possibilità di filtro in base al genere.
 10) Infinite Scroll per visualizzare tutte le pagine nelle sezioni film e serie tv.
 11) Paginazione per i risultati della ricerca.
 
 @author Giuseppe Perna <giuseppeperna.cg@gmail.com>
 */

//  Personal API key for Movie DB.
const API_KEY = "0189f77da4edb430313b6634735866fc";

// Init Vue object
const boolFlix = new Vue({
    el: '#boolFlix',
    data: {
        movies: [],
        tvShows: [],
        topRatedMovies: [],
        moviePopular: [],
        tvPopular: [],
        upcoming: [],
        topRatedTvShows: [],
        isActiveTopRatedMovies: false,
        isActiveShows: false,
        genres: [],
        search: "",
        searchResult: [],
        totalPages: null,
        selectedPage: 1,
        elementPage:1,
        selectedGenre: "all",
        checkedCategory: "film",
    },
    mounted() { // API call to get movie and tv shows infos
        axios.get("https://api.themoviedb.org/3/genre/movie/list", {
            params: {
                'api_key': API_KEY,
            }
        }).then(result => {
            this.genres = result.data.genres;
        }),

            axios.get("https://api.themoviedb.org/3/discover/movie", {
                params: {
                    'api_key': API_KEY,
                    'sort_by': 'popularity.desc',
                    language: "it-IT",
                }
            }).then(result => {
                this.topRatedMovies = result.data.results;
            }),

            axios.get("https://api.themoviedb.org/3/discover/tv", {
                params: {
                    'api_key': API_KEY,
                    'sort_by': 'popularity.desc',
                    language: "it-IT",
                }
            }).then(result => {
                this.topRatedTvShows = result.data.results;
            }),

            axios.get("https://api.themoviedb.org/3/movie/upcoming", {
                params: {
                    'api_key': API_KEY,
                    language: "it-IT",
                }
            }).then(result => {
                this.upcoming = result.data.results;
            }),

            axios.get("https://api.themoviedb.org/3/movie/popular", {
                params: {
                    'api_key': API_KEY,
                    language: "it-IT",
                }
            }).then(result => {
                this.moviePopular = result.data.results;
            }),

            axios.get("https://api.themoviedb.org/3/tv/popular", {
                params: {
                    'api_key': API_KEY,
                    language: "it-IT",
                }
            }).then(result => {
                this.tvPopular = result.data.results;
            })

            this.infinteScroll();
    },
    methods: {
        searchMovie() {
            axios.get("https://api.themoviedb.org/3/search/movie", {
                params: {
                    'api_key': API_KEY,
                    query: this.search,
                    page: this.selectedPage,
                    language: "it-IT",
                }
            }).then(result => {
                this.movies = result.data.results;
                this.searchResult = [this.search];
                this.totalPages = result.data.total_pages;
                this.isActiveTopRatedMovies = false;
                this.isActiveShows = false;
            }).catch((error) => {
                console.log(error);
            });
            
        },
        searchTvShow() {
            axios.get("https://api.themoviedb.org/3/search/tv", {
                params: {
                    'api_key': API_KEY,
                    query: this.search,
                    page: this.selectedPage,
                    language: "it-IT",
                }
            }).then(result => {
                this.tvShows = result.data.results;
                this.isActiveTopRatedMovies = false;
                this.isActiveShows = false;
            }).catch((error) => {
                console.log(error);
            });
        },
        nextPage() {
            this.selectedPage += 1;
            this.elementPage++
            if(this.selectedPage >= this.totalPages) {
                this.selectedPage = this.totalPages;
                this.elementPage = this.totalPages;
            };
            this.searchMovie();
            this.searchTvShow();
        },
        previousPage() {
            this.selectedPage -= 1;
            this.elementPage--
            if(this.selectedPage <= 1) {
                this.selectedPage = 1;
                this.elementPage = 1;
            };
            this.searchMovie();
            this.searchTvShow();
        },
        firstPage() {
            this.selectedPage = 1;
            this.elementPage = 1;
            this.searchMovie();
            this.searchTvShow();
        },
        lastPage() {
            this.selectedPage = this.totalPages;
            this.elementPage = this.totalPages;
            this.searchMovie();
            this.searchTvShow();
        },
        scrollRight(target) {
            let content = document.querySelector(target);
                content.scrollLeft += 200;
        },
        scrollLeft(target) {
            let content = document.querySelector(target);
            content.scrollLeft -= 200;
        },
        homepageRefresh() {
            this.multiSearch = [];
            this.search = "";
            this.selectedPage = 1;
            this.isActiveTopRatedMovies = false;
            this.isActiveShows = false;
        },
        infinteScroll() { //Load next results page when the scroll bar reaches the bottom
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                if (bottomOfWindow && this.isActiveTopRatedMovies) {
                    axios.get("https://api.themoviedb.org/3/movie/popular", {
                        params: {
                            'api_key': API_KEY,
                            'sort_by': 'popularity.desc',
                            page: this.selectedPage,
                            language: "it-IT",
                        }
                    }).then(result => {
                        this.moviePopular = [...this.moviePopular.concat(result.data.results)];
                    }).catch(() => this.multiSearch = []);
                }   

                if(bottomOfWindow && this.isActiveShows) {
                    axios.get("https://api.themoviedb.org/3/tv/popular", {
                        params: {
                            'api_key': API_KEY,
                            'sort_by': 'popularity.desc',
                            page: this.selectedPage,
                            language: "it-IT",
                        }
                    }).then(result => {
                        this.tvPopular = [...this.tvPopular.concat(result.data.results)];
                    }).catch(() => this.multiSearch = []);
                }
                this.selectedPage++
            }
        },
        isActiveTv() {
            this.isActiveShows = true;
            this.isActiveTopRatedMovies = false;
            this.multiSearch = [];
            this.search = "";
        },
        isActiveMovie() {
            this.isActiveShows = false;
            this.isActiveTopRatedMovies = true;
            this.multiSearch = [];
            this.search = "";
        }
    },
    computed: {
        filterMovies() {
            if (this.selectedGenre !== 'all') {
                return this.moviePopular.filter(movie => {
                    return movie.genre_ids.includes(this.selectedGenre);
                })
            } else {
                return this.moviePopular;
            }
        },
        filterTvShows() {
            if (this.selectedGenre !== 'all') {
                return this.tvPopular.filter(movie => {
                    return movie.genre_ids.includes(this.selectedGenre);
                })
            } else {
                return this.tvPopular;
            }
        },
        filterByCategory() {         

            if(this.search === "" || this.searchResult[0] !== this.search){
                this.movies = [];
                this.tvShows = [];
                this.searchResult = [];
                this.selectedPage = 1;
                this.elementPage = 1;
                this.checkedCategory = "film";
            }
            if (this.checkedCategory === "film") {
                return this.movies;
            } if (this.checkedCategory === "serie-tv") {
                return this.tvShows;
            }
        }
    }
});