<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let tabs: string[];
  export let activeTab: string;

  const dispatch = createEventDispatcher();

  function selectTab(tab: string) {
    activeTab = tab;
    dispatch('tabChange', tab);
  }
</script>

<div class="tabs">
  {#each tabs as tab}
    <button
      class:active={tab === activeTab}
      on:click={() => selectTab(tab)}
    >
      {tab}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    border-bottom: 1px solid #ccc;
    margin-bottom: 1em;
  }

  button {
    flex-grow: 1;
    padding: 0.5em 1em;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: bold;
    color: #555;
    transition: background-color 0.2s;
    border-radius: 0; /* Override water.css */
    margin: 0; /* Override water.css */
  }

  button:hover {
    background-color: #eee;
  }

  button.active {
    color: var(--water-primary-color, #007bff);
    border-bottom: 2px solid var(--water-primary-color, #007bff);
    background-color: #f9f9f9;
  }
</style>