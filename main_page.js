function create_post_thumbnail(post_id) {
	let post_metadata = posts_metadata_global[post_id];
	let outer_div = document.createElement("div");
	let inner_div = document.createElement("div");
	// Title link
	let title_link = document.createElement("a");
	title_link.innerHTML = post_metadata["name"];
	title_link.setAttribute("href", post_url_from_id(post_id));
	title_link.setAttribute("style", "font-size: 2em;");
	inner_div.appendChild(title_link);
	// Description paragraph
	if(post_metadata.hasOwnProperty("desc")) {
		let desc_p = document.createElement("p");
		desc_p.innerHTML = post_metadata["desc"];
		inner_div.appendChild(desc_p);
	}
	// Tag list
	let tag_list = document.createElement("div");
	tag_list.className = "tag-container";
	for(let i = 0; i < post_metadata["tags"].length; i++) {
		tag_list.appendChild(create_tag_element(post_metadata["tags"][i]));
	}
	inner_div.appendChild(tag_list);
	// Info span
	inner_div.appendChild(create_info_span_tag(post_metadata));
	// Done with inner div, add ito outer div
	outer_div.appendChild(inner_div);
	// Add image
	if(post_metadata.hasOwnProperty("image")) {
		let img = document.createElement("img");
		img.setAttribute("src", post_metadata["image"]);
		outer_div.appendChild(img);
	}
	// Done
	outer_div.className = "post-thumbnail";
	outer_div.id = "post-thumbnail-" + post_id;
	return outer_div;
}

// Called on page load, when filter changes
function list_posts() {
	//return;// Comment when template html is done
	// Get list of filter tags
	let post_array = [];// [[Post ID, date], ...]
	for(let post_id in posts_metadata_global) {
		let post = posts_metadata_global[post_id];
		// Check if it matches all the filter tags
		let rejected = false;
		if(!current_filter_tags_global.isSubsetOf(new Set(post["tags"]))) {
			continue;
		}
		// Check if hidden
		if(post["hidden"]) {
			continue;
		}
		post_array.push([post_id, post["started"]]);
	}
	post_array.sort(function(a, b){return b[1].localeCompare(a[1]);});
	// Add them to DOM
	let post_box = document.getElementById("posts-box");
	post_box.replaceChildren();
	for(let i = 0; i < 30 & i < post_array.length; i++) {
		// Create tag element
		let post_elem = create_post_thumbnail(post_array[i][0]);
		post_box.appendChild(post_elem);
	}
}

// Should be called on page load and whenever the tag search bar is edited
function list_top_tags() {
	let tag_search = document.getElementById("tag-search").value;
	// get array of tags and occurances, maybe filter them by search query
	let tags_array = [];// [[tag-name, N occurances], ...]
	for(let tag in tags_global) {
		if(tag_search.length > 0) {
			if(!tag.includes(tag_search)) {
				continue;
			}
		}
		tags_array.push([tag, tags_global[tag]]);
	}
	// Sort them
	tags_array.sort(function(a, b){return b[1] - a[1];});
	// Add up to N of them to tag box
	let tag_box = document.getElementById("tag-box");
	tag_box.replaceChildren();// Make sure old stuff is deleted when refresh
	for(let i = 0; i < tags_array.length; i++) {
		// Create tag element
		let tag_elem = create_tag_element("+ " + tags_array[i][0] + " " + tags_array[i][1], true);
		tag_elem.addEventListener("click", function(){add_tag_to_filter(tags_array[i][0])})
		tag_elem.id = "tag-box-entry-" + tags_array[i][0];
		tag_box.appendChild(tag_elem);
	}
}

// Called by event listener
function add_tag_to_filter(tag_name) {
	current_filter_tags_global.add(tag_name);
	let filter_tags = document.getElementById("applied-filter-tags");
	// Make sure its not already there
	if(filter_tags.querySelector("#applied-filter-tag-" + tag_name) == null) {
		let tag_elem = create_tag_element("- " + tag_name + " " + tags_global[tag_name], true);
		tag_elem.addEventListener("click", function(){remove_tag_from_filter(tag_name)})
		tag_elem.id = "applied-filter-tag-" + tag_name;
		filter_tags.appendChild(tag_elem);
	}
	list_posts();
}

// Called by event listener
function remove_tag_from_filter(tag_name) {
	current_filter_tags_global.delete(tag_name);
	document.querySelector("#applied-filter-tags #applied-filter-tag-" + tag_name).remove();
	list_posts();
}

const DEFAULT_TAGS = ["featured"];
var posts_metadata_global = {};
var tags_global = {}// tags should be: {tag-name: N occurances}
var current_filter_tags_global = new Set([]);

function setup_page_and_global_variables(posts_matadata_raw) {
	posts_metadata_global = JSON.parse(posts_matadata_raw);
	tags_global = compile_all_tags(posts_metadata_global);
	document.getElementById("tag-search").addEventListener("input", list_top_tags);
	for(let i = 0; i < DEFAULT_TAGS.length; i++) {
		add_tag_to_filter(DEFAULT_TAGS[i]);
	}
	list_top_tags();
	list_posts();
}

window.onload = function () {httpGetAsync("/posts_metadata.json", setup_page_and_global_variables)};