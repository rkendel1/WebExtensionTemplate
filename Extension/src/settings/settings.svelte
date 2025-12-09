<script lang="ts">
  import { type AppSettings } from '../models';
  import settingsConnector from '../settings-connector';

  type InputChangeEvent = Event & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  let appSettings: AppSettings | undefined;
  settingsConnector
    .getAppSettings()
    .then(settingsFromStorage => (appSettings = settingsFromStorage));

  const updateDisplayHelpMessage = (e: InputChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const displayHelpMessage = target.checked;
    settingsConnector.updateSettings({ displayHelpMessage });
  };

  const updateOpenaiApiKey = (e: InputChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const openaiApiKey = target.value;
    settingsConnector.updateSettings({ openaiApiKey });
  };

  $: {
    if (appSettings?.displayHelpMessage) console.log('Get help on GitHub!');
  }
</script>

{#if appSettings}
  <h1>Ghostpost Settings</h1>
  <section>
    <h2>General</h2>
    <form>
      <div class="form-group">
        <input
          type="checkbox"
          id="show-help-message"
          name="show-help-message"
          checked={appSettings.displayHelpMessage}
          on:change={updateDisplayHelpMessage}
        />
        <label for="show-help-message">Show help message in console</label>
      </div>
    </form>
  </section>

  <section>
    <h2>AI Configuration</h2>
    <form>
      <div class="form-group">
        <label for="openai-api-key">OpenAI API Key</label>
        <input
          type="password"
          id="openai-api-key"
          name="openai-api-key"
          placeholder="sk-..."
          value={appSettings.openaiApiKey}
          on:input={updateOpenaiApiKey}
        />
        <p class="note">
          Warning: Storing API keys in browser storage is not fully secure. Use with caution.
        </p>
      </div>
    </form>
  </section>
{/if}

<style>
  h1 {
    padding: 1em 0;
  }
  .note {
    font-size: 0.8em;
    color: #888;
  }
</style>