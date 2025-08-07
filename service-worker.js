// Define um nome e versão para o cache
const CACHE_NAME = 'campeonato-app-v2'; // Versão atualizada do cache

// Lista de ficheiros essenciais para a "casca" da aplicação
const urlsToCache = [
  '/',
  '/index.html' // Se o seu ficheiro principal tiver outro nome, altere aqui
];

// Evento de instalação: guarda os ficheiros essenciais em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e a guardar a casca da aplicação');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch: estratégia "cache-first", com fallback para a rede e cache dinâmico
// Esta é uma abordagem mais robusta que guarda os recursos externos na primeira vez que são acedidos
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se a resposta estiver no cache, retorna-a
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não, busca na rede
        return fetch(event.request).then(
          networkResponse => {
            // Se a busca na rede for bem-sucedida, guarda uma cópia no cache para uso futuro
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
            // Opcional: pode retornar uma página de fallback offline aqui se a busca falhar
            console.log('Fetch falhou; a aplicação está offline e o recurso não está em cache.', error);
        });
      })
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
            console.log('A apagar cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
