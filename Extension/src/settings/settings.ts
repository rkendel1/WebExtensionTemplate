import App from './settings.svelte';

document.addEventListener('DOMContentLoaded', () => {
  new App({ target: document.getElementById('root') as HTMLDivElement });
});