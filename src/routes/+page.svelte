<script>
    import MainPage from "./Components/MainPage.svelte";

    let boardList = [
        {id: 1, title: "board 1"},
        {id: 2, title: "board 2"},
    ];
    let issues = [
        {id: 1, title: "titolo", type: "BUG", status: "TODO", board: 1},
        {
            id: 2,
            title: "cambiamo il testo",
            type: "USER_STORY",
            status: "IN PROGRESS",
            board: 1,
        },
        {
            id: 3,
            title: "questa è la board 2",
            type: "USER_STORY",
            status: "IN PROGRESS",
            board: 2,
        },
    ];
</script>

<main>
    <MainPage
            idBoardComponent="0"
            isOnline={true}
            search={false}
            on:cardClicked={(issue) => alert(issue.detail.title)}
    />
    <MainPage
            idBoardComponent="0"
            isOnline={true}
            search={true}
            on:cardClicked={(issue) => alert(issue.detail.status)}
    />
    <MainPage
            idBoardComponent="1"
            isOnline={false}
            {boardList}
            {issues}
            on:cardClicked={(issue) =>
            alert(
                "questa issue è " +
                    issue.detail.id +
                    "\n" +
                    issue.detail.title +
                    "\n" +
                    issue.detail.type +
                    "\n" +
                    issue.detail.status
            )}
    />
    <MainPage
            idBoardComponent="2"
            isOnline={false}
            on:cardClicked={(issue) => alert("questa issue è " + issue.detail.id)}
    />
</main>

<style>
</style>
