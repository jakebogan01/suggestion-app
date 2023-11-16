<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import router from "page";
    import {getContext, onMount} from "svelte";
    import Suggestions from "../stores/suggestions";

    const currentUser = getContext("user");
    const suggestion = getContext("suggestion");
    let error = [];
    let emptyFields = [];
    let formValues = {
        title: "",
        slug: "",
        description: "",
        department: null,
        tag: null
    };

    onMount( async () => {
        const response = await fetch( `https://pny-suggestion-app.vercel.app/api/suggestions/${ params.slug }`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser.token}`,
            },
        });
        const data = await response.json();

        if ( response.ok ) {
            suggestion.set(data.suggestion[0]);
            formValues = {
                title: $suggestion.title,
                slug: $suggestion.slug,
                description: $suggestion.description,
                department: $suggestion.department.toLowerCase(),
                tag: $suggestion.tag.toLowerCase()
            };
        }
    })

    $: formValues;

    const handleSubmit = async (id) => {
        formValues.slug = formValues.title.toLowerCase().replace(/ /g, "-");

        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/suggestions/${ id }`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser.token}`,
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

            router.redirect("/");
        }
    };
</script>

<div style="min-height: 100vh;">
    <div class="sm:py-6 dark:bg-black" style="min-height: 100vh;">
        <div class="font-jost font-normal max-w-[730px] mx-auto">
            <main>
                <section class="mb-10 max-w-[530px] mx-auto px-4 md:px-0">
                    <div class="mb-6">
                        <a href="/suggestions/{suggestion?.slug}" class="flex items-center space-x-2">
                            <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L2 5l4-4" stroke="#4661E6" stroke-width="2" fill="none" fill-rule="evenodd"/></svg>
                            <span class="font-bold text-13 md:text-sm text-[#647196] dark:text-white">Go Back</span>
                        </a>
                    </div>

                    <form on:submit|preventDefault={() => { handleSubmit($suggestion._id) }} enctype="multipart/form-data" class="relative bg-white dark:bg-[#222222] hover:shadow-lg p-6 rounded-[0.625rem] mt-12 md:mt-16">
                        <span class="absolute -top-5 md:-top-7 h-10 md:h-14"><svg width="56" height="56" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient cx="103.9%" cy="-10.387%" fx="103.9%" fy="-10.387%" r="166.816%" id="a"><stop stop-color="#E84D70" offset="0%"/><stop stop-color="#A337F6" offset="53.089%"/><stop stop-color="#28A7ED" offset="100%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><circle fill="url(#a)" cx="28" cy="28" r="28"/><path fill="#FFF" fill-rule="nonzero" d="M30.343 36v-5.834h5.686v-4.302h-5.686V20h-4.597v5.864H20v4.302h5.746V36z"/></g></svg></span>
                        <div class="mt-6 md:mt-8">
                            <h3 class="font-bold text-lg md:text-2xl text-[#3A4374] dark:text-white" id="modal-title">Create New Feedback</h3>
                            <div class="mt-6 md:mt-16 space-y-6">
                                <div>
                                    <label for="title" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Title</label>
                                    <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Add a short, descriptive headline</span>
                                    <div class="mt-3">
                                        <input type="text" on:input={(e) => (formValues.title = e.target.value)} value={formValues.title} name="title" id="title" spellcheck="true" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-white/40 ring-inset dark:ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 {emptyFields.includes('title') ? 'border border-red-500' : ''}" required>
                                    </div>
                                    {#if emptyFields.includes("title")}
                                        <p class="text-red-500 text-[0.9rem]">Title must be filled</p>
                                    {/if}
                                </div>
                                <div>
                                    <label for="department" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Department</label>
                                    <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Choose you department for your feedback</span>
                                    <div class="mt-3">
                                        <select on:change={(e) => (formValues.department = e.target.value)} value={formValues.department} id="department" name="department" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-white/40 ring-inset dark:ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
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
                                </div>
                                <div>
                                    <label for="tag" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Category</label>
                                    <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Choose a category for your feedback</span>
                                    <div class="mt-3">
                                        <select on:change={(e) => (formValues.tag = e.target.value)} value={formValues.tag} id="tag" name="tag" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-white/40 ring-inset dark:ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                            <option value="bug" selected>Bug</option>
                                            <option value="improvement">Improvement</option>
                                            <option value="issue">Issue</option>
                                            <option value="new feature">New Feature</option>
                                            <option value="research">Research</option>
                                            <option value="ui">UI</option>
                                            <option value="ux">UX</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label for="description" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Detail</label>
                                    <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Include any specific comments on what should be improved, added, etc.</span>
                                    <div class="mt-3">
                                        <textarea on:input={(e) => (formValues.description = e.target.value)} rows="4" cols="50" spellcheck="true" name="description" id="description" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-white/40 ring-inset dark:ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 {emptyFields.includes('description') ? 'border border-red-500' : ''}" style="resize: none;" required>{formValues.description}</textarea>
                                    </div>
                                    {#if emptyFields.includes("description")}
                                        <p class="text-red-500 text-[0.9rem]">Description must be filled</p>
                                    {/if}
                                </div>
                                <div>
                                    {#if error}
                                        <div class="text-red-500">{error}</div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row md:justify-end items-center md:space-x-4 space-y-4 md:space-y-0 mt-10 mb-8">
                            <button type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-red-500 hover:bg-red-400 px-3 h-10 md:w-[5.8125rem] text-[#F2F4FE] ring-1 ring-inset ring-gray-300 dark:ring-black sm:col-start-1 sm:mt-0">Cancel</button>
                            <button type="submit" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#238AB6] hover:bg-[#186489] px-3 h-10 md:w-[9rem] text-[#F2F4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Update feedback</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    </div>
</div>