(function() {
    'use strict';
  
    var app = {
      songs: [],
      container: document.querySelector('.song-container'),
      songTemplate: document.querySelector('.songTemplate'),
    };

    /*
     *
     *  EVENT LISTENERS
     * 
     * */

    document.getElementById('btnRefresh').addEventListener('click',function(){
        console.log("entro");
        app.loadSongs();
    });

    app.displaySongs = function () {
        app.container.innerText= '';

        //artist, image_small, open_url, title
        //.song-img, .song-title, .song-details, .song-url
        app.songs.forEach(function (s) {
            var song = app.songTemplate.cloneNode(true);
            song.querySelector('#song-img').src = s.image_large;
            song.querySelector('#song-title').textContent = s.title;
            song.querySelector('#song-details').textContent = s.artist;
            song.querySelector('#song-link').href = s.open_url;
            song.removeAttribute('hidden');
            app.container.appendChild(song);
        })
    }

    app.loadSongs = function() {
        app.songs = [];
        var url = 'https://ionic-songhop.herokuapp.com/recommendations';

        if ('caches' in window) {
            /*
             * Check if the service worker has already cached this city's weather
             * data. If the service worker has the data, then display the cached
             * data while the app fetches the latest data.
             */
            caches.match(url).then(function(response) {
                if (response) {
                response.json().then(function updateFromCache(json) {
                    console.log(json);
                    app.songs = json.songs;
                    app.loadSongs();
                });
                }
            });
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.response);
                app.songs = response;
                app.displaySongs();
            }
        };

        request.open('GET', url);
        request.send()
    }

    app.init = function() {
        app.loadSongs();
    }

    
    // Startup Code
    app.init();

    if (navigator.serviceWorker.controller) {
        console.log('[PWA Builder] active service worker found, no need to register')
      } else {
      
      //Register the ServiceWorker
        navigator.serviceWorker.register('service-worker.js', {
          scope: './'
        }).then(function(reg) {
          console.log('Service worker has been registered for scope:'+ reg.scope);
        });
      }

})();