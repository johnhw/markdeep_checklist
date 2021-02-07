# markdeep_checklist
Adds simple, clickable checklists to [Markdeep](https://casual-effects.com/markdeep/) documents. Makes it quick and easy to create action checklists. Checks are persisted in the brower's local storage, 
so refreshing the page won't lose your checks.

<img src="imgs/screenshot_1.png">

## Usage

Add the following to your `.md.html` file, just before including `markdeep`

```html
<link rel="stylesheet" href="markdeep_checklist.css" type="text/css" ></link>
<script src="md_checklist.js"> </script>
<script>
window.markdeepOptions = {tocStyle:'none', onLoad:make_checks};
</script>
```
