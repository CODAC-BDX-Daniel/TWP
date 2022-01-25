import {createStore} from 'vuex';
import router from '../router';
import {token, rootEndPoint} from "../env/env";

export default createStore({
    state: {
        // allListsEndPoint: 'http://localhost:8888/wordpress/wp-json/wp/v2/categories',
        token: token,
        rootEndPoint: rootEndPoint,
        allLists: [],
    },
    mutations: {
        SET_STATE_ALL_LISTS(state, payload) {
            state.allLists = payload
        },
        ADD_LIST(state, newList) {
            // console.log('add list via mutation')
            state.allLists.push(newList)
        }
    },
    actions: {
        //LIST
        fetchAllLists(context) {
            let endPoint = `${this.state.rootEndPoint}/categories`;
            let fetchOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors"
            }
            fetch(endPoint, fetchOptions)
                .then(response => response.json())
                .then(json => {
                    console.log('here are the lists', json);
                    const listsWithoutUncategorized = json.filter(list => list.name != 'uncategorized')
                    context.commit('SET_STATE_ALL_LISTS', listsWithoutUncategorized);
                })
            // console.log('Version 2 - fetch lists from API');
            // console.log('Voici le root url', this.state.rootEndPoint)
            // console.log('to get all lists', this.state.allListsEndPoint)
        },
        createList(context, newListTitle) {
            let _data = {
                name: newListTitle,
                slug: newListTitle,
            };
            let endPoint = `${this.state.rootEndPoint}/categories`;
            let fetchOptions = {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            }
            fetch(endPoint, fetchOptions)
                .then(response => {
                        // if creation ok then commit on local state
                        // console.log(response);

                        if (response.status === 201 && response.ok) {
                            return response.json()

                        } else {
                            console.log('List creation NOK')
                        }
                    }
                )
                .then(data => {
                    console.log(data)
                    context.commit('ADD_LIST', {
                        id: data.id,
                        name: data.name,
                    })
                })
                .catch(error => {
                    //display error
                    console.log('Error while creating', error.message)
                })
        },
        updateList(context, payload) {
            let _data = {
                description: payload.description,
                name: payload.name,
                slug: payload.slug
            };
            let endPoint = `${this.state.rootEndPoint}/categories/${payload.listId}`;
            let fetchOptions = {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            };
            fetch(endPoint, fetchOptions)
                .then(response => console.log(response))
        },
        async deleteList(context, idOfListToBeDeleted) {
            //Define common fetch options
            const _data = {force: true};
            const fetchOptions = {
                method: "DELETE",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            }
            //STEP 1: fetch all cards related to this list
            console.log(idOfListToBeDeleted);
            const endPoint = `${this.state.rootEndPoint}/posts?categories=${idOfListToBeDeleted}`
            const cardsPromise = await fetch(endPoint);
            const cardsList = await cardsPromise.json();
            console.log('here are the cards', cardsList)

            //STEP 2: via loop 'for of' delete one by one the cards
            for (const card of cardsList) {
                const deleteCardEndPoint = `${this.state.rootEndPoint}/posts/${card.id}`;
                const response = await fetch(deleteCardEndPoint, fetchOptions);
                // console.log(response)

                // Check if card deletion ok, if not -> return
                if (response.status === 200 && response.ok) {
                    console.log('card deletion OK')
                } else {
                    console.log('card deletion NOK');
                    return;
                }
            }
            //STEP 3 delete the list
            const deleteListEndPoint = `${this.state.rootEndPoint}/categories/${idOfListToBeDeleted}`;
            const deleteListPromise = await fetch(deleteListEndPoint, fetchOptions);
            // console.log('delete list promise', deleteListPromise);

            //STEP 4 remove the deleted list from the state 'allLists' if deleteListPromise OK
            if (deleteListPromise.status === 200 && deleteListPromise.ok) {
                this.state.allLists = this.state.allLists.filter(list => list.id !== idOfListToBeDeleted)
            } else {
                console.log('Error during list deletion')
            }
        },

        //CARD
        async createCard(context, newCardInfo) {
            const endPoint = `${this.state.rootEndPoint}/posts`;
            const _data = {
                title: newCardInfo.cardTitle,
                categories: newCardInfo.listId,
                status: "publish"
            }
            const fetchOptions = {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            }
            try {
                const response = await fetch(endPoint, fetchOptions)
                console.log('response from store create card', response);
                return response;
            } catch (error) {
                console.log(error.message)
            }
        },
        async updateCard(context, payload) {
            // console.log('updating card', payload);
            const _data = {
                title: payload.title,
                content: payload.content,
                status: "publish",
                categories: payload.listId
            }
            const endPoint = `${this.state.rootEndPoint}/posts/${payload.cardId}`;
            const fetchOptions = {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            };
            const response = await fetch(endPoint, fetchOptions);
            console.log(response)
            return response;
        },
        async deleteCard(context, cardId) {
            // console.log('deleting card', cardId)
            const endPoint = `${this.state.rootEndPoint}/posts/${cardId}`;
            const _data = {force: true};
            const fetchOptions = {
                method: "DELETE",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            }
            const response = await fetch(endPoint, fetchOptions);
            return response;
        },

        //COMMENTS
        async createComment(context, payload) {
            // console.log('I am creating a comment');

            const endPoint = `${this.state.rootEndPoint}/comments?parent=${payload.cardId}`;
            const _data = {
                author: 1,
                content: payload.commentContent,
                post: payload.cardId,
                status: "published"
            };
            const fetchOptions = {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            };

            const response = await fetch(endPoint, fetchOptions)
            if (response.status === 201 && response.ok) {
                const data = await response.json();
                return data;
            }

        },
        async deleteComment(context, commentId) {
            // console.log('deleting comment')
            const endPoint = `${this.state.rootEndPoint}/comments/${commentId}`;
            const _data = {force: true};
            const fetchOptions = {
                method: "DELETE",
                body: JSON.stringify(_data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            }
            const response = await fetch(endPoint, fetchOptions);
            return response;
        },

        fakeAction(context, payload) {
            // console.log('Action from store dispatched', payload)
            console.log('Action from store dispatched')
        },
    },
    modules: {}
})
