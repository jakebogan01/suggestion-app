<script>
     /* svelte-ignore unused-export-let */
     export let params;
     import router from 'page';
     import { onMount, getContext } from "svelte";
     import Suggestions from "../stores/suggestions";

     const currentUser = getContext('user');

     onMount( async () => {
          const response = await fetch( "/api/suggestions/");
          const data = await response.json();

          if ( response.ok ) {
               Suggestions.set([ data ]);
          }
     })

     const handleLogout = () => {
          localStorage.setItem('user', null);
          currentUser.set(null);
          router.redirect('/login');
     };
</script>

<div>
     <a href="/suggestion/create">Create Suggestion</a>
     <div class="space-y-4 px-4">
          {#if $Suggestions.length < 1}
               <p>loading...</p>
          {:else}
               {#each $Suggestions[0] as suggestion ( suggestion._id )}
                    <div class="border-2 border-black p-2">
                         <p>{ suggestion.title }</p>
                         <a href="/suggestions/{ suggestion.slug }" class="text-blue-500">{ suggestion.slug }</a>
                         <p>{ suggestion.description }</p>
                         <p class="p-2 bg-blue-200">{ suggestion.tag }</p>
                    </div>
               {:else}
                    <p>There is no feedback</p>
               {/each}
          {/if}
     </div>

     <div>
          <button on:click={handleLogout} type="button">Log out</button>
     </div>
</div>