"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";


/******************************************************************************
 * Story: a single story in the system
 */

class Story {

	/** Make instance of Story from data object about story:
	 *   - {title, author, url, username, storyId, createdAt}
	 */

	constructor({ storyId, title, author, url, username, createdAt }) {
		this.storyId = storyId;
		this.title = title;
		this.author = author;
		this.url = url;
		this.username = username;
		this.createdAt = createdAt;
		this.favorite = false;
	}

	/** Parses hostname out of URL and returns it. */

	getHostName() {
		// UNIMPLEMENTED: complete this function!
		return `${this.url}`;
	}
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
	constructor(stories) {
		this.stories = stories;
	}

	/** Generate a new StoryList. It:
	 *
	 *  - calls the API
	 *  - builds an array of Story instances
	 *  - makes a single StoryList instance out of that
	 *  - returns the StoryList instance.
	 */

	static async getStories() {
		// Note presence of `static` keyword: this indicates that getStories is
		//  **not** an instance method. Rather, it is a method that is called on the
		//  class directly. Why doesn't it make sense for getStories to be an
		//  instance method?

		// query the /stories endpoint (no auth required)
		const response = await axios({
			url: `${BASE_URL}/stories`,
			method: "GET",
		});

		// turn plain old story objects from API into instances of Story class
		const stories = response.data.stories.map(story => new Story(story));

		// build an instance of our own class using the new array of stories
		return new StoryList(stories);
	}

	/** addStory  
	 * Method that adds story data to API, makes a Story instance, adds it to story list.
	 * - @param user - the current instance of User who will post the story
	 * - @param newStory obj of {title, author, url}
	 *
	 * @returns {Story} Returns the new Story instance
	 */

	async addStory(user, newStory) {
		
		const storiesURL = BASE_URL+'/stories'
		
	// make a POST request to API 
		//const token = user.token
	//NOTE: used for testing  PURPOSE
	const token = user.loginToken;
		const response = await axios({
		url:storiesURL, 
		method: "POST",
		data:{token, story:newStory}
	});

		// make a Story instance
	const storyDataPosted = response.data.story;
	let story = new Story(storyDataPosted);

	// add it to the top of story list
	this.stories.unshift(story);
	// return story instance
	return story;
	}
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
	/** Make user instance from obj of user data and a token:
	 *   - @param {object} user {username, name, createdAt, favorites[], ownStories[]}
	 *   - @param {string} token 
	 */

	constructor({
								username,
								name,
								createdAt,
								favorites = [],
								ownStories = []
							},
							token) {
		this.username = username;
		this.name = name;
		this.createdAt = createdAt;

		// instantiate Story instances for the user's favorites and ownStories
		this.favorites = favorites.map(s => new Story(s));
		this.ownStories = ownStories.map(s => new Story(s));

		// store the login token on the user so it's easy to find for API calls.
		this.loginToken = token;
	}

	/** Register new user in API, make User instance & return it.
	 *
	 * - username: a new username
	 * - password: a new password
	 * - name: the user's full name
	 */

	static async signup(username, password, name) {
		const response = await axios({
			url: `${BASE_URL}/signup`,
			method: "POST",
			data: { user: { username, password, name } },
		});

		return new User(
			{
				username: user.username,
				name: user.name,
				createdAt: user.createdAt,
				favorites: user.favorites,
				ownStories: user.stories
			},
			response.data.token
		);
	}

	/** Login in user with API, make User instance & return it.

	 * - username: an existing user's username
	 * - password: an existing user's password
	 */

	static async login(username, password) {
		const response = await axios({
			url: `${BASE_URL}/login`,
			method: "POST",
			data: { user: { username, password } },
		});

		let { user } = response.data;

		return new User(
			{
				username: user.username,
				name: user.name,
				createdAt: user.createdAt,
				favorites: user.favorites,
				ownStories: user.stories
			},
			response.data.token
		);
	}

	/** When we already have credentials (token & username) for a user,
	 *   we can log them in automatically. This function does that.
	 */

	static async loginViaStoredCredentials(token, username) {
		try {
			const response = await axios({
				url: `${BASE_URL}/users/${username}`,
				method: "GET",
				params: { token },
			});

			let { user } = response.data;

			return new User(
				{
					username: user.username,
					name: user.name,
					createdAt: user.createdAt,
					favorites: user.favorites,
					ownStories: user.stories
				},
				token
			);
		} catch (err) {
			console.error("loginViaStoredCredentials failed", err);
			return null;
		}
	}

	/** setFavorite
	 * Description: setFavorite is a function that takes in the Story Instance
	 * and sends an API request to add story to the current user's favorite list
	 * @param {Story} 
	 */

	async setFavorite(story){
		// iniitialize axios params
		const username = currentUser.username;
		const storyId = story.storyId;
		const token = currentUser.loginToken;
		let queryString =  `/users/${username}/favorites/${storyId}`
		let url = BASE_URL + queryString;
		// send query 
		let response = await axios({
			url,
			method:"POST",
			params:{token}
		});
		console.debug('setFavorite:',response.data.message);
		updateUserFavoritesUI(story);
		currentUser = new User(response.data.user, currentUser.loginToken);

	}
	/** deleteFavorite
	 * Description: deleteFavorite is a function that takes in the Story Instance
	 * and sends an API request to remove story to the current user's favorite list
	 * @param {Story} 
	 */

	async deleteFavorite(story){
		// iniitialize axios params
		const username = currentUser.username;
		const storyId = story.storyId;
		const token = currentUser.loginToken;
		let queryString =  `/users/${username}/favorites/${storyId}`
		let url = BASE_URL + queryString;
		// send query 
		let response = await axios({
			url,
			method:"DELETE",
			params:{token}
		});
		console.debug('deleteFavorite:',response.data.message);
		updateUserFavoritesUI(story);
		// update current user 
		currentUser = new User(response.data.user, currentUser.loginToken);
		
	}
}




