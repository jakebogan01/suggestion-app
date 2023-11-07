<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import router from "page";
    import { getContext, onMount} from "svelte";
    import Suggestions from "../stores/suggestions";
    import Suggestion from "../stores/suggestion";
    import formatDistanceToNow from "date-fns/formatDistanceToNow";

    const currentUser = getContext('user');

    onMount( async () => {
        const response = await fetch( `/api/suggestions/${ params.slug }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser.token}`,
            },
        });
        const data = await response.json();

        if ( response.ok ) {
            Suggestion.set(data);
        }
    })

    const handleDelete = async ( id ) => {
        const response = await fetch( `/api/suggestions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser.token}`,
            },
        });
        // const data = await response.json();

        if ( response.ok ) {
            Suggestions.update( currentData => {
                if ( currentData.length === 0 ) {
                    return currentData;
                }

                let filteredSuggestions = currentData[0].filter( item => item._id !== id );
                return [ filteredSuggestions, ...currentData ];
            });

            router.redirect('/');

        } else {
            router.redirect('/');
        }
    }
</script>

<h1>single suggestion</h1>
{#if $Suggestion.length < 1}
    <p>loading...</p>
{:else}
    <div class="border-2 border-black p-2">
        <p>{ $Suggestion[0].title }</p>
        <a href="/suggestions/{ $Suggestion[0].slug }" class="text-blue-500">{ $Suggestion[0].slug }</a>
        <p>{ $Suggestion[0].description }</p>
        <p class="p-2 bg-blue-200">{ $Suggestion[0].tag }</p>
        <p>{formatDistanceToNow(new Date($Suggestion[0].createdAt), { addSuffix: true })}</p>
        <button type="button" on:click={()=> { handleDelete( $Suggestion[0]._id ) }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>
        </button>
    </div>
{/if}

<div>
    <a href="/">back to suggestions</a>
</div>