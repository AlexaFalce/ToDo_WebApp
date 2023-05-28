<script>
    import {deleteCard} from "./DataStore.js";
    import FaTrash from "svelte-icons/fa/FaTrash.svelte";
    import {createEventDispatcher} from "svelte";

    export let card;
    export let idBoardComponent;
    export let isOnline;

    let compressedTitle;

    const getTitle = function () {
        const max = 26;
        if (card.title.length <= max) {
            compressedTitle = card.title;
        } else {
            let newTitle = "";
            for (let i = 0; i < max; i++) {
                newTitle += card.title[i];
            }
            newTitle += "...";
            compressedTitle = newTitle;
        }
    };

    const dispatch = createEventDispatcher();

    function cardClicked(e) {
        dispatch("cardClicked", {
            id: card.id,
            title: card.title,
            type: card.type,
            status: card.status,
        });
    }

    $: getTitle(card.title);
</script>

<div class="card {card.type}">
    <div class="details" on:click={cardClicked}>
        <p class="status {card.type}_Status">{card.status}</p>
        <p class="status">{card.type}</p>
        <p>{compressedTitle}</p>
    </div>
    {#if !isOnline}
        <div
                class="btn-icon btn-trash d-flex justify-content-center align-items-center w-25"
                on:click={() => deleteCard(idBoardComponent, card.id)}
        >
            <FaTrash/>
        </div>
    {/if}
</div>

<style>
    .card {
        border: 1px solid black;
        border-radius: 4px;
        padding: 16px;
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
    }

    .card:active {
        cursor: grabbing;
    }

    .details {
        width: 225px;
    }

    .status {
        display: inline-block;
        padding: 0.4em 0.5em;
        font-size: 0.8em;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        background-color: #8c8c8c;
    }

    .TASK_Status {
        background-color: red;
    }

    .TASK {
        border-left: 7px solid red;
    }

    .BUG {
        border-left: 7px solid green;
    }

    .BUG_Status {
        background-color: green;
    }

    .USER_STORY {
        border-left: 7px solid blue;
    }

    .USER_STORY_Status {
        background-color: blue;
    }

    p {
        font-size: 16px;
        margin: 0;
    }

    .btn-trash {
        height: 30px;
        color: gray;
    }

    .btn-trash:hover {
        color: #3b3b3b;
        cursor: pointer;
    }
</style>
