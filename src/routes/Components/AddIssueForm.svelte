<script>
    import {typeCards, addCard} from "./DataStore.js";
    import {addIssue} from "./DataStoreOnline.js";
    import {createEventDispatcher} from "svelte";

    export let currentBoard;
    export let idBoardComponent;
    export let isOnline;

    let title;
    let selectedType = typeCards[0];
    const dispatch = createEventDispatcher();

    function loading(bool, reload) {
        dispatch("loading", {
            bool: bool,
            reload: reload,
        });
    }

    function closeModal() {
        dispatch("closeModal");
    }

    const createCard = function () {
        if (title != null) {
            if (isOnline) {
                loading(false, false);
                addIssue(currentBoard, title).then((response) => {
                    if (response.ok) {
                        loading(false, true);
                    } else {
                    }
                });
            }
            if (selectedType !== typeCards[0]) {
                addCard(idBoardComponent, currentBoard, title, selectedType);
            }
            closeModal();
        }
    };

    const resetFrom = function () {
        title = null;
        selectedType = typeCards[0];
    };

    const cancelForm = function () {
        closeModal();
    };
</script>

<h1 class="title">Add Issue</h1>
<form>
    <label for="types">Issue Title</label>
    <input type="text" placeholder="Title" bind:value={title}/>

    {#if !isOnline}
        <label for="types">Type</label>
        <div class="select-container">
            <div>
                <select id="types" bind:value={selectedType}>
                    {#each typeCards as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/if}
    <div class="buttons-container">
        <button class="btn-create" on:click={createCard}>Create issue</button>
        <div class="btn-left">
            <button class="btn-reset" on:click={resetFrom}>Reset</button>
            <button class="btn-cancel" on:click={cancelForm}>Cancel</button>
        </div>
    </div>
</form>

<style>
    .title {
        font-weight: bold;
        cursor: default;
    }

    form {
        display: absolute;
        flex-direction: column;
        margin: 0 auto;
        border-radius: 10px;
        padding: 20px;
        height: 300px;
    }

    label {
        display: block;
        margin-bottom: 10px;
        font-weight: 300;
        font-size: 1.5rem;
    }

    input {
        padding: 10px;
        font-size: 16px;
        border: 1px solid gainsboro;
        border-radius: 4px;
        margin-bottom: 20px;
        width: 100%;
        cursor: text;
    }

    .select-container {
        margin-bottom: 30px;
    }

    .select-container select {
        padding: 10px;
        font-size: 16px;
        border: 1px solid gainsboro;
        border-radius: 4px;
        width: 100%;
    }

    .buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn-cancel,
    .btn-reset {
        background-color: white;
        color: black;
        border: 1px solid lightgray;
        border-radius: 4px;
        font-size: 16px;
        width: 100px;
        height: 40px;
    }

    .btn-create {
        background-color: #d8d8d8;
        color: black;
        border: 1px solid gainsboro;
        border-radius: 4px;
        font-size: 16px;
        width: 160px;
        height: 40px;
    }

    .btn-reset:hover,
    .btn-create:hover,
    .btn-cancel:hover {
        cursor: default;
        background-color: #b1b1b1;
    }
</style>
