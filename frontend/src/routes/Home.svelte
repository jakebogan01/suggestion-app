<script>
     /* svelte-ignore unused-export-let */
     export let params;
     import { onMount, getContext } from "svelte";
     import Suggestions from "../stores/suggestions";

     onMount( async () => {
          // if ($currentUser !== null) {
               const response = await fetch( "/api/suggestions/", {
                    // headers: {
                    //      'Authorization': `Bearer ${$currentUser.token}`,
                    // },
               });
               const data = await response.json();

               if ( response.ok ) {
                    Suggestions.set([ data ]);
               }
          // }
     })
</script>

<div>
     <div>
          {#if $Suggestions.length < 1}
               <p>loading...</p>
          {:else}
               {#each $Suggestions[0] as suggestion ( suggestion._id )}
                    <p>{ suggestion.title }</p>
               {:else}
                    <p>There is no feedback</p>
               {/each}
          {/if}
     </div>
<!--     <WorkoutFrom />-->
</div>