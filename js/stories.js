"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	//console.debug("generateStoryMarkup", story);
	// add stars 
	let star = `<i id=${story.storyId} `
	star += story.favorite ? 
		`class="favorite-star fas fa-star"></i>` :
		`class="favorite-star far fa-star"></i>`;
	
	const hostName = story.getHostName();
	return $(`
			<li id="${story.storyId}">
				${star}
				<a href="${story.url}" target="a_blank" class="story-link">
					${story.title}
				</a>
				<small class="story-hostname">(${hostName})</small>
				<small class="story-author">by ${story.author}</small>
				<small class="story-user">posted by ${story.username}</small>
			</li>
		`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
		console.debug("putStoriesOnPage");

		$allStoriesList.empty();

		// loop through all of our stories and generate HTML for them
		for (let story of storyList.stories) {
				const $story = generateStoryMarkup(story);
				$allStoriesList.append($story);
		}

		$allStoriesList.show();
}

$storyForm.on('submit', addSubmitStoryToListAndHideStoryForm);

/** addStoryToListAndHidStoryForm
 * Description: callback function for when user submits the story form. The function
 * will retreive the values from the inputs (author, title, url) and will add the story
 * to the story list and DOM and remove form upon submission.
 */

async function addSubmitStoryToListAndHideStoryForm(){
	await addSubmitStoryToList();
	await addSubmitStoryToPage();
	$storyForm.hide();
}

/** addStoryToList
 * function that retreives values from the new story form and adds it to the story list.
 */
async function addSubmitStoryToList(){
	
		// Get story data from form
		let newTitle = $('#create-title').val();
		let newAuthor = $('#create-author').val();
		let newURL = $('#create-url').val();

		// Add story to story list
		await storyList.addStory(
				currentUser, 
				{
						title: newTitle,
						author: newAuthor,
						url: newURL
				}
		);  
}

/** addStoryToPage
 * Adds story to the DOM
 */
async function addSubmitStoryToPage(){
	const $story = generateStoryMarkup(storyList.stories[0]);
	$allStoriesList.prepend($story);
}

