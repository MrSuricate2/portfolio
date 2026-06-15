if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./assets/js/sw.js')
    .then(reg => console.log('Service Worker enregistré', reg))
    .catch(err => console.log('Erreur Service Worker', err));
}
