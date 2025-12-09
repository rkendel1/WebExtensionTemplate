<script lang="ts">
  import Tabs from '../components/Tabs.svelte';
  import { encodeSecret, decodeSecret, removeSecret } from '../encoding-utils';
  import browser from 'webextension-polyfill';

  const TABS = ['Composer', 'Decoder'];
  let activeTab = TABS[0];

  // --- Composer State ---
  let carrierMessage = '';
  let secretMessage = '';
  let encodedOutput = '';

  // --- Decoder State ---
  let inputMessage = '';
  let decodedSecret = '';
  let decodedCarrier = '';

  // --- Detector State ---
  let isDetectorActive = false;

  function handleEncode() {
    encodedOutput = encodeSecret(carrierMessage, secretMessage);
  }

  function handleDecode() {
    decodedSecret = decodeSecret(inputMessage);
    decodedCarrier = removeSecret(inputMessage);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // In a real extension, we'd use a toast notification here.
      console.log('Copied to clipboard!');
    });
  }

  async function toggleDetector() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        // Send message to content script to toggle sidebar
        // The content script returns the new state (true/false)
        const newState = await browser.tabs.sendMessage(tab.id, { type: 'toggleSidebar' });
        isDetectorActive = newState as boolean;
      } catch (e) {
        console.error('Could not communicate with content script. Is it running on this page?', e);
        // If communication fails (e.g., on extension pages or restricted pages), we reset the state.
        isDetectorActive = false;
      }
    }
  }
</script>

<div class="header-bar">
  <Tabs tabs={TABS} bind:activeTab />
  <button on:click={toggleDetector} class="detector-button" class:active={isDetectorActive}>
    {isDetectorActive ? 'Hide Detector Sidebar' : 'Show Detector Sidebar'}
  </button>
</div>

<div class="content-area">
  {#if activeTab === 'Composer'}
    <h2>AI Ghostpost Composer (Encode)</h2>
    
    <p>
      <em>Note: AI generation features require an OpenAI API key configured in settings.</em>
    </p>

    <fieldset>
      <legend>1. Visible Carrier Message (e.g., the social media post)</legend>
      <textarea bind:value={carrierMessage} placeholder="Enter your visible post content here..."></textarea>
    </fieldset>

    <fieldset>
      <legend>2. Secret Message to Hide</legend>
      <textarea bind:value={secretMessage} placeholder="Enter your secret message here..."></textarea>
    </fieldset>

    <button on:click={handleEncode} disabled={!carrierMessage || !secretMessage}>
      Encode Secret
    </button>

    {#if encodedOutput}
      <fieldset>
        <legend>3. Encoded Output (Copy & Share)</legend>
        <textarea readonly value={encodedOutput}></textarea>
        <button on:click={() => copyToClipboard(encodedOutput)}>
          Copy Encoded Post
        </button>
      </fieldset>
    {/if}

  {:else if activeTab === 'Decoder'}
    <h2>Classic Hide/Unhide Tool (Decode)</h2>

    <fieldset>
      <legend>1. Paste Encoded Message</legend>
      <textarea bind:value={inputMessage} placeholder="Paste the encoded message here..."></textarea>
    </fieldset>

    <button on:click={handleDecode} disabled={!inputMessage}>
      Reveal Secret
    </button>

    {#if decodedSecret || decodedCarrier}
      <fieldset>
        <legend>2. Results</legend>
        
        {#if decodedSecret}
          <p><strong>Hidden Secret:</strong></p>
          <textarea readonly value={decodedSecret}></textarea>
          <button on:click={() => copyToClipboard(decodedSecret)}>
            Copy Secret
          </button>
        {:else}
          <p>No secret message found.</p>
        {/if}

        <p><strong>Visible Carrier Message:</strong></p>
        <textarea readonly value={decodedCarrier || inputMessage}></textarea>
        <button on:click={() => copyToClipboard(decodedCarrier || inputMessage)}>
          Copy Carrier
        </button>
      </fieldset>
    {/if}
  {/if}
</div>

<style>
  .header-bar {
    display: flex;
    flex-direction: column;
    padding: 0 1em;
  }
  
  .detector-button {
    margin-bottom: 1em;
  }

  .content-area {
    padding: 0 1em 1em 1em;
  }
  
  h2 {
    margin-top: 0;
    font-size: 1.2em;
  }

  textarea {
    width: 100%;
    min-height: 5em;
    box-sizing: border-box;
    margin-bottom: 0.5em;
  }

  fieldset {
    border: 1px solid #ccc;
    padding: 1em;
    margin-bottom: 1em;
  }

  legend {
    font-weight: bold;
    padding: 0 0.5em;
  }

  button {
    width: 100%;
    margin-bottom: 0.5em;
  }
</style>