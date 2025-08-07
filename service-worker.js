// Define um nome e versão para o cache
const CACHE_NAME = 'campeonato-app-v1';

// Lista de ficheiros essenciais para a aplicação funcionar offline
// Adicionamos as fontes do Google e Font Awesome aqui para garantir que funcionem offline
const urlsToCache = [
  '/',
  '/index.html', // Se o seu ficheiro principal tiver outro nome, altere aqui
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Evento de instalação: guarda os ficheiros em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e a guardar ficheiros essenciais');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch: responde com os ficheiros do cache se estiverem disponíveis
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna a resposta do cache
        if (response) {
          return response;
        }
        // Se não, busca na rede
        return fetch(event.request);
      }
    )
  );
});

// Evento de ativação: limpa caches antigos para manter a aplicação atualizada
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
