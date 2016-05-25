---
title: "Editing Content on a Page"
---

Now that you are logged in and are acclimated with the Apostrophe interface, let’s take a first pass at creating content. To get started let’s visit [link to a default page on sandbox].

##Step One: Add Content
[insert picture of add content button]
On this page, find one of the red “add content” buttons. This button represents a single content area on your page. Click the button and you’ll notice a gray drop-down menu which provides you with all the content options for this particular content area. Let’s start by clicking the “text” option.

##Step Two: Editing Text
[insert picture of blank text area]
You should see a blank text area appear on the page.  To add text to the area, click the red “pencil” button which will activate the cursor and toolbar giving you basic text editing controls. From here you can just start typing, so go ahead and write a couple sentences.

[insert picture of open toolbar]
After you have some text to work with, we can experiment with the styles and formatting options that are in the red toolbar. You may want to try some of the predefined text styles from the drop-down menu or some of the more standard formatting options like bold, italic, and creating links. Visit [link to text toolbar FAQ] for more information on the toolbar functionality.

##Step Three: Adding Images
Now let’s experiment with different content types. Click the “add content” button and select “image(s)” from the drop-down. The “Edit Image(s)” modal will allow you to upload new images for your “Images(s)” widget and/or choose an already existing photo from the media library (more on that later).

Let’s try uploading a photo from your computer. (If you don’t have an image handy you can find one from [link to creative commons].) You can either drag and  drop an image into the modal or click the “plus” icon to upload one from your computer. Once you’ve uploaded an image, a second set of fields will appear allowing you to add a title, description, credit, and tags to the image. Everything that you type into these fields will get saved to the media library, making it easier for you to manage your images later on.

Now that you’ve added your image and saved it to the media library, you can crop the image, change the settings for your slideshow, and continue adding more images. For more detailed information on cropping images and on slideshow settings see FAQ about editing images [link to FAQ about editing images].

##Step Four: Editing Standalone Text and Widgets
The pages on your website may have template-specific, standalone rich text or widgets. Typically, these items represent design decisions that have been made about a specific part of the page layout. Because they are standalone, they are not connected to a specific “Add Content” button.

[insert image of “pencil icon” ]
Let’s test out a standalone text area. Below the section we’ve been working on, you will notice a standalone “pencil” icon similar to the one we saw in the previous steps. Click the icon to activate the cursor in that area just as we did in step two.

> Developer Tip: To create a standalone text area, you can set the ‘textOnly’ option of your ‘aposArea’ call to ‘true’. Also, make sure your controls array only contains items which would appear in the text formatting toolbar.

[insert image of “edit marquee” ]
Just like standalone text areas you can edit other types of standalone widgets; for example, find the “edit marquee” button at the top of the page. Click the button to activate an “edit slideshow” modal specific to that area of the page layout.

##Step Five: Adding and Editing Sections
[insert image of “add section”]
Let’s navigate to page [add link to page in sandbox with blocks] in sandbox to experiment with sections. On this page, you will see an “add section” button. Clicking this brings up the familiar gray dropdown menu with new kinds of options. These options provide you with layout sections which can contain various arrangements of content areas as well as standalone rich text and widgets. The available options depend on the decisions made by your developer and designer.

Choose the “two-column” option in the dropdown and a fresh layout section will appear on the page with two editable content areas. Just like in Step 1, you can add pieces of content to both of these areas. Note that new sections appear at the end. Feel free to add other kinds of sections to the page and experiment with other content arrangements.

>Pro Tip: Not all projects incorporate this feature, but for some it provides just enough layout flexibility.


##Step 6: Move Dat Content (Moving Content)
[insert image of “drag” etc. ]
Now that you are an expert at adding content to a page, let’s explore how we can move that content within the page. We can use the “two-column” section that we just created to test this functionality. Hover over the content area on the left in that section to reveal the “drag”, “up”, and “down” icons.

[insert image content being dragged to ‘target area’]
Click and hold the “drag icon” to activate the dragging functionality for a piece of content. You can drag that content above or below other content in the same area. You can also drag it to another area on the page, as long as that type of content is allowed in the target area (check the “add content” drop-down to see which types of content are allowed). Experiment with dragging the content from the left column to the right column in the section.

You can also use the “up” and “down” buttons to bump content up and down in a single area.

Pro Tip: You can hold the “shift” key to active the “double up” and “double down” arrow icons which allow you to bump content directly to the top or bottom of the area.

[insert image section “drag” etc.]
In addition to moving content within sections, you can move entire layout sections on a page using the “drag”, “up”, and “down” buttons in the upper left-hand corner of that section.

## Step 7: Removing Content
[insert image of “trash” icon ]
You can find the “trash” icon in the upper right hand corner of content items and sections. Clicking this icon will remove the entire section or item from the page.

> Pro Tip: You can restore deleted content by using the “Page Versions” tool in the “Page Menu”. Simply click on a previous edit to the page to revert the page to that point in editing history.
