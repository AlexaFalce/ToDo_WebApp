<script>
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import FaTrash from "svelte-icons/fa/FaTrash.svelte";
    import {getWritable, addBoard, deleteBoard} from "./DataStore.js";
    import {getBoards} from "./DataStoreOnline.js";
    import {createEventDispatcher, onMount} from "svelte";

    export let isOnline;
    export let idBoardComponent;
    export let boardList;

    let promise = getBoards();
    let boards = getWritable(idBoardComponent).boards;

    $: if (boardList !== null) {
        for (let b in boardList) {
            addBoard(idBoardComponent, boardList[b].title, boardList[b].id);
        }
    }

    const dispatch = createEventDispatcher();

    function boardClicked(boardId) {
        dispatch("boardClicked", {
            id: boardId,
        });
    }

    function boardDeleted(cardId) {
        deleteBoard(idBoardComponent, cardId);
        dispatch("boardDeleted", {
            id: cardId,
        });
    }

    const newBoard = () => {
        let title = "Board " + ($boards.length + 1);
        addBoard(idBoardComponent, title);
    };
</script>

<div class="list-container h-100">
    <div
            class="title d-flex justify-content-around justify-content-md-between align-items-center mt-0"
    >
        <div class="p-1">BOARDS</div>
        {#if !isOnline}
            <div class="p-1">
                <div class="btn-icon btn-add" on:click={newBoard}>
                    <FaPlus/>
                </div>
            </div>
        {/if}
    </div>
    <hr/>
    <div class="col-12 boards-list overflow-auto">
        {#if !isOnline}
            {#if $boards.length === 0}
                <p class="empty">crete a board</p>
            {:else}
                {#each $boards as board}
                    <div
                            id={board.id}
                            class="title issue-board d-flex justify-content-around justify-content-md-between align-items-center mt-0"
                            on:click={() => boardClicked(board.id)}
                    >
                        <div class="p-1">{board.title}</div>
                        <div
                                class="btn-icon btn-trash p-1"
                                on:click={() => boardDeleted(board.id)}
                        >
                            <FaTrash/>
                        </div>
                    </div>
                {/each}
            {/if}
        {:else}
            {#await promise}
                <div>Loading</div>
            {:then boards}
                {#each boards as board}
                    <div
                            id={board.id}
                            class="title issue-board d-flex justify-content-around justify-content-md-between align-items-center mt-0"
                            on:click={() => boardClicked(board.id)}
                    >
                        <div class="p-1">{board.name}</div>
                    </div>
                {/each}
            {:catch error}
                <div>Connection error</div>
            {/await}
        {/if}
    </div>
</div>

<style>
    .list-container {
        width: 100%;
        height: 100%;
        border-radius: 1.5rem;
        background: linear-gradient(45deg, #232323, #1e1e1e);
        box-shadow: 10px -10px 37px #101010, -10px 10px 37px #323232;
    }

    .title {
        height: 8%;
        padding: 1.5rem;
        font-size: 1rem;
        font-weight: 400;
        align-items: center;
        text-align: center;
        color: rgb(221, 221, 221);
        font-family: Georgia (serif);
        cursor: default;
    }

    .boards-list {
        height: 85%;
        padding: 0 10px 0 10px;
    }

    .issue-board {
        width: 100%;
        background-color: #c2c2c255;
        border-radius: 5px;
        text-align: center;
        padding-top: 1%;
        padding-bottom: 1%;
        margin-top: 1%;
        font-weight: 200;
        font-size: 1.5rem;
        color: rgb(221, 221, 221);
        font-family: Georgia (serif);
    }

    .issue-board:hover {
        background-color: #8c8c8c;
    }

    .empty {
        text-align: center;
        color: rgb(221, 221, 221);
        font-family: fantasy;
    }

    hr {
        height: 3px;
        border-width: 0;
        margin-top: 0;
        background-color: #c2c2c2;
    }

    .btn-icon {
        width: 1.6rem;
    }

    .btn-trash:hover {
        color: #3b3b3b;
        cursor: pointer;
    }

    .btn-add:hover {
        color: gray;
        cursor: pointer;
    }
</style>
