# Mobile Hamburger Menu Scroll Investigation - 2025-07-01

## Issue Description
When the hamburger menu is open on mobile and a user taps a nav link with dropdown functionality, they cannot scroll to view all dropdown items. The top nav bar (TG logo + close X) should remain fixed while allowing scroll through the dropdown content.

## Current Problem
- Hamburger menu opens successfully
- Nav links with dropdowns expand
- Scrolling is disabled/blocked when dropdown is open
- User cannot access all dropdown items on smaller screens

## Investigation Goals
1. Identify current scroll prevention mechanism
2. Locate hamburger menu and dropdown components
3. Understand CSS/JavaScript that controls scroll behavior
4. Design solution that:
   - Allows scrolling within dropdown content
   - Keeps top nav bar (TG logo + X button) fixed
   - Maintains menu functionality

## Components to Investigate
- `/2` navigation system (BrowserTabs/Navigation components)
- Mobile hamburger menu implementation
- Dropdown menu CSS and JavaScript
- Scroll lock/unlock mechanisms

## Next Steps
1. Find mobile navigation components in `/2` redesign
2. Examine current CSS for overflow/position properties
3. Test current behavior on mobile viewport
4. Identify scroll prevention code
5. Design scroll solution maintaining fixed header

## Technical Requirements
- Fixed header: TG logo + close X button
- Scrollable content: Dropdown menu items
- Preserve existing functionality
- Mobile-first responsive design
- Touch-friendly interactions

## Files to Examine
- `src/app/2/components/Navigation/`
- `src/app/2/components/BrowserTabs/`
- Mobile-specific CSS modules
- Layout and navigation state management

## Success Criteria
- Hamburger menu opens normally
- Dropdown expands without scroll issues
- User can scroll through all dropdown items
- Top nav bar remains fixed during scroll
- All existing functionality preserved