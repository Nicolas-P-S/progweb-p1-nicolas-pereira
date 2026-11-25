// O único arquivo que sabe onde a API mora.
const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);

export const API_URL = LOCAL
  ? 'http://localhost:3000'
  : 'https://progweb-p1-nicolas-pereira-frontend.vercel.app';