<script>
     export let params;
     // import { onMount, getContext } from 'svelte';
     // import Workouts from '../stores/workouts';
     // import Loader from '../lib/components/Loader.svelte';
     // import WorkoutDetails from '../lib/components/WorkoutDetails.svelte';
     // import WorkoutFrom from '../lib/components/WorkoutFrom.svelte';

     // grab the user store
     // const currentUser = getContext('user');

     // onMount(async() => {
     //      if ($currentUser !== null) {
     //           // Get all the workouts from the server
     //           const response = await fetch('/api/workouts', {
     //                headers: {
     //                     'Authorization': `Bearer ${$currentUser.token}`,
     //                },
     //           });
     //           // Handle the response
     //           const data = await response.json();
     //
     //           if (response.ok) {
     //                // Add the new workout to the store
     //                Workouts.set([data]);
     //           }
     //      }
     // })
</script>

<div>
     <div>
          home page
          <!--{#if $Workouts.length < 1}-->
          <!--     <Loader />-->
          <!--{:else}-->
          <!--     {#each $Workouts[0] as workout (workout._id)}-->
          <!--          <WorkoutDetails {workout} />-->
          <!--     {:else}-->
          <!--          <p>There are no workouts</p>-->
          <!--     {/each}-->
          <!--{/if}-->
     </div>
<!--     <WorkoutFrom />-->
</div>