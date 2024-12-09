// stores/theme.js
import { writable } from 'svelte/store';

export const theme = writable('light');

function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }