function httpGetAsync(url, callback)// copied from stackoverflow.com/questions/247483
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
        	if (xmlHttp.status == 200){
        		callback(xmlHttp.responseText);
        	}
        	window.waitingForServer = false;
        }
    }
    window.waitingForServer = true;
    xmlHttp.open("GET", url, true);// true for asynchronous
    xmlHttp.send(null);
}

function post_url_from_id(post_id) {
    return "/posts/" + post_id;
}

// returns: {tag-name: number of occurances}
function compile_all_tags(posts_metadata) {
    let out = {};
    for(let post_id in posts_metadata) {
        // Skip post if hidden
        if(posts_metadata[post_id].hasOwnProperty("hidden")) {
            if(posts_metadata[post_id]["hidden"]) {
                continue;
            }
        }
        let tags = posts_metadata[post_id]["tags"];
        for(let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if(out.hasOwnProperty(tag)) {
                out[tag] += 1;
            }
            else {
                out[tag] = 1;
            }
        }
    }
    return out;
}

function create_tag_element(tag, is_clickable=false) {
    let new_tag_elem = document.createElement("span");
    new_tag_elem.innerHTML = tag.toUpperCase();
    new_tag_elem.className = "tag";
    if(is_clickable) {
        new_tag_elem.style.cursor = "pointer";
    }
    return new_tag_elem;
}

// Data and Links for a Post
function create_info_span_tag(post_metadata) {
    let info_span = document.createElement("div");
	let sub_span = document.createElement("span");
	sub_span.innerHTML = "Started " + post_metadata["started"];
	info_span.appendChild(sub_span);
	// Optional links within info span
	if(post_metadata.hasOwnProperty("ext_links")) {
		let links = post_metadata["ext_links"];
		if(links.length > 0) {
			for(let i = 0; i < links.length; i++) {
				let ext_link = document.createElement("a");
				ext_link.style.marginLeft = "1em";
				ext_link.innerHTML = strip_protocol_from_link(links[i]);
				ext_link.setAttribute("href", links[i]);
				ext_link.setAttribute("target", "_blank");// https://stackoverflow.com/questions/17711146/how-to-open-link-in-a-new-tab-in-html
				info_span.appendChild(ext_link);
			}
		}
	}
    return info_span;
}

function strip_protocol_from_link(link_og) {
    let removables = ["https://", "http://"];
    for(let i = 0; i < removables.length; i++) {
        if(link_og.startsWith(removables[i])) {
            return link_og.slice(removables[i].length);
        }
    }
    return link_og
}