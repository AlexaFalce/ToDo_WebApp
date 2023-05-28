import {typeCards} from "./DataStore.js";

const prefixURL = "https://supsi-ticket.cloudns.in/supsi-agile-boards/bff/";

const API_KEY = "rennafalce";

export async function getBoards() {
    const response = await fetch(prefixURL + "boards").catch(() => console.log("Error"));
    return response.json();
}

export async function getFilteredItems(idBoard, searchText = "", filterType = null) {


    let url = `${prefixURL}boards/${idBoard}/search?apiKey=${API_KEY}`

    if (searchText !== "") {
        url += `&search=${searchText}`
    }

    if (filterType !== null && filterType !== typeCards[0]) {
        url += `&issueType=${filterType}`
    }

    return fetch(url).then(response => response.json())
        .catch(() => console.log("Error"));
}

export function getItemsFetch(idBoard) {

    return fetch(`${prefixURL}boards/${idBoard}?apiKey=${API_KEY}`)
        .then(response => response.json())
        .catch(() => console.log("Error"));
}

export function addIssue(idBoard, title) {
    return fetch(`${prefixURL}boards/${idBoard}/issues?apiKey=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"title": title})
        })
        .catch(() => console.log("Error"));
}

export function updateIssue(issueID, status) {
    if (status === "IN PROGRESS") status = "IN_PROGRESS";
    return fetch(`${prefixURL}issues/${issueID}/status?apiKey=${API_KEY}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({status: status})
        })
        .catch(() => console.log("Error"));
}