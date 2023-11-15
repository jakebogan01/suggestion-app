<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import router from "page";
    import {getContext} from "svelte";
    import Suggestions from "../stores/suggestions";

    const currentUser = getContext('user');

    let error = [];
    let emptyFields = [];
    let formValues = {
        title: "",
        slug: "",
        description: "",
        department: "Commercial",
        tag: "Bug"
    };

    const handleSubmit = async () => {
        formValues.slug = formValues.title.toLowerCase().replace(/ /g, "-");

        const response = await fetch("/api/suggestions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${$currentUser.token}`,
            },
            body: JSON.stringify(formValues),
        });

        const data = await response.json();

        if (!response.ok) {
            error = data.error;
            emptyFields = data.emptyFields;
            console.log(error)
        } else {
            error = [];

            Suggestions.update(currentData => {
                if (currentData.length === 0) {
                    currentData.push([data]);
                    return [...currentData];
                }
                currentData[0].unshift(data)
                return [...currentData];
            });

            router.redirect('/');
        }
    };
</script>

<form on:submit|preventDefault={handleSubmit} class="create">
    <h3>Add a New Suggestion</h3>

    <div>
        <label for="title">Title:</label>
        <input type="text" on:input={(e) => (formValues.title = e.target.value)} name="title" id="title" bind:value={formValues.title} class="{emptyFields.includes('title') ? 'border border-red-500' : ''}" />
        {#if emptyFields.includes('title')}
            <div class="text-red-500">Title must be filled</div>
        {/if}
    </div>

    <div>
        <label for="description">Description:</label>
        <textarea on:input={(e) => (formValues.description = e.target.value)} class="{emptyFields.includes('description') ? 'border border-red-500' : ''}" name="description" id="description">{formValues.description}</textarea>
        {#if emptyFields.includes('description')}
            <div class="text-red-500">Description must be filled</div>
        {/if}
    </div>

    <div>
        <label for="department">Department:</label>
        <select on:change={(e) => (formValues.department = e.target.value)} id="department" name="department">
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
        <select on:change={(e) => (formValues.tag = e.target.value)} id="tag" name="tag">
            <option value="bug" selected>Bug</option>
            <option value="improvement">Improvement</option>
            <option value="issue">Issue</option>
            <option value="new feature">New Feature</option>
            <option value="research">Research</option>
            <option value="ui">UI</option>
            <option value="ux">UX</option>
        </select>
    </div>

    <div>
        <button type="submit" class="bg-gray-500 px-4 py-6">Add Suggestion</button>
        {#if error}
            <div class="text-red-500">{error}</div>
        {/if}
    </div>
</form>

<div>
    <a href="/">back to suggestions</a>
</div>