<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import Suggestions from "../stores/suggestions";

    let errors = [];
    let emptyFields = [];
    let formValues = {
        title: "",
        slug: "",
        description: "",
        department: "Commercial",
        tag: "Bug"
    };

    const handleSubmit = async ( e ) => {
        formValues.slug = formValues.title.toLowerCase().replace( / /g, "-" );

        const response = await fetch("/api/suggestions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( formValues ),
        });

        const data = await response.json();

        if ( !response.ok ) {
            if (data.error.errors) {
                errors = Object.values( data.error.errors );
            } else {
                errors = Object.values( {message: data.error} );
            }
            console.log( "error", errors );
            // emptyFields = data.emptyFields;
        } else {
            errors = [];

            Suggestions.update( currentData => {
                if ( currentData.length === 0 ) {
                    currentData.push( [ data ] );
                    return [ ...currentData ];
                }
                currentData[0].unshift( data )
                return [ ...currentData ];
            });

            window.location.href = "/";
            // emptyFields = [];
        }
    };
</script>

<form on:submit|preventDefault={ handleSubmit } class="create">
    <h3>Add a New Suggestion</h3>

    <div>
        <label for="title">Title:</label>
        <input type="text" on:change={(e) => ( formValues.title = e.target.value )} name="title" id="title" bind:value={ formValues.title } class:error={ emptyFields.includes("title") }/>
    </div>

    <div>
        <label for="description">Description:</label>
        <textarea on:change={(e) => ( formValues.description = e.target.value )} class:error={ emptyFields.includes("load") } name="description" id="description">{ formValues.description }</textarea>
    </div>

    <div>
        <label for="department">Department:</label>
        <select on:change={(e) => ( formValues.department = e.target.value )} id="department" name="department" class:error={ emptyFields.includes("reps") }>
            <option value="commercial" selected>Commercial</option>
            <option value="consumer">Consumer</option>
            <option value="finance">Finance</option>
            <option value="it">IT</option>
            <option value="legal">Legal</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
        </select>
    </div>

    <div>
        <label for="tag">Tag:</label>
        <select on:change={(e) => ( formValues.tag = e.target.value )} id="tag" name="tag" class:error={ emptyFields.includes("reps") }>
            <option value="bug" selected>Bug</option>
            <option value="improvement">Improvement</option>
            <option value="issue">Issue</option>
            <option value="new feature">New Feature</option>
            <option value="research">Research</option>
            <option value="ui">UI</option>
            <option value="us">UX</option>
        </select>
    </div>

    <div>
        <button type="submit" class="bg-gray-500 px-4 py-6">Add Suggestion</button>
        {#if errors}
            {#each errors as error}
                {#if error.message}
                    <div class="text-red-500">{ error.message }</div>
                {:else}
                    <div class="text-red-500">{ error }</div>
                {/if}
            {/each}
        {/if}
    </div>
</form>

<div>
    <a href="/">back to suggestions</a>
</div>