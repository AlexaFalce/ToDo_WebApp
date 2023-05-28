<script>
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import { editStatusCard, typeCards } from "./DataStore.js";
    import { updateIssue } from "./DataStoreOnline.js";
    import MyCard from "./MyCard.svelte";
    import { createEventDispatcher } from "svelte";

    export let idBoardComponent;
    export let titleColor;
    export let textColor = "#ffffff";
    export let title;
    export let currentBoard;
    export let currentFilterType;
    export let searchTerm;
    export let isOnline;
    export let listIssues = [];

    let draggableItem = null;
    let filteredList = [];

    function filterList() {
        filteredList = listIssues;
        filteredList = filteredList.filter((item) => {
            let titleBoolean = false;
            if (title === "IN PROGRESS" && isOnline) {
                titleBoolean = item.status === "IN_PROGRESS";
            } else {
                titleBoolean = item.status === title;
            }
            if (isOnline) {
                return titleBoolean;
            } else {
                return titleBoolean && item.board === currentBoard;
            }
        });

        if (!isOnline) {
            if (
                currentFilterType !== typeCards[0] &&
                currentFilterType !== null &&
                currentFilterType !== undefined
            ) {
                filteredList = filteredList.filter(
                    (item) => item.type === currentFilterType
                );
            }

            if (searchTerm !== "") {
                filteredList = filteredList.filter((item) =>
                    item.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        }
    }

    const dispatch = createEventDispatcher();

    function addCard() {
        dispatch("addCard");
    }

    function loading(bool, reload) {
        dispatch("loading", {
            bool: bool,
            reload: reload,
        });
    }

    function handleDragStart(event) {
        draggableItem = event.target;
        event.dataTransfer.setData("text", draggableItem.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const idGrabbedCard = event.dataTransfer.getData("text");
        const droppedItem = document.getElementById(idGrabbedCard);
        update(idBoardComponent, droppedItem.id.split(":")[1], title);
        draggableItem = null;
    }

    function update(idBoardComponent, id, title) {
        if (isOnline) {
            loading(false, false);
            updateIssue(id, title).then((response) => {
                if (response.ok) {
                    loading(false, true);
                } else {
                    alert("Error updating issue");
                }
            });
        } else {
            loading(false, false);
            editStatusCard(idBoardComponent, id, title);
            loading(false, true);
        }
    }

    $: filterList(searchTerm, currentFilterType, listIssues);
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
</svelte:head>

<div class="list-container">
    <div class="col-12 h-100">
        <div
            class="title d-flex justify-content-around justify-content-md-between align-items-center mt-0"
            style="--titleColor:{titleColor}; --textColor:{textColor}"
        >
            <div class="p-1">{title}</div>
            {#if title === "TODO"}
                <div class="p-1 btn-add" id="add" on:click={addCard}>
                    <FaPlus />
                </div>
            {/if}
        </div>
        <div
            class="scroll-box"
            on:dragover={handleDragOver}
            on:drop={handleDrop}
        >
            {#each filteredList as card}
                <div
                    draggable="true"
                    on:dragstart={handleDragStart}
                    id="card:{card.id}"
                    class="cardissue"
                >
                    <MyCard
                        {card}
                        on:cardClicked
                        {idBoardComponent}
                        {isOnline}
                    />
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .list-container {
        padding: 1px;
        width: 100%;
        height: 100%;
        border-radius: 1.5rem;
        background: linear-gradient(45deg, #232323, #1e1e1e);
        box-shadow: -1px 1px 1px #2b2b2b;
    }

    .title {
        margin-bottom: 1rem;
        padding: 1rem;
        text-align: center;
        width: 100%;
        border-radius: 1.5rem 1.5rem 0 0;
        background-color: var(--titleColor);
        opacity: 0.7;
        color: var(--textColor);
        font-family: Georgia (serif);
        font-weight: bold;
        font-size: 1.3rem;
        margin-top: 20px;
        cursor: default;
    }

    .scroll-box {
        overflow-y: auto;
        scrollbar-width: thin;
        height: 65vh;
    }

    .scroll-box::-webkit-scrollbar {
        width: 7px;
    }

    .scroll-box::-webkit-scrollbar-thumb {
        background-color: lightgrey;
        border-radius: 4px;
    }

    .btn-add {
        width: 2rem;
    }

    .btn-add:hover {
        color: #edd2f3;
        cursor: pointer;
    }
</style>
