<script lang="ts">
  import { decodeSecret } from '../encoding-utils';

  export let isVisible: boolean = false;
  export let detectedText: string = '';

  $: hasHiddenContent = detectedText.length > 0;
  $: decodedSecret = hasHiddenContent ? decodeSecret(detectedText) : '';

  function closeSidebar() {
    // We rely on content.ts/browser message handling to update isVisible state
    // For simplicity in this injected component, we will just hide it locally.
    isVisible = false;
  }
</script>

{#if isVisible}
<div class="ghostpost-sidebar">
  <header>
    <h3>Ghostpost Detector</h3>
    <button on:click={closeSidebar}>&times;</button>
  </header>
  
  {#if hasHiddenContent}
    <p class="status success">✅ Hidden content detected!</p>
    
    <div class="content-section">
      <h4>Decoded Secret:</h4>
      <textarea readonly value={decodedSecret || 'Could not decode secret.'}></textarea>
    </div>
    
    <div class="content-section">
      <h4>Original Text Snippet:</h4>
      <textarea readonly value={detectedText}></textarea>
    </div>
  {:else}
    <p class="status info">🔍 Scanning page for hidden zero-width characters...</p>
  {/if}
</div>
{/if}

<style>
  .ghostpost-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #f4f4f4;
    border-left: 1px solid #ccc;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 99999;
    padding: 15px;
    font-family: sans-serif;
    overflow-y: auto;
    max-width: 90vw;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  h3 {
    margin: 0;
    font-size: 1.1em;
    color: #007bff;
  }

  header button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }

  .status {
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .info {
    background-color: #e2e3e5;
    color: #383d41;
    border: 1px solid #d6d8db;
  }

  .content-section {
    margin-bottom: 15px;
  }

  .content-section h4 {
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 1em;
  }

  textarea {
    width: 100%;
    min-height: 50px;
    max-height: 150px;
    box-sizing: border-box;
    resize: vertical;
    font-size: 0.9em;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>