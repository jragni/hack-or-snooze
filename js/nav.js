"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$navbarLinks.on('click','#nav-submit',navSubmitClick);

/** navSubmitClick 
 *  function that is called when users click on the navbar's submit. The function displays prepends the new story form onto the story list.
 *  
 * @param {evt} evt --- event that occurs on click
 */

function navSubmitClick(evt) {
  putStoriesOnPage();
  // unhide story form, if already on story form, keep it displayed
  let isStoryFormHidden = $('#story-form').is(':hidden');
  updateFavoritesList();
  if (isStoryFormHidden){  
    $storyForm.toggle(".hidden");
  }
}

/** SECTION to Handle Favorites */
$navFavorites.on('click',displayFavoritesPage);


/// Favorites Controller function callback

function displayFavoritesPage() {
	$allStoriesList.empty();
	console.debug('navFavorites')
  updateFavoritesList();
  $('#story-form').hide();
	if(currentUser.favorites.length === 0){
		displayNoFavorites();
	}else{
		displayFavorites();
	}
}

function displayFavorites() {
	currentUser.favorites.forEach(story => {
		const $story = generateStoryMarkup(story);
		$allStoriesList.prepend($story);
    updateFavoritesList();
	})
}

function displayNoFavorites() {
	$allStoriesList.prepend("<h1> No favorites added!</h1")
}

