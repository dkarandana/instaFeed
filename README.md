# instagram Feed

With instaFeed.js you can develop individual instagram datablocks without starting from scratch.

![instaFeed Screenshot](docs/assets/readme/instagram-data-blocks.PNG)

## Getting Started

The `instaFeed` library can be download to your local repository with bower command

```shell
bower install instaFeed
```

## HTML code snippet

After intallation the instaFeed will look for an element with instafeed html class.

```html
<section class="instafeed full-width show-for-large-up row collapse"
		data-instafeed-profile="__profile__"
		data-instafeed-token="__token__"
		data-instafeed-endpoint="/users/self/media/recent"
		data-instafeed-parentclass="insta"
		data-instafeed-template="<div class='{{parentCls}} picture_{{num}}' style=background-image:url({{lowResolutionURL}})></div>"
		data-instafeed-maxPhotos="12"
		data-instafeed-wrap="2"
		data-instafeed-wrappertemplate="<div class='wrap wrap_{{wrapcount}}'></div>"
		data-instafeed-log="false">
		<h3>insta Feed</h3>
</section>
```

## Learn More

Check the `docs` directory in this repo for more advanced setup guides and other info.
