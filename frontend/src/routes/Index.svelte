<script>
     /* svelte-ignore unused-export-let */
     export let params;
     import router from 'page';
     import { onMount, getContext } from "svelte";
     import Suggestions from "../stores/suggestions";

     const currentUser = getContext('user');
     const suggestion = getContext('suggestion');
     let currentPageData;
     $: currentPageData;

     onMount( async () => {
          suggestion.set(null);

          const response = await fetch( "/api/suggestions/", {
               headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${$currentUser.token}`,
               },
          });
          const data = await response.json();

          if ( response.ok ) {
               Suggestions.set([ data.suggestions ]);
               currentPageData = data;
          }
     })

     const handleLogout = () => {
          localStorage.setItem('user', null);
          currentUser.set(null);
          Suggestions.set([]);
          suggestion.set(null);
          router.redirect('/login');
     };

     const updatePagination = async (action, num) => {
            if (action === "next" && num < currentPageData?.totalPages) {
                 num++;
            }

            if (action === "prev" && num > 1) {
                 num--;
            }

          suggestion.set(null);

          const response = await fetch( `/api/suggestions/?page=${num}`, {
               headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${$currentUser.token}`,
               },
          });
          const data = await response.json();

          if ( response.ok ) {
               Suggestions.set([ data.suggestions ]);
               currentPageData = data;
          }
     }
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

     <nav aria-label="Pagination" class="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8">
          <div class="flex flex-1 justify-between sm:justify-end">
               <button type="button" on:click={() => ( updatePagination('prev', currentPageData?.currentPage) )} disabled={currentPageData?.currentPage < currentPageData?.totalPages} class="disabled:opacity-50 relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Previous</button>
               <button type="button" on:click={() => ( updatePagination('next', currentPageData?.currentPage) )} disabled={currentPageData?.currentPage >= currentPageData?.totalPages} class="disabled:opacity-50 relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Next</button>
          </div>
     </nav>

     <div>
          <button on:click={handleLogout} type="button">Log out</button>
     </div>
</div>