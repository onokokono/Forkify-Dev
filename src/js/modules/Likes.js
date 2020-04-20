export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img }
        this.likes.push(like);

        //Persist data to localStorage
        this.persistData();

        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);
        this.likes.splice(index, 1);

        //Persist data to localStorage;
        this.persistData();

    };

    isLiked(id) {
        return this.likes.findIndex(element => element.id === id) !== -1
    };

    getNumOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    loadData() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restore from localStorage;
        if(storage) this.likes = storage;
    }
}