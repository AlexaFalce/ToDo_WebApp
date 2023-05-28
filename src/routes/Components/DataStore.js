import {writable} from "svelte/store";
import {browser} from "$app/environment";
import {v4 as uuidv4} from "uuid";

export const typeCards = ["-select-", "TASK", "USER_STORY", "BUG"];

const map = {};

export function getWritable(id) {
    if (!map[id]) {
        map[id] = {
            cards: writable(browser ? JSON.parse(window.localStorage.getItem(id + "-st-cards-list")) ?? [] : []),
            boards: writable(browser ? JSON.parse(window.localStorage.getItem(id + "-st-boards-list")) ?? [] : [])
        };
    }
    return {
        cards: map[id].cards,
        boards: map[id].boards
    }
}

export const addBoard = function (mapId, title, idBoard = null) {
    getWritable(mapId).boards.update((item) => {
        let uId = uuidv4();
        let id = idBoard == null ? uId : idBoard;
        for (let i in item) {
            if (item[i].id == id) return item;
        }
        item.push({
            id: id,
            title: title
        });
        return item;
    });
};

export const deleteBoard = (mapId, id) => {

    getWritable(mapId).boards.update((item) => {
        return item.filter((board) => board.id !== id);
    });

    getWritable(mapId).cards.update((item) => {
        return item.filter((card) => card.board !== id);
    });

};

export const addCard = function (mapId, board, title, type, status = null, idCard = null) {
    getWritable(mapId).cards.update((item) => {
        let id = idCard == null ? uuidv4() : idCard;
        for (let i in item) {
            if (item[i].id == id) return item;
        }
        item.push({
            id: id,
            board: board,
            title: title,
            type: type,
            status: status === null ? "TODO" : status
        });
        return item;
    });
};

export const deleteCard = (mapId, id) => {
    getWritable(mapId).cards.update((item) => {
        return item.filter((card) => card.id !== id);
    });
};

export const editStatusCard = (mapId, id, status) => {
    getWritable(mapId).cards.update((existingCards) => {
        const index = existingCards.findIndex((card) => card.id == id);
        const updatedCard = {...existingCards[index]};
        updatedCard.status = status;
        const newCards = [...existingCards];
        newCards[index] = updatedCard;
        return newCards;
    });
};