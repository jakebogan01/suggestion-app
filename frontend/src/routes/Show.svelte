<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import { onMount } from "svelte";
    import Suggestion from "../stores/suggestion";

    onMount( async () => {
        const response = await fetch( `/api/suggestions/${ params.slug }`);
        const data = await response.json();

        if ( response.ok ) {
            Suggestion.set(data);
        }
    })
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
        <p>{ $Suggestion[0].createdAt }</p>
    </div>
{/if}

<div>
    <a href="/">back to suggestions</a>
</div>