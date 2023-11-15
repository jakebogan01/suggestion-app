<script>
    /* svelte-ignore unused-export-let */
    import {writable} from "svelte/store";

    export let params;
    import router from "page";
    import {getContext, onMount, setContext} from "svelte";
    import Suggestions from "../stores/suggestions";
    import formatDistanceToNow from "date-fns/formatDistanceToNow";

    const currentUser = getContext('user');
    const suggestion = getContext('suggestion');
    const comments = writable(JSON.parse(null));
    setContext('comments', comments);

    let showReplyForm = false;

    let error = [];
    let commentFormFields = {body: "", user: null, suggestion: null};
    let replyFormFields = {body: "", user: null, comment: null};

    onMount( async () => {
        const response = await fetch( `/api/suggestions/${ params?.slug }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser?.token}`,
            },
        });
        const data = await response.json();

        if ( response.ok ) {
            suggestion.set(data[0]);
            comments.set($suggestion?.comments);
            commentFormFields.suggestion = $suggestion?._id;
            commentFormFields.user = $currentUser?.id
            replyFormFields.user = $currentUser?.id
        }
    })

    $: {
        $comments;
        commentFormFields;
        replyFormFields;
        console.log($comments)
    }

    const deletePost = async ( id ) => {
        const response = await fetch( `/api/suggestions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser?.token}`,
            },
        });

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

    const deleteComment = async (id) => {
        const response = await fetch( `/api/comments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser?.token}`,
            },
        });

        if ( response.ok ) {
            comments.update(currentData => {
                if (currentData.length === 0) {
                    return currentData;
                }

                return currentData.filter( item => item._id !== id );
            });
        }
    }

    const deleteReply = async (id) => {
        const response = await fetch( `/api/replies/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$currentUser?.token}`,
            },
        });

        if ( response.ok ) {
            comments.update(currentData => {
                return currentData.map( comment => {
                    if (comment?.replies) {
                        comment.replies = comment.replies.filter( reply => reply._id !== id );
                    }

                    return comment;
                });
            });
        }
    }

    const postComment = async () => {
        const response = await fetch("/api/comments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${$currentUser?.token}`,
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
        const response = await fetch("/api/replies/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${$currentUser?.token}`,
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
</script>

{#if $suggestion}
    <div class="border-2 border-black p-2">
        <p>{ $suggestion?.title }</p>
        <a href="/suggestions/{ $suggestion?.slug }" class="text-blue-500">{ $suggestion?.slug }</a>
        <p>{ $suggestion?.description }</p>
        <p class="p-2 bg-blue-200">{ $suggestion?.tag }</p>

        {#if $currentUser?.id === $suggestion?.user_id}
            <button type="button" on:click={()=> { deletePost( $suggestion?._id ) }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>
            </button>
            <a href="/suggestion/edit/{$suggestion?.slug}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            </a>
        {/if}
    </div>

    {#if $comments}
        {#each $comments as comment (comment?._id)}
            <div class="border border-red-500 p-2">
                <p>{ comment?.body }</p>
                <p>{comment?.createdAt ? formatDistanceToNow(new Date(comment?.createdAt), { addSuffix: true }) : 'less than a minute ago'}</p>
                <button type="button" on:click={()=>{replyToComment(comment._id)}}>Reply</button>
                {#if $currentUser?.id === comment?.user}
                    <button type="button" on:click={()=> { deleteComment( comment?._id ) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>
                    </button>
                {/if}
            </div>
            {#if comment?.replies}
                {#each comment?.replies as reply (reply?._id)}
                    <div class="border border-blue-500 pl-10 py-2">
                        <p>{reply?.body}</p>
                        <p>{reply?.createdAt ? formatDistanceToNow(new Date(reply?.createdAt), { addSuffix: true }) : 'less than a minute ago'}</p>
                        <button type="button" on:click={()=>{replyToComment(comment?._id)}}>Reply</button>
                        {#if $currentUser?.id === reply?.user}
                            <button type="button" on:click={()=> { deleteReply( reply?._id ) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>
                            </button>
                        {/if}
                    </div>
                {/each}
            {/if}
        {/each}
    {/if}
{:else}
    <p>loading...</p>
{/if}

<div>
    <a href="/">back to suggestions</a>
</div>

<form on:submit|preventDefault={postComment}>
    <textarea on:input={(e) => (commentFormFields.body = e.target.value)} name="description" id="description">{commentFormFields.body}</textarea>
    <button type="submit" class="bg-gray-500">Post</button>
</form>

{#if showReplyForm}
    <form on:submit|preventDefault={postReply}>
        <textarea on:input={(e) => (replyFormFields.body = e.target.value)} name="description" id="description">{replyFormFields.body}</textarea>
        <button type="submit" class="bg-gray-500">Post</button>
    </form>
{/if}