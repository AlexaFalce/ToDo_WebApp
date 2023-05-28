<script>
    import MyList from "./MyList.svelte";
    import {getWritable, typeCards} from "./DataStore.js";
    import {getItemsFetch, getFilteredItems} from "./DataStoreOnline.js";
    import {createEventDispatcher} from "svelte";

    export let currentBoard;
    export let currentFilterType;
    export let searchTerm;
    export let idBoardComponent;
    export let isOnline;
    export let loaded = true;
    export let reloadFromParent = {
        bool: false,
        reload: false,
    };

    let listIssues = [];
    const dispatch = createEventDispatcher();

    function emptySearchBar(searchTerm, type) {
        dispatch("emptySearchBar", {
            searchTerm: searchTerm,
            type: type,
        });
    }

    function loadIssues() {
        loaded = false;
        listIssues = [];
        if (isOnline) {
            getItemsFetch(currentBoard).then((data) => {
                listIssues = data;
                loaded = true;
            });
        } else {
            getWritable(idBoardComponent).cards.subscribe((value) => {
                listIssues = value;
            });

            loaded = true;
        }
    }

    function loadApi() {
        if (isOnline) {
            loaded = false;
            getFilteredItems(currentBoard, searchTerm, currentFilterType).then(
                (data) => {
                    listIssues = data;
                    loaded = true;
                }
            );
        } else {
            loadIssues();
        }
    }

    function changeLoad(e) {
        emptySearchBar("", typeCards[0]);

        loaded = e.detail.bool;
        if (e.detail.reload) loadIssues(currentBoard);
    }

    function changeLoadFromParent() {
        loaded = reloadFromParent.bool;
        if (reloadFromParent.reload) loadIssues(currentBoard);
    }

    $: loadIssues(currentBoard);
    $: loadApi(searchTerm, currentFilterType);
    $: changeLoadFromParent(reloadFromParent);
</script>

<div class="board h-100">
    <div class="row gx-4 h-100 overflow-auto">
        {#if loaded}
            <div class="col-12 col-sm-12 col-md-12 col-lg-4  todo">
                <MyList
                        title="TODO"
                        titleColor="#BA55D3"
                        {currentBoard}
                        on:addCard
                        on:cardClicked
                        {currentFilterType}
                        {searchTerm}
                        {idBoardComponent}
                        {isOnline}
                        {listIssues}
                        on:loading={changeLoad}
                />
            </div>
            <div class="col-12 col-sm-12 col-md-12 col-lg-4 in-progress">
                <MyList
                        title="IN PROGRESS"
                        titleColor="#25a7da"
                        {currentBoard}
                        on:cardClicked
                        {currentFilterType}
                        {searchTerm}
                        {idBoardComponent}
                        {isOnline}
                        {listIssues}
                        on:loading={changeLoad}
                />
            </div>
            <div class="col-12 col-sm-12 col-md-12 col-lg-4 done">
                <MyList
                        title="DONE"
                        titleColor="#32CD32"
                        {currentBoard}
                        on:cardClicked
                        {currentFilterType}
                        {searchTerm}
                        {idBoardComponent}
                        {isOnline}
                        {listIssues}
                        on:loading={changeLoad}
                />
            </div>
        {:else}
            <div class="col-12 col-sm-12 col-md-12 col-lg-12 h-100 text-light">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
