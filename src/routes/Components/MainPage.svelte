<script>
    import MyBoard from "./MyBoard.svelte";
    import {typeCards, getWritable, addCard} from "./DataStore.js";
    import Modal from "./Modal.svelte";
    import AddIssueForm from "./AddIssueForm.svelte";
    import SideBar from "./SideBar.svelte";
    import {browser} from "$app/environment";

    export let isOnline;
    export let boardList = null;
    export let issues = null;
    export let idBoardComponent;
    export let search = true;
    export let reloadFromParent = {
        bool: false,
        reload: true
    };

    let obj = getWritable(idBoardComponent);
    let cards = obj.cards;
    let boards = obj.boards;
    let timer;
    const waitTime = 300;
    let currentBoard = null;
    let currentFilterType = typeCards[0];
    let showModal = false;
    let searchTerm = "";
    let inputValue;

    $: if (issues !== null && !isOnline) {
        for (let i in issues) {
            let issue = issues[i];
            addCard(
                idBoardComponent,
                issue.board,
                issue.title,
                issue.type,
                issue.status,
                issue.id
            );
        }
    }

    const searchFunction = (e) => {
        const text = e.currentTarget.value;

        clearTimeout(timer);

        timer = setTimeout(() => {
            searchTerm = text;
        }, waitTime);
    };

    cards.subscribe((value) => {
        if (browser) {
            localStorage.setItem(
                idBoardComponent + "-st-cards-list",
                JSON.stringify(value)
            );
        }
    });

    boards.subscribe((value) => {
        if (browser) {
            localStorage.setItem(
                idBoardComponent + "-st-boards-list",
                JSON.stringify(value)
            );
        }
    });

    const changeBoard = function (id) {
        currentBoard = id;
        searchTerm = "";
        inputValue = "";
        currentFilterType = typeCards[0];
    };

    const toggleAddFormModal = () => {
        showModal = !showModal;
    };

    const emptyBar = (e) => {
        searchTerm = e.detail.searchTerm;
        inputValue = "";
        currentFilterType = e.detail.type;
    };

    const emptySearchBar = (s, type) => {
        searchTerm = s;
        inputValue = "";
        currentFilterType = type;
    };

    function changeLoad(e) {
        emptySearchBar("", typeCards[0]);

        reloadFromParent.bool = e.detail.bool;
        reloadFromParent.reload = e.detail.reload;
    }
</script>

<svelte:head>
    <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
            crossorigin="anonymous"
    />
    <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"
    ></script>
</svelte:head>

<Modal {showModal} on:click={toggleAddFormModal}>
    <AddIssueForm
            on:closeModal={toggleAddFormModal}
            {currentBoard}
            {idBoardComponent}
            {isOnline}
            on:loading={changeLoad}
    />
</Modal>
<div class="container-main">
    <div class="row mb-2">
        <div class="col-3 title">
            <label>TODO</label>
        </div>
        {#if search}
            <div class="col-9">
                <div class="row gy-1 search-group">
                    <div class="col-sm-12 col-md-6 group">
                        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
                            <g>
                                <path
                                        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                                />
                            </g>
                        </svg>
                        <input
                                id="text-search-{idBoardComponent}"
                                placeholder="Search"
                                class="input"
                                on:keyup={searchFunction}
                                bind:value={inputValue}
                        />
                    </div>
                    <div class="col-sm-12 col-md-6 group">
                        <select class="form-select" bind:value={currentFilterType}>
                            {#each typeCards as type}
                                <option value={type}>{type}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <div class="row h-90 align-items-start">
        <div class="col-3 h-100">
            <SideBar
                    on:boardClicked={(e) => changeBoard(e.detail.id)}
                    on:boardDeleted={(e) => {
          if (currentBoard === e.detail.id) {
            currentBoard = null;
          }
        }}
                    {idBoardComponent}
                    {isOnline}
                    {boardList}
            />
        </div>
        <div class="col-9 h-100">
            {#if currentBoard != null}
                <MyBoard
                        {currentBoard}
                        on:addCard={toggleAddFormModal}
                        on:cardClicked
                        on:emptySearchBar={emptyBar}
                        {currentFilterType}
                        {searchTerm}
                        {idBoardComponent}
                        {isOnline}
                        {reloadFromParent}
                />
            {:else}
                <div
                        class="text-white h-100 d-flex align-items-center justify-content-center"
                >
                    <h2>No board selected</h2>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .title {
        padding: 20px;
        color: white;
        font-family: Fantasy, serif;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }

    .container-main {
        padding: 1%;
        height: 100vh;
        background-color: #212121;
    }

    .search-group {
        background-color: #212121;
        height: 10%;
        margin-top: 0;
    }

    .group {
        display: flex;
        align-items: center;
        position: relative;
    }

    .input {
        width: 100%;
        height: 5vh;
        line-height: 5vh;
        padding: 0 1rem 0 2.5rem;
        border: 2px solid transparent;
        border-radius: 8px;
        outline: none;
        background-color: #353535;
        transition: 0.3s ease;
    }

    .form-select {
        width: 100%;
        height: 5vh;
        line-height: 5vh;
        padding: 0 1rem 0 2.5rem;
        border: 2px solid transparent;
        border-radius: 8px;
        outline: none;
        transition: 0.3s ease;
        background-color: #353535;
        color: #9e9ea7;
    }

    .input::placeholder {
        color: #9e9ea7;
    }

    .input:focus,
    input:hover {
        outline: none;
        border-color: rgba(234, 76, 137, 0.4);
        background-color: #727272;
        box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
    }

    select:focus,
    select:hover {
        outline: none;
        border-color: rgba(234, 76, 137, 0.4);
        background-color: #727272;
        box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
    }

    .icon {
        position: absolute;
        left: 1rem;
        fill: #9e9ea7;
        width: 1rem;
        height: 1rem;
    }

    .h-90 {
        height: 90%;
    }
</style>
