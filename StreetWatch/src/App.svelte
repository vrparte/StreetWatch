<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { theme } from './stores/theme';
  import Navbar from './components/Navbar.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCheckCircle, faExclamationTriangle, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

  let map: L.Map;
  let safetyStatus = "Safe";
  let urgentAlert = null;
  let incidentHistory = [];
  let newIncident = { type: "", location: "", description: "" };
  let showReview = false;

  const incidents = [
    { type: "Robbery", location: "Clifton", coordinates: [39.1342, -84.5186], time: "2 hours ago" },
    { type: "Suspicious Activity", location: "Market Square", coordinates: [39.1305, -84.5152], time: "Yesterday" },
    { type: "Vandalism", location: "Langsam Library", coordinates: [39.1322, -84.5204], time: "3 days ago" },
  ];

  onMount(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      map = (window as any).L.map('map').setView([39.1342, -84.5186], 13);
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      incidents.forEach(incident => {
        (window as any).L.marker(incident.coordinates)
          .addTo(map)
          .bindPopup(`<b>${incident.type}</b><br>${incident.location}<br>${incident.time}`);
      });
    }
  });

  function updateSafetyStatus() {
    safetyStatus = urgentAlert ? "Caution" : "Safe";
  }

  function reportIncident(incident) {
    urgentAlert = incident;
    incidentHistory = [incident, ...incidentHistory];
    updateSafetyStatus();
  }

  function submitIncident() {
    const incident = { ...newIncident, time: "Just now" };
    reportIncident(incident);
    showReview = false;
    newIncident = { type: "", location: "", description: "" };
  }

  function triggerPanicAlert() {
    alert("Panic alert sent to nearby users!");
  }

  $: backgroundColorSafety = safetyStatus === "Safe" 
    ? "bg-gradient-to-r from-green-300 to-green-500 dark:from-green-700 dark:to-green-800" 
    : "bg-gradient-to-r from-yellow-300 to-orange-500 dark:from-yellow-600 dark:to-orange-700";

  $: urgentAlertBackground = urgentAlert
    ? "bg-gradient-to-r from-red-400 to-red-600 dark:from-red-800 dark:to-red-900"
    : "bg-gradient-to-r from-green-300 to-green-500 dark:from-green-700 dark:to-green-800";
</script>


<div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 font-inter pt-0" class:dark={$theme === 'dark'}>
  <Navbar class="fixed top-0 left-0 right-0 z-50 bg-blue-600 dark:bg-blue-900 text-white" />
  <main class="container mx-auto px-4 py-14 space-y-6" in:fade={{ duration: 300, delay: 300 }}>
    <!-- Row 1: Safety Overview and Urgent Alert -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Safety Status Tile -->
      <div class="rounded-2xl shadow-lg p-6 {backgroundColorSafety} transition-all duration-300 hover:scale-102" in:fly={{ y: 50, duration: 300, delay: 300 }}>
        <h2 class="text-2xl font-bold mb-4 tracking-wide flex items-center justify-center text-gray-800 dark:text-white">
          Safety Status
          <FontAwesomeIcon icon={faInfoCircle} class="ml-2 text-sm cursor-help" title="Safe: No incidents reported. Caution: Stay vigilant due to recent incidents." />
        </h2>
        <div class="flex items-center justify-center space-x-4">
          <FontAwesomeIcon icon={safetyStatus === 'Safe' ? faCheckCircle : faExclamationTriangle} class="text-5xl text-gray-800 dark:text-white" />
          <p class="text-4xl font-bold text-gray-800 dark:text-white">{safetyStatus}</p>
        </div>
        <p class="mt-4 text-lg text-center text-gray-700 dark:text-gray-200">Clifton, Cincinnati</p>
      </div>

      <!-- Urgent Alert Tile -->
      <div class="rounded-2xl shadow-lg p-6 {urgentAlertBackground} text-white transition-all duration-300 hover:brightness-110" in:fly={{ y: 50, duration: 300, delay: 400 }}>
        <h2 class="text-2xl font-bold mb-4 tracking-wide text-center">
          {urgentAlert ? 'Urgent Alert' : 'All Clear'}
        </h2>
        {#if urgentAlert}
          <div class="flex items-center justify-center space-x-4">
            <FontAwesomeIcon icon={faExclamationTriangle} class="text-5xl" />
            <div>
              <p class="text-xl font-semibold">{urgentAlert.type} at {urgentAlert.location}</p>
              <p class="text-sm">{urgentAlert.time}</p>
            </div>
          </div>
        {:else}
          <div class="flex items-center justify-center space-x-4">
            <FontAwesomeIcon icon={faCheckCircle} class="text-5xl" />
            <p class="text-lg">No urgent alerts at this time. Stay safe and vigilant!</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Row 2: Interactive Map and Side Tiles -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Incident History Tile -->
      <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4" in:fly={{ y: 50, duration: 300, delay: 500 }}>
        <h2 class="text-xl font-bold mb-4 tracking-wide text-gray-800 dark:text-white">Incident History</h2>
        <div class="max-h-80 overflow-y-auto" style="scroll-behavior: smooth;">
          {#each incidentHistory as incident, i}
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2 transition-all duration-300 hover:scale-101 hover:shadow-md">
              <p class="font-semibold text-gray-800 dark:text-white">{incident.type} at {incident.location}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">{incident.time}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Map Tile -->
      <div class="lg:col-span-2">
        <div id="map" class="rounded-2xl shadow-lg" style="height: 400px;"></div>
      </div>

      <!-- Report Incident and Panic Button Tile -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4" in:fly={{ y: 50, duration: 300, delay: 600 }}>
          <h2 class="text-xl font-bold mb-4 tracking-wide text-gray-800 dark:text-white">Report Incident</h2>
          {#if !showReview}
            <form on:submit|preventDefault={() => showReview = true} class="space-y-4">
              <div class="relative">
                <FontAwesomeIcon icon={faMapMarkerAlt} class="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
                <input type="text" bind:value={newIncident.location} placeholder="Enter location" required class="w-full p-2 pl-10 rounded-lg border dark:bg-gray-700 dark:text-white">
              </div>
              <select bind:value={newIncident.type} required class="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white">
                <option value="">Select incident type</option>
                <option value="Robbery">Robbery</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Burglary">Burglary</option>
              </select>
              <textarea bind:value={newIncident.description} placeholder="Describe the incident" required class="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"></textarea>
              <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300">Review</button>
            </form>
          {:else}
            <div class="space-y-4">
              <p class="text-gray-800 dark:text-white"><strong>Type:</strong> {newIncident.type}</p>
              <p class="text-gray-800 dark:text-white"><strong>Location:</strong> {newIncident.location}</p>
              <p class="text-gray-800 dark:text-white"><strong>Description:</strong> {newIncident.description}</p>
              <div class="flex space-x-4">
                <button on:click={submitIncident} class="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300">Submit</button>
                <button on:click={() => showReview = false} class="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-300">Edit</button>
              </div>
            </div>
          {/if}
        </div>
        <button 
          class="w-full bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 text-white rounded-2xl shadow-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          on:click={triggerPanicAlert}
          in:scale={{ duration: 300, delay: 700 }}
        >
          <span class="text-xl font-bold tracking-wide">Panic Button</span>
        </button>
      </div>
    </div>
  </main>
</div>

<style global lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body) {
    @apply bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800;
    font-family: 'Inter', sans-serif;
  }

  :global(.dark) {
    @apply text-white;
  }

  .hover\:scale-101:hover {
    transform: scale(1.01);
  }

  .hover\:scale-102:hover {
    transform: scale(1.02);
  }

  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
</style>