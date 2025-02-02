# Poll Widget
Demo to show poll widget that can be configured onto static HTML page with mandatory `data-poll` attribute of certain structure documented below
Access [Poll Widget](https://pollwidgetcustom.netlify.app/) 

## Documentation
poll widget block must contain following attributes
- class - `poll-widget`
- data attribute - `data-poll` must contain 3 properties
  - `pollId`: String - must be unique
  - `question`: String
  - `option`: Array - must contain atleast 2 values
- data attribute `data-allow-retry` (Optional) to allow user with multiple votes

## Features
- Add poll widget easily following documentation
- Polls are rendered on UI on page load
- Poll lists questions and their options
- After selecting an option Results are shown
- All results are stored in localStorage corresponding to unique `pollId`
- Ability to add new poll on click of `Add New Poll` button opens up a form.
- Poll throws error if
  - same `pollId` is being used to prevent same poll be used multiple times
  - Attribute `data-poll` does not follow mandatory structure
 
## Tech
- HTML/CSS
- JavaScript
- React

## What could be improved
- Different types of results UI like bar, pie
- Add attribute `data-binary` to show binary poll with only 2 options
- Ability to select different types of Results UI while adding new poll
- Form validation for new polls form
- Override default `poll-widget` styles with custom styles and animation
