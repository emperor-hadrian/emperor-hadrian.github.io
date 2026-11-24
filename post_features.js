function setup_page(page_matadata_raw) {
    // Tag list
    let tag_list = document.createElement("div");
	tag_list.className = "tag-container";
    let page_matadata = JSON.parse(page_matadata_raw)[get_page_name()];
    for(let i = 0; i < page_matadata.tags.length; i++) {
        let tag_name = page_matadata.tags[i];
        let new_tag_elem = create_tag_element(tag_name);
        tag_list.appendChild(new_tag_elem);
    }
    document.getElementById("post-features-container").appendChild(tag_list);
    // Info span
    document.getElementById("post-features-container").appendChild(create_info_span_tag(page_matadata));
    // Photos insert
    insert_photos_with_captions()
}

function get_page_name() {
    return document.getElementById("post-id").innerHTML;
}

window.onload = function () {httpGetAsync("/posts_metadata.json", setup_page)};