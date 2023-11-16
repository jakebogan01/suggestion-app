<script>
    /* svelte-ignore unused-export-let */
    export let params;
    import router from "page";
    import {getContext, onMount, setContext} from "svelte";
    import {writable} from "svelte/store";
    import Suggestions from "../stores/suggestions";
    import formatDistanceToNow from "date-fns/formatDistanceToNow";

    const currentUser = getContext("user");
    const suggestion = getContext("suggestion");
    const comments = writable(JSON.parse(null));
    setContext("comments", comments);
    let showReplyForm = false;
    let error = [];
    let commentFormFields = {body: "", user: null, suggestion: null};
    let replyFormFields = {body: "", user: null, comment: null};
    let currentPageData, totalComments;
    $: currentPageData;

    onMount(async () => {
        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/suggestions/${ params?.slug }`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
        });
        const data = await response.json();

        if (response.ok) {
            suggestion.set(data?.suggestion[0]);
            comments.set($suggestion?.comments);
            commentFormFields.suggestion = $suggestion?._id;
            commentFormFields.user = $currentUser?.id
            replyFormFields.user = $currentUser?.id
            currentPageData = data;
            totalComments = data?.total;
        }
    })

    $: {
        $comments;
        commentFormFields;
        replyFormFields;
    }

    const deletePost = async (id) => {
        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/suggestions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
        });

        if (response.ok) {
            Suggestions.update(currentData => {
                if (currentData.length === 0) {
                    return currentData;
                }

                let filteredSuggestions = currentData[0].filter(item => item._id !== id);
                return [filteredSuggestions, ...currentData];
            });
            router.redirect("/");
        } else {
            router.redirect("/");
        }
    }

    const deleteComment = async (id) => {
        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
        });

        if (response.ok) {
            comments.update(currentData => {
                if (currentData.length === 0) {
                    return currentData;
                }
                return currentData.filter(item => item._id !== id);
            });
        }
    }

    const deleteReply = async (id) => {
        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/replies/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
        });

        if (response.ok) {
            comments.update(currentData => {
                return currentData.map(comment => {
                    if (comment?.replies) {
                        comment.replies = comment.replies.filter(reply => reply._id !== id);
                    }
                    return comment;
                });
            });
        }
    }

    const postComment = async () => {
        const response = await fetch("https://pny-suggestion-app.vercel.app/api/comments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
            body: JSON.stringify(commentFormFields),
        });
        const data = await response.json();

        if (!response.ok) {
            console.log(error);
        } else {
            comments.update(currentData => {
                currentData.push(data)
                return [...currentData];
            });
            commentFormFields.body = "";
        }
    };

    const postReply = async () => {
        const response = await fetch("https://pny-suggestion-app.vercel.app/api/replies/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser?.token}`,
            },
            body: JSON.stringify(replyFormFields),
        });
        const data = await response.json();

        if (!response.ok) {
            console.log(error);
        } else {
            comments.update(currentData => {
                let comment = currentData.find(({ _id }) => _id === replyFormFields.comment);
                comment.replies = comment.replies || [];
                comment?.replies.push(data)
                return [...currentData];
            });
            replyFormFields.body = "";
            showReplyForm = false;
        }
    };

    const replyToComment = (id) => {
        showReplyForm = true;
        replyFormFields.comment = id;
    }

    const updatePagination = async (action, num) => {
        if (action === "next" && num < currentPageData?.totalPages) {
            num++;
        }
        if (action === "prev" && num > 1) {
            num--;
        }

        comments.set(null);
        const response = await fetch(`https://pny-suggestion-app.vercel.app/api/suggestions/${ params?.slug }?page=${num}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${$currentUser.token}`,
            },

        });
        const data = await response.json();

        if (response.ok) {
            comments.set(data.suggestion[0]?.comments);
            currentPageData = data;
        }
    }
</script>

<div style="min-height: 100vh;">
    <div class="sm:py-6 dark:bg-black" style="min-height: 100vh;">
        <div class="font-jost font-normal max-w-[730px] mx-auto">
            <main class="relative">
                <section class="px-4 md:px-0">
                    <div class="flex justify-between mb-6">
                        <a href="/" class="flex items-center space-x-2">
                            <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L2 5l4-4" stroke="#4661E6" stroke-width="2" fill="none" fill-rule="evenodd"/></svg>
                            <span class="font-bold text-13 md:text-sm text-[#647196] dark:text-white">Go Home</span>
                        </a>

                        {#if $currentUser?.id === $suggestion?.user_id}
                            <div class="space-x-2">
                                <button type="button" on:click={()=> {deletePost($suggestion?._id)}} class="bg-red-500 hover:bg-red-400 font-bold text-13 text-[#F2F4FE] md:text-sm whitespace-nowrap py-2.5 px-4 rounded-[0.625rem]">Delete</button>
                                <a href="/suggestion/edit/{$suggestion?.slug}" class="bg-[#238AB6] hover:bg-[#186489] font-bold text-13 text-[#F2F4FE] md:text-sm whitespace-nowrap py-2.5 px-4 rounded-[0.625rem]">Edit Feedback</a>
                            </div>
                        {/if}
                    </div>

                    {#if $suggestion}
                        <div class="flex flex-col md:flex-row bg-white dark:bg-[#222222] hover:shadow-lg p-6 md:py-7 md:px-8 mt-12 md:mt-16 rounded-[0.625rem] text-13 group" data-sveltekit-preload-data="hover">
                            <div class="hidden md:block pr-10">
                                <button type="button" class="flex flex-row md:flex-col items-center md:justify-center space-x-2 md:space-x-0 bg-[#F2F4FF] hover:bg-[#CED7FF] dark:bg-[#444444] dark:hover:bg-[#238AB6] text-[#3A4374] dark:text-white rounded-[0.625rem] px-4 py-1 md:p-0 md:w-10 md:h-[3.3125rem] font-bold">
                                    <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 6l4-4 4 4" stroke="#4661E6" stroke-width="2" fill="none" fill-rule="evenodd"/></svg>
                                    <span class="mt-1">3</span>
                                </button>
                            </div>
                            <div class="flex-1 md:pr-[1.5625rem]">
                                <h2 class="font-bold text-[#3A4374] dark:text-white md:text-lg leading-3">{$suggestion?.title}</h2>
                                <p class="text-[#647196] dark:text-[#D1D7E9] md:text-base my-2 md:mb-4">{@html $suggestion?.description}</p>

                                <span class="hidden md:inline-block bg-[#F2F4FF] dark:bg-[#444444] dark:text-white rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6] text-base cursor-default">{$suggestion?.tag}</span>
                            </div>
                        </div>
                    {/if}

                    {#if $comments}
                        <div class="bg-white dark:bg-[#222222] hover:shadow-lg px-8 py-6 rounded-[0.625rem] text-13 space-y-10 my-6">
                            <h2 class="font-bold text-lg text-[#3A4374] dark:text-white mb-6 md:mb-0">4 Comments</h2>
                            {#each $comments as comment (comment?._id)}
                                <div id={comment?.id}>
                                    <div class="flex justify-between mb-4">
                                        <div class="flex items-start">
                                            <div class="mr-4 rounded-full min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] overflow-hidden">
                                                <img src="" class="object-cover" alt="user">
                                            </div>
                                            <div>
                                                <div class="text-13 md:text-sm">
                                                    <span class="block font-bold text-[#3A4374] dark:text-white">james</span>
                                                    <span class="block text-[#647196] dark:text-gray-400"><time>{comment?.createdAt ? formatDistanceToNow(new Date(comment?.createdAt), {addSuffix: true}) : "less than a minute ago"}</time></span>
                                                </div>
                                                <p class="hidden md:inline-block text-15 mt-4 text-[#647196] dark:text-[#D1D7E9]">{comment?.body}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {#if $currentUser?.id === comment?.user}
                                                <button type="button" on:click={()=>{deleteComment(comment?._id)}} class="font-semibold text-13 text-red-500 dark:text-red-400 hover:text-red-400 hover:underline mr-2">Delete</button>
                                            {:else}
                                                <button type="button" on:click={()=>{replyToComment(comment._id)}} class="font-semibold text-13 text-[#4661E6] dark:text-[#3bb0e3] hover:text-[#7389f5] dark:hover:text-white hover:underline">Reply</button>
                                            {/if}
                                        </div>
                                    </div>
                                    <p class="md:hidden text-[#647196]">{comment?.body}</p>
                                </div>

                                <hr class="dark:border-gray-700 dark:border-[#444444]">

                                {#if comment?.replies}
                                    {#each comment?.replies as reply (reply?._id)}
                                        <div id={reply?._id} class="pl-10 ml-5 pt-4 border-dotted border-l border-[#E5E7EB] dark:border-[#444444]">
                                            <div class="flex justify-between mb-4">
                                                <div class="flex items-start">
                                                    <div class="mr-4 rounded-full min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] overflow-hidden">
                                                        <img src="" class="object-cover" alt="user">
                                                    </div>
                                                    <div>
                                                        <div class="text-13 md:text-sm">
                                                            <span class="block font-bold text-[#3A4374] dark:text-white">Jake</span>
                                                            <span class="block text-[#647196] dark:text-gray-400"><time>{reply?.createdAt ? formatDistanceToNow(new Date(reply?.createdAt), {addSuffix: true}) : "less than a minute ago"}</time></span>
                                                        </div>
                                                        <p class="hidden md:inline-block text-15 mt-4 text-[#647196] dark:text-[#D1D7E9]">
                                                            <span class="text-blue-600 dark:text-[#3bb0e3]">@Tammy&#xa0;</span>
                                                            {reply?.body}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    {#if $currentUser?.id === reply?.user}
                                                        <button type="button" on:click={()=>{deleteReply(reply?._id)}} class="font-semibold text-13 text-red-500 dark:text-red-400 hover:text-red-400 hover:underline">Delete</button>
                                                    {:else}
                                                        <button type="button" on:click={()=>{replyToComment(comment?._id)}} class="font-semibold text-13 text-[#4661E6] dark:text-[#3bb0e3] dark:hover:text-white hover:text-[#7389f5] hover:underline">Reply</button>
                                                    {/if}
                                                </div>
                                            </div>
                                            <p class="md:hidden text-[#647196]">
                                                <span class="text-blue-600 dark:text-[#3bb0e3]">@Barbie&#xa0;</span>
                                                {reply?.body}
                                            </p>
                                        </div>
                                    {/each}
                                {/if}
                            {/each}
                        </div>
                    {:else}
                        <p>loading...</p>
                    {/if}

                    <!--pagination-->
                    {#if totalComments > 6}
                        <div class="flex justify-between my-6 px-6 sm:px-0">
                            {#if currentPageData?.currentPage < currentPageData?.totalPages}
                                <button type="button" class="text-[#238AB6] opacity-40" disabled><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                            {:else}
                                <button type="button" on:click={() => ( updatePagination("prev", currentPageData?.currentPage) )} disabled={currentPageData?.currentPage < currentPageData?.totalPages} class="text-[#238AB6] hover:opacity-40"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                            {/if}

                            {#if currentPageData?.currentPage >= currentPageData?.totalPages}
                                <button type="button" class="text-[#238AB6] opacity-40" disabled><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                            {:else}
                                <button type="button" on:click={() => ( updatePagination("next", currentPageData?.currentPage) )} disabled={currentPageData?.currentPage >= currentPageData?.totalPages} class="text-[#238AB6] hover:opacity-40"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                            {/if}
                        </div>
                    {/if}

                    <form on:submit|preventDefault={postComment} class="bg-white dark:bg-[#222222] mt-6 p-6 hover:shadow-lg rounded-[0.625rem] text-13">
                        <h2 class="font-bold text-lg text-[#3A4374] dark:text-white mb-6">Add Comment</h2>
                        <div>
                            <label for="body" class="block font-bold text-13 text-[#3A4374] sr-only">Create Comment</label>
                            <div class="mt-3">
                                <textarea on:input={(e) => (commentFormFields.body = e.target.value)} maxlength="255" spellcheck="true" rows="3" cols="50" name="body" id="body" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent placeholder:text-[#8C92B4] dark:placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Type your comment here" style="resize: none;" required>{commentFormFields.body}</textarea>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-4">
                            <div class="text-13 md:text-15 text-[#647196] dark:text-gray-500">
                                <span>{255 - 5 } Characters left</span>
                            </div>
                            <button type="submit" class="bg-[#238AB6] hover:bg-[#186489] font-bold text-white text-13 md:text-sm rounded-[0.625rem] px-4 py-2.5 whitespace-nowrap">Post Comment</button>
                        </div>
                    </form>
                </section>

                {#if showReplyForm}
                    <div class="fixed bottom-0 left-0 w-full bg-white dark:bg-[#222222] mt-6 p-6 hover:shadow-lg z-50">
                        <form on:submit|preventDefault={postReply} class="max-w-[730px] mx-auto rounded-[0.625rem] text-13">
                            <h2 class="font-bold text-lg text-[#3A4374] dark:text-white mb-6">Replying to Tammy</h2>
                            <div>
                                <label for="body" class="block font-bold text-13 text-[#3A4374] sr-only">Create Comment</label>
                                <div class="mt-3">
                                    <textarea on:input={(e) => (replyFormFields.body = e.target.value)} maxlength="255" spellcheck="true" rows="3" cols="50" name="body" id="body" class="block w-full bg-[#F7F8FE] dark:bg-white/20 text-13 md:text-15 text-[#3A4374] dark:text-white p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent placeholder:text-[#8C92B4] dark:placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Type your comment here" style="resize: none;" required autofocus>{replyFormFields.body}</textarea>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mt-4">
                                <div class="text-13 md:text-15 text-[#647196] dark:text-gray-500">
                                    <span>{255 - 3 } Characters left</span>
                                </div>
                                <div>
                                    <button type="button" class="bg-red-500 hover:bg-red-400 font-bold text-white text-13 md:text-sm rounded-[0.625rem] px-4 py-2.5 whitespace-nowrap">Cancel</button>
                                    <button type="submit" class="bg-[#238AB6] hover:bg-[#186489] font-bold text-white text-13 md:text-sm rounded-[0.625rem] px-4 py-2.5 whitespace-nowrap">Post Comment</button>
                                </div>
                            </div>
                        </form>
                    </div>
                {/if}
            </main>
        </div>
    </div>
</div>