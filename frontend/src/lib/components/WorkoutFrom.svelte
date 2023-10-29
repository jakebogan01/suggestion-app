<script>
     import { getContext } from 'svelte';
     import Suggestions from '../../stores/suggestions.js';

     // grab the user store
     const currentUser = getContext('user');

     let inputValues = {
          title: '',
          load: '',
          reps: '',
          slug: '',
     };
     let error = null;
     let emptyFields = [];

     const handleSubmit = async (e) => {
          // Check if the user is logged in
          if (!$currentUser) {
               error = "You must be logged in to add a workout.";
               return
          }
          
          // Create the slug
          inputValues.slug = inputValues.title.toLowerCase().replace(/ /g, '-');

          // Send the data to the server
          const response = await fetch('/api/workouts', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${$currentUser.token}`,
               },
               body: JSON.stringify(inputValues),
          });
          // Handle the response
          const data = await response.json();

          if (!response.ok) {
               error = data.error;
               emptyFields = data.emptyFields;
          } else {
               // Add the new workout to the store
               Suggestions.update(currentData => {
                    // add item to beginning of array (unshift)
                    currentData[0].unshift(data.workout)
                    return [...currentData];
               });
               console.log('New workout added!', data.workout);

               // Reset the form
               inputValues = {
                    title: '',
                    load: '',
                    reps: '',
                    slug: '',
               };
               emptyFields = [];
          }
     };
</script>

<form on:submit|preventDefault={handleSubmit} class="create">
     <h3>Add a New Workout</h3>

     <label for="title">Excersize Title:</label>
     <input type="text" on:change={(e) => (inputValues.load = e.target.value)} name="title" id="title" bind:value={inputValues.title} class:error={emptyFields.includes('title')} />
     
     <label for="load">Load (in Kg):</label>
     <input type="number" on:change={(e) => (inputValues.load = e.target.value)} name="load" id="load" bind:value={inputValues.load} class:error={emptyFields.includes('load')} />

     <label for="reps">Reps:</label>
     <input type="number" on:change={(e) => (inputValues.reps = e.target.value)} name="reps" id="reps" bind:value={inputValues.reps} class:error={emptyFields.includes('reps')} />

     <button type="submit" class="bg-gray-500 px-4 py-6">Add Workout</button>
     {#if error}
          <div class="error">{error}</div>
     {/if}
</form>