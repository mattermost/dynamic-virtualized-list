# react-window

> React components for efficiently rendering dynamically sized lists

[![NPM registry](https://img.shields.io/npm/v/react-window.svg?style=for-the-badge)](https://yarnpkg.com/en/package/react-window) [![Travis](https://img.shields.io/badge/ci-travis-green.svg?style=for-the-badge)](https://travis-ci.org/bvaughn/react-window) [![NPM license](https://img.shields.io/badge/license-mit-red.svg?style=for-the-badge)](LICENSE)

## Install

```bash
npm install github:mattermost/dynamic-virtualized-list --save

TODO: publish to npm
```

## Usage
See usage [here](https://github.com/mattermost/mattermost-webapp/blob/master/components/post_view/post_list_virtualized/post_list_virtualized.jsx) in mattermost for an example 
```javascript
    EX:
    <DynamicSizeList
        height={height}
        width={width}
        itemData={this.state.postListIds}
        overscanCountForward={OVERSCAN_COUNT_FORWARD}
        overscanCountBackward={OVERSCAN_COUNT_BACKWARD}
        onScroll={this.onScroll}
        initScrollToIndex={this.initScrollToIndex}
        canLoadMorePosts={this.props.actions.canLoadMorePosts}
        innerRef={this.postListRef}
        style={{...virtListStyles, ...dynamicListStyle}}
        innerListStyle={postListStyle}
        initRangeToRender={this.initRangeToRender}
        loaderId={PostListRowListIds.OLDER_MESSAGES_LOADER}
        correctScrollToBottom={this.props.atLatestPost}
        onItemsRendered={this.onItemsRendered}
        scrollToFailed={this.scrollToFailed}
    >
        {this.renderRow}
    </DynamicSizeList>
    
```

### Props

  **height**: Height of the scroll container.  
  **width**: Width of the scroll container.  
  **itemData**: Array of item ids that are to be rendered.  
  **overscanCountForward**: No of items to be rendered below the fold of view.  
  **overscanCountBackward**: No of items to be rendered above the fold of view.  
**initScrollToIndex**: Initial index to scroll to.  
**canLoadMorePosts**: Callback called when the items rendered are less than the height of the scroll container. This is to load more posts and fill the screen.  
**innerRef**: ref of the list container which is used for determining width changes for scroll containers. Note: Most likely this can be dropped.  
**innerListStyle**: Styles for dynamic list container.  
**initRangeToRender**: Initial range of items to render.  
**loaderId**: This is shown at the top or bottom when needed when a virtualized list is mounting components.  
**correctScrollToBottom**: boolean prop used for forcing scroll correction to bottom when items height dynamically change.  
**scrollToFailed**: Callback called when scroll to fails because the items are not rendered in the view before.  

**onItemsRendered**: Callback called when there is a change in items rendered.  
    - The callback has the following args passed as an object.  
    * **overscanStartIndex**: Index of the first item rendered.  
    * **overscanStopIndex**: Index of the last item rendered.  
    * **visibleStartIndex**: Index of the first visible item in view.  
    * **visibleStopIndex**: Index of the last visible item in view.  

**onScroll**: Callback called when there are updates in scroll state in the virtualized list.  
    - The callback has the following args passed as an object.  
    * **scrollDirection** : forward or backward.  
    * **scrollOffset**: Scroll offset from the top.  
    * **scrollUpdateWasRequested**: Scroll update was manually requested.  
    * **clientHeight**: Height of the dynamic list container.  
    * **scrollHeight**: Height of dynamic list.  

#### How is `dynamic-virtualized-list` different from `react-window`?
`react-window` has different API's for fixed lists and grids. Though this was built from a fork of `react-window` alpha version for dynamic lists this takes a completely different approach in building dynamic lists. 

This library is a stripped version of `react-window` even for the base code to eliminate unneeded API's that mattermost does not use at the moment. The changes needed for enabling some of the features made significant changes to base code so it wasn't possible to keep updated with upstream anymore. 

The main difference from alpha dynamic list in `react-window` to this fork is the adoption of `relative` elements instead of `absolutely` positioned elements for dynamic lists. Some of the key changes are listed at https://github.com/mattermost/react-window/pull/9

This also has code needed for scroll correction needed for dynamic lists which can change over time and support adding elements in both directions.
