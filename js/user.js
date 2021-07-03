"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
	console.debug("login", evt);
	evt.preventDefault();

	// grab the username and password
	const username = $("#login-username").val();
	const password = $("#login-password").val();

	// User.login retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.login(username, password);

	$loginForm.trigger("reset");

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
	console.debug("signup", evt);
	evt.preventDefault();

	const name = $("#signup-name").val();
	const username = $("#signup-username").val();
	const password = $("#signup-password").val();

	// User.signup retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.signup(username, password, name);

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();

	$signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
	console.debug("logout", evt);
	localStorage.clear();
	location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
	console.debug("checkForRememberedUser");
	const token = localStorage.getItem("token");
	const username = localStorage.getItem("username");
	if (!token || !username) return false;

	// try to log in with these credentials (will be null if login failed)
	currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
	console.debug("saveUserCredentialsInLocalStorage");
	if (currentUser) {
		localStorage.setItem("token", currentUser.loginToken);
		localStorage.setItem("username", currentUser.username);
	}
}


// Handling Favorites on Login 

// function that checks if storyList story is on user's favorites by using the story ID,
// story on the story List will update to true. 

function updateFavoritesList() {
	// check every story on the story list to find every favorite 
	storyList.stories.forEach(story => {
		currentUser.favorites.forEach(faveStory => {
			if(faveStory.storyId === story.storyId){
				story.favorite = true;
			}
		});
	});
}

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
	console.debug("updateUIOnUserLogin");

	$allStoriesList.show();
	// hide forms
	$loginForm.hide();
	$signupForm.hide();
	updateNavOnLogin();
	updateFavoritesList();
	updateFavoritesListUI();
}

// TO DO: work on fixing the star issue

$($allStoriesList).on('click','.favorite-star',  async function(evt) {
	const id = $(evt.target).attr('id');
	// search for story containign story ID in story list
	let storyObj = storyList.stories.find( story => story.storyId === id);
	// if the current story is not favorite, then favorite else de-favorite
	if(!storyObj) return;
	if(storyObj.favorite === false){
		await currentUser.setFavorite(storyObj);
		updateFavorites();
		
	}else{
		await currentUser.deleteFavorite(storyObj);
		// update storyList 
		storyObj.favorite = false;
		updateFavorites();

	}

})

// Updates the star UI
function updateFavoritesListUI(){
	storyList.stories.forEach( story => {
		story.favorite ? 
			$(`#${story.storyId} i`).attr("class", "fas fa-star favorite-star") :
			$(`#${story.storyId} i`).attr("class", "far fa-star favorite-star")
	})
}

function updateFavorites(){
	updateFavoritesList();
	updateFavoritesListUI();
}

// TO DO 

//// ISSA SPAGHETTI code  --- void 
// // Upon start upon start up, sets favorite stars to solid 
// function updateUserFavoritesUI(story) {
// 	//console.debug('updateFavoritesUI');
// 	// check each storie list
// 	// $(`#${story.storyId} i`).attr("class","fas fa-star");
// 	if (story.favorite === false){
// 		$(`#${story.storyId} i`).attr("class", "far fa-star favorite-star")
// 	}else{
// 		$(`#${story.storyId} i`).attr("class", "fas fa-star favorite-star")
// 	}
// }




// $($allStoriesList).on('click','.favorite-star',  async function(evt) {
// 	const id = $(evt.target).attr('id');
// 	// search for story containign story ID in story list
// 	let storyObj = storyList.stories.find( story => story.storyId === id);
// 	debugger;
// 	storyObj.favorite === false ? currentUser.setFavorite(storyObj) :
// 	currentUser.deleteFavorite(storyObj);
// 	updateFavoritesList();
// })