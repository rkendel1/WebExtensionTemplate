import App from './popup.svelte';

document.addEventListener('DOMContentLoaded', () => {
  new App({ target: document.getElementById('root') as HTMLDivElement });
});