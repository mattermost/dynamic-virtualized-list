'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var memoizeOne = _interopDefault(require('memoize-one'));

function isBrowserSafari() {
  var userAgent = window.navigator.userAgent;
  return userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1;
}

var isSafari = /*#__PURE__*/isBrowserSafari();
var scrollBarWidth = 8;
var scrollableContainerStyles = {
  display: 'inline',
  width: '0px',
  height: '0px',
  zIndex: '-1',
  overflow: 'hidden',
  margin: '0px',
  padding: '0px'
};
var scrollableWrapperStyle = {
  position: 'absolute',
  flex: '0 0 auto',
  overflow: 'hidden',
  visibility: 'hidden',
  zIndex: '-1',
  width: '100%',
  height: '100%',
  left: '0px',
  top: '0px'
};
var expandShrinkContainerStyles = {
  flex: '0 0 auto',
  overflow: 'hidden',
  zIndex: '-1',
  visibility: 'hidden',
  left: "-" + (scrollBarWidth + 1) + "px",
  //8px(scrollbar width) + 1px
  bottom: "-" + scrollBarWidth + "px",
  //8px because of scrollbar width
  right: "-" + scrollBarWidth + "px",
  //8px because of scrollbar width
  top: "-" + (scrollBarWidth + 1) + "px" //8px(scrollbar width) + 1px

};
var expandShrinkStyles = {
  position: 'absolute',
  flex: '0 0 auto',
  visibility: 'hidden',
  overflow: 'scroll',
  zIndex: '-1',
  width: '100%',
  height: '100%'
};
var shrinkChildStyle = {
  position: 'absolute',
  height: '200%',
  width: '200%'
}; //values below need to be changed when scrollbar width changes
//TODO: change these to be dynamic

var shrinkScrollDelta = 2 * scrollBarWidth + 1; // 17 = 2* scrollbar width(8px) + 1px as buffer
// 27 = 2* scrollbar width(8px) + 1px as buffer + 10px(this value is based of off lib(Link below). Probably not needed but doesnt hurt to leave)
//https://github.com/wnr/element-resize-detector/blob/27983e59dce9d8f1296d8f555dc2340840fb0804/src/detection-strategy/scroll.js#L246

var expandScrollDelta = shrinkScrollDelta + 10;

var ItemMeasurer = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ItemMeasurer, _Component);

  function ItemMeasurer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this._node = null;
    _this._resizeSensorExpand = React__default.createRef();
    _this._resizeSensorShrink = React__default.createRef();
    _this._positionScrollbarsRef = null;
    _this._measureItemAnimFrame = null;

    _this.positionScrollBars = function (height, width) {
      if (height === void 0) {
        height = _this.props.size;
      }

      if (width === void 0) {
        width = _this.props.width;
      }

      //we are position these hiiden div scroll bars to the end so they can emit
      //scroll event when height in the div changes
      //Heavily inspired from https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
      //and https://github.com/wnr/element-resize-detector/blob/master/src/detection-strategy/scroll.js
      //For more info http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/#comment-244
      if (_this._positionScrollbarsRef) {
        window.cancelAnimationFrame(_this._positionScrollbarsRef);
      }

      _this._positionScrollbarsRef = window.requestAnimationFrame(function () {
        _this._resizeSensorExpand.current.scrollTop = height + expandScrollDelta;
        _this._resizeSensorShrink.current.scrollTop = 2 * height + shrinkScrollDelta;
      });
    };

    _this.scrollingDiv = function (event) {
      if (event.target.offsetHeight !== _this.props.size) {
        _this._measureItem(event.target.offsetWidth !== _this.props.width);
      }
    };

    _this.renderItems = function () {
      var item = _this.props.item;
      var expandChildStyle = {
        position: 'absolute',
        left: '0',
        top: '0',
        height: _this.props.size + expandScrollDelta + "px",
        width: '100%'
      };
      var renderItem = /*#__PURE__*/React__default.createElement("div", null, item, /*#__PURE__*/React__default.createElement("div", {
        style: scrollableContainerStyles
      }, /*#__PURE__*/React__default.createElement("div", {
        dir: "ltr",
        style: scrollableWrapperStyle
      }, /*#__PURE__*/React__default.createElement("div", {
        style: expandShrinkContainerStyles
      }, /*#__PURE__*/React__default.createElement("div", {
        style: expandShrinkStyles,
        ref: _this._resizeSensorExpand,
        onScroll: _this.scrollingDiv
      }, /*#__PURE__*/React__default.createElement("div", {
        style: expandChildStyle
      })), /*#__PURE__*/React__default.createElement("div", {
        style: expandShrinkStyles,
        ref: _this._resizeSensorShrink,
        onScroll: _this.scrollingDiv
      }, /*#__PURE__*/React__default.createElement("div", {
        style: shrinkChildStyle
      }))))));
      return renderItem;
    };

    _this._measureItem = function (forceScrollCorrection) {
      var _this$props = _this.props,
          handleNewMeasurements = _this$props.handleNewMeasurements,
          oldSize = _this$props.size,
          itemId = _this$props.itemId;
      var node = _this._node;

      if (node && node.ownerDocument && node.ownerDocument.defaultView && node instanceof node.ownerDocument.defaultView.HTMLElement) {
        var newSize = Math.ceil(node.offsetHeight);

        if (oldSize !== newSize) {
          handleNewMeasurements(itemId, newSize, forceScrollCorrection);
        }
      }
    };

    return _this;
  }

  var _proto = ItemMeasurer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this._node = reactDom.findDOMNode(this); // Force sync measure for the initial mount.
    // This is necessary to support the DynamicSizeList layout logic.

    if (isSafari && this.props.size) {
      this._measureItemAnimFrame = window.requestAnimationFrame(function () {
        _this2._measureItem(false);
      });
    } else {
      this._measureItem(false);
    }

    if (this.props.size) {
      // Don't wait for positioning scrollbars when we have size
      // This is needed triggering an event for remounting a post
      this.positionScrollBars();
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.size === 0 && this.props.size !== 0 || prevProps.size !== this.props.size) {
      this.positionScrollBars();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._positionScrollbarsRef) {
      window.cancelAnimationFrame(this._positionScrollbarsRef);
    }

    if (this._measureItemAnimFrame) {
      window.cancelAnimationFrame(this._measureItemAnimFrame);
    }

    var _this$props2 = this.props,
        onUnmount = _this$props2.onUnmount,
        itemId = _this$props2.itemId,
        index = _this$props2.index;

    if (onUnmount) {
      onUnmount(itemId, index);
    }
  };

  _proto.render = function render() {
    return this.renderItems();
  };

  return ItemMeasurer;
}(React.Component);

var defaultItemKey = function defaultItemKey(index, data) {
  return index;
};

var getItemMetadata = function getItemMetadata(props, index, instanceProps) {
  var itemOffsetMap = instanceProps.itemOffsetMap,
      itemSizeMap = instanceProps.itemSizeMap;
  var itemData = props.itemData; // If the specified item has not yet been measured,
  // Just return an estimated size for now.

  if (!itemSizeMap[itemData[index]]) {
    return {
      offset: 0,
      size: 0
    };
  }

  var offset = itemOffsetMap[itemData[index]] || 0;
  var size = itemSizeMap[itemData[index]] || 0;
  return {
    offset: offset,
    size: size
  };
};

var getItemOffset = function getItemOffset(props, index, instanceProps) {
  return getItemMetadata(props, index, instanceProps).offset;
};

var getOffsetForIndexAndAlignment = function getOffsetForIndexAndAlignment(props, index, align, scrollOffset, instanceProps) {
  var height = props.height;
  var itemMetadata = getItemMetadata(props, index, instanceProps); // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.

  var estimatedTotalSize = instanceProps.totalMeasuredSize;
  var maxOffset = Math.max(0, itemMetadata.offset + itemMetadata.size - height);
  var minOffset = Math.max(0, itemMetadata.offset);

  switch (align) {
    case 'start':
      return minOffset;

    case 'end':
      return maxOffset;

    case 'center':
      return Math.round(minOffset - height / 2 + itemMetadata.size / 2);

    case 'auto':
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return estimatedTotalSize - (scrollOffset + height);
      } else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }

  }
};

var findNearestItem = function findNearestItem(props, instanceProps, high, low, scrollOffset) {
  var index = low;

  while (low <= high) {
    var currentOffset = getItemMetadata(props, low, instanceProps).offset;

    if (scrollOffset - currentOffset <= 0) {
      index = low;
    }

    low++;
  }

  return index;
};

var getStartIndexForOffset = function getStartIndexForOffset(props, offset, instanceProps) {
  var totalMeasuredSize = instanceProps.totalMeasuredSize;
  var itemCount = props.itemCount; // If we've already positioned and measured past this point,
  // Use a binary search to find the closets cell.

  if (offset <= totalMeasuredSize) {
    return findNearestItem(props, instanceProps, itemCount, 0, offset);
  } // Otherwise render a new batch of items starting from where 0.


  return 0;
};

var getStopIndexForStartIndex = function getStopIndexForStartIndex(props, startIndex, scrollOffset, instanceProps) {
  var itemCount = props.itemCount;
  var stopIndex = startIndex;
  var maxOffset = scrollOffset + props.height;
  var itemMetadata = getItemMetadata(props, stopIndex, instanceProps);
  var offset = itemMetadata.offset + (itemMetadata.size || 0);
  var closestOffsetIndex = 0;

  while (stopIndex > 0 && offset <= maxOffset) {
    var _itemMetadata = getItemMetadata(props, stopIndex, instanceProps);

    offset = _itemMetadata.offset + _itemMetadata.size;
    stopIndex--;
  }

  if (stopIndex >= itemCount) {
    return closestOffsetIndex;
  }

  return stopIndex;
};

var getItemSize = function getItemSize(props, index, instanceProps) {
  // Do not hard-code item dimensions.
  // We don't know them initially.
  // Even once we do, changes in item content or list size should reflow.
  return getItemMetadata(props, index, instanceProps).size;
};

var DynamicSizeList = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(DynamicSizeList, _PureComponent);

  // Always use explicit constructor for React components.
  // It produces less code after transpilation. (#26)
  // eslint-disable-next-line no-useless-constructor
  function DynamicSizeList(_props) {
    var _this;

    _this = _PureComponent.call(this, _props) || this;
    _this._instanceProps = {
      itemOffsetMap: {},
      itemSizeMap: {},
      totalMeasuredSize: 0,
      atBottom: true
    };
    _this._itemStyleCache = {};
    _this._outerRef = void 0;
    _this._scrollCorrectionInProgress = false;
    _this._scrollByCorrection = null;
    _this._keepScrollPosition = false;
    _this._keepScrollToBottom = false;
    _this._mountingCorrections = 0;
    _this._correctedInstances = 0;
    _this.state = {
      scrollDirection: 'backward',
      scrollOffset: typeof _this.props.initialScrollOffset === 'number' ? _this.props.initialScrollOffset : 0,
      scrollUpdateWasRequested: false,
      scrollDelta: 0,
      scrollHeight: 0,
      localOlderPostsToRender: []
    };

    _this.scrollBy = function (scrollOffset, scrollBy) {
      return function () {
        var element = _this._outerRef;

        if (typeof element.scrollBy === 'function' && scrollBy) {
          element.scrollBy(0, scrollBy);
        } else if (scrollOffset) {
          element.scrollTop = scrollOffset;
        }

        _this._scrollCorrectionInProgress = false;
      };
    };

    _this._callOnItemsRendered = memoizeOne(function (overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) {
      return _this.props.onItemsRendered({
        overscanStartIndex: overscanStartIndex,
        overscanStopIndex: overscanStopIndex,
        visibleStartIndex: visibleStartIndex,
        visibleStopIndex: visibleStopIndex
      });
    });
    _this._callOnScroll = memoizeOne(function (scrollDirection, scrollOffset, scrollUpdateWasRequested, scrollHeight, clientHeight) {
      return _this.props.onScroll({
        scrollDirection: scrollDirection,
        scrollOffset: scrollOffset,
        scrollUpdateWasRequested: scrollUpdateWasRequested,
        scrollHeight: scrollHeight,
        clientHeight: clientHeight
      });
    });

    _this._commitHook = function () {
      if (!_this.state.scrolledToInitIndex && Object.keys(_this._instanceProps.itemOffsetMap).length) {
        var _this$props$initScrol = _this.props.initScrollToIndex(),
            index = _this$props$initScrol.index,
            position = _this$props$initScrol.position,
            offset = _this$props$initScrol.offset;

        _this.scrollToItem(index, position, offset);

        _this.setState({
          scrolledToInitIndex: true
        });

        if (index === 0) {
          _this._keepScrollToBottom = true;
        } else {
          _this._keepScrollPosition = true;
        }
      }
    };

    _this._dataChange = function () {
      if (_this._instanceProps.totalMeasuredSize < _this.props.height) {
        _this.props.canLoadMorePosts();
      }
    };

    _this._widthChange = function (prevHeight, prevOffset) {
      if (prevOffset + prevHeight >= _this._instanceProps.totalMeasuredSize - 10) {
        _this.scrollToItem(0, 'end');

        return;
      }
    };

    _this._getItemStyle = function (index) {
      var itemData = _this.props.itemData;
      var itemStyleCache = _this._itemStyleCache;
      var style;

      if (itemStyleCache.hasOwnProperty(itemData[index])) {
        style = itemStyleCache[itemData[index]];
      } else {
        itemStyleCache[itemData[index]] = style = {
          left: 0,
          top: getItemOffset(_this.props, index, _this._instanceProps),
          height: getItemSize(_this.props, index, _this._instanceProps),
          width: '100%'
        };
      }

      return style;
    };

    _this._correctScroll = function () {
      var scrollOffset = _this.state.scrollOffset;
      var element = _this._outerRef;

      if (element) {
        element.scrollTop = scrollOffset;
        _this._scrollCorrectionInProgress = false;
        _this._correctedInstances = 0;
        _this._mountingCorrections = 0;
      }
    };

    _this._generateOffsetMeasurements = function () {
      var _this$_instanceProps = _this._instanceProps,
          itemOffsetMap = _this$_instanceProps.itemOffsetMap,
          itemSizeMap = _this$_instanceProps.itemSizeMap;
      var _this$props = _this.props,
          itemData = _this$props.itemData,
          itemCount = _this$props.itemCount;
      _this._instanceProps.totalMeasuredSize = 0;

      for (var i = itemCount - 1; i >= 0; i--) {
        var prevOffset = itemOffsetMap[itemData[i + 1]] || 0; // In some browsers (e.g. Firefox) fast scrolling may skip rows.
        // In this case, our assumptions about last measured indices may be incorrect.
        // Handle this edge case to prevent NaN values from breaking styles.
        // Slow scrolling back over these skipped rows will adjust their sizes.

        var prevSize = itemSizeMap[itemData[i + 1]] || 0;
        itemOffsetMap[itemData[i]] = prevOffset + prevSize;
        _this._instanceProps.totalMeasuredSize += itemSizeMap[itemData[i]] || 0; // Reset cached style to clear stale position.

        delete _this._itemStyleCache[itemData[i]];
      }
    };

    _this._handleNewMeasurements = function (key, newSize, forceScrollCorrection) {
      var itemSizeMap = _this._instanceProps.itemSizeMap;
      var itemData = _this.props.itemData;
      var index = itemData.findIndex(function (item) {
        return item === key;
      }); // In some browsers (e.g. Firefox) fast scrolling may skip rows.
      // In this case, our assumptions about last measured indices may be incorrect.
      // Handle this edge case to prevent NaN values from breaking styles.
      // Slow scrolling back over these skipped rows will adjust their sizes.

      var oldSize = itemSizeMap[key] || 0;

      if (oldSize === newSize) {
        return;
      }

      itemSizeMap[key] = newSize;

      if (!_this.state.scrolledToInitIndex) {
        _this._generateOffsetMeasurements();

        return;
      }

      var element = _this._outerRef;
      var wasAtBottom = _this.props.height + element.scrollTop >= _this._instanceProps.totalMeasuredSize - 10;

      if ((wasAtBottom || _this._keepScrollToBottom) && _this.props.correctScrollToBottom) {
        _this._generateOffsetMeasurements();

        _this.scrollToItem(0, 'end');

        _this.forceUpdate();

        return;
      }

      if (forceScrollCorrection || _this._keepScrollPosition) {
        var delta = newSize - oldSize;

        var _this$_getRangeToRend = _this._getRangeToRender(_this.state.scrollOffset),
            _visibleStartIndex = _this$_getRangeToRend[2];

        _this._generateOffsetMeasurements();

        if (index < _visibleStartIndex + 1) {
          return;
        }

        _this._scrollCorrectionInProgress = true;

        _this.setState(function (prevState) {
          var deltaValue;

          if (_this._mountingCorrections === 0) {
            deltaValue = delta;
          } else {
            deltaValue = prevState.scrollDelta + delta;
          }

          _this._mountingCorrections++;
          var newOffset = prevState.scrollOffset + delta;
          return {
            scrollOffset: newOffset,
            scrollDelta: deltaValue
          };
        }, function () {
          // $FlowFixMe Property scrollBy is missing in HTMLDivElement
          _this._correctedInstances++;

          if (_this._mountingCorrections === _this._correctedInstances) {
            _this._correctScroll();
          }
        });

        return;
      }

      _this._generateOffsetMeasurements();
    };

    _this._onItemRowUnmount = function (itemId, index) {
      var _assertThisInitialize = _assertThisInitialized(_this),
          props = _assertThisInitialize.props;

      if (props.itemData[index] === itemId) {
        return;
      }

      var doesItemExist = props.itemData.includes(itemId);

      if (!doesItemExist) {
        delete _this._instanceProps.itemSizeMap[itemId];
        delete _this._instanceProps.itemOffsetMap[itemId];
        var element = _this._outerRef;
        var atBottom = element.offsetHeight + element.scrollTop >= _this._instanceProps.totalMeasuredSize - 10;

        _this._generateOffsetMeasurements();

        if (atBottom) {
          _this.scrollToItem(0, 'end');
        }

        _this.forceUpdate();
      }
    };

    _this._renderItems = function () {
      var _this$props2 = _this.props,
          children = _this$props2.children,
          direction = _this$props2.direction,
          itemCount = _this$props2.itemCount,
          itemData = _this$props2.itemData,
          _this$props2$itemKey = _this$props2.itemKey,
          itemKey = _this$props2$itemKey === void 0 ? defaultItemKey : _this$props2$itemKey,
          skipResizeClass = _this$props2.skipResizeClass,
          loaderId = _this$props2.loaderId;
      var width = _this.innerRefWidth;

      var _this$_getRangeToRend2 = _this._getRangeToRender(),
          startIndex = _this$_getRangeToRend2[0],
          stopIndex = _this$_getRangeToRend2[1];

      var items = [];

      if (itemCount > 0) {
        for (var index = itemCount - 1; index >= 0; index--) {
          var _getItemMetadata = getItemMetadata(_this.props, index, _this._instanceProps),
              size = _getItemMetadata.size;

          var _this$state$localOlde = _this.state.localOlderPostsToRender,
              localOlderPostsToRenderStartIndex = _this$state$localOlde[0],
              localOlderPostsToRenderStopIndex = _this$state$localOlde[1];
          var isItemInLocalPosts = index >= localOlderPostsToRenderStartIndex && index < localOlderPostsToRenderStopIndex + 1 && localOlderPostsToRenderStartIndex === stopIndex + 1;
          var isLoader = itemData[index] === loaderId; // It's important to read style after fetching item metadata.
          // getItemMetadata() will clear stale styles.

          var style = _this._getItemStyle(index);

          if (index >= startIndex && index < stopIndex + 1 || isItemInLocalPosts || isLoader) {
            var item = React.createElement(children, {
              data: itemData,
              itemId: itemData[index]
            }); // Always wrap children in a ItemMeasurer to detect changes in size.

            items.push(React.createElement(ItemMeasurer, {
              direction: direction,
              handleNewMeasurements: _this._handleNewMeasurements,
              index: index,
              item: item,
              key: itemKey(index),
              size: size,
              itemId: itemKey(index),
              width: width,
              skipResizeClass: skipResizeClass,
              onUnmount: _this._onItemRowUnmount,
              itemCount: itemCount
            }));
          } else {
            items.push(React.createElement('div', {
              key: itemKey(index),
              style: style
            }));
          }
        }
      }

      return items;
    };

    _this._onScrollVertical = function (event) {
      if (!_this.state.scrolledToInitIndex) {
        return;
      }

      var _event$currentTarget = event.currentTarget,
          scrollTop = _event$currentTarget.scrollTop,
          scrollHeight = _event$currentTarget.scrollHeight;

      if (_this._scrollCorrectionInProgress) {
        if (_this.state.scrollUpdateWasRequested) {
          _this.setState(function () {
            return {
              scrollUpdateWasRequested: false
            };
          });
        }

        return;
      }

      if (scrollHeight !== _this.state.scrollHeight) {
        _this.setState({
          scrollHeight: scrollHeight
        });
      }

      _this.setState(function (prevState) {
        if (prevState.scrollOffset === scrollTop) {
          // Scroll position may have been updated by cDM/cDU,
          // In which case we don't need to trigger another render,
          return null;
        }

        return {
          scrollDirection: prevState.scrollOffset < scrollTop ? 'forward' : 'backward',
          scrollOffset: scrollTop,
          scrollUpdateWasRequested: false,
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
          scrollDelta: 0
        };
      });
    };

    _this._outerRefSetter = function (ref) {
      var outerRef = _this.props.outerRef;
      _this.innerRefWidth = _this.props.innerRef.current.clientWidth;
      _this._outerRef = ref;

      if (typeof outerRef === 'function') {
        outerRef(ref);
      } else if (outerRef != null && typeof outerRef === 'object' && outerRef.hasOwnProperty('current')) {
        outerRef.current = ref;
      }
    };

    return _this;
  }

  DynamicSizeList.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    validateProps(props);
    return null;
  };

  var _proto = DynamicSizeList.prototype;

  _proto.scrollTo = function scrollTo(scrollOffset, scrollByValue, useAnimationFrame) {
    var _this2 = this;

    if (useAnimationFrame === void 0) {
      useAnimationFrame = false;
    }

    this._scrollCorrectionInProgress = true;
    this.setState(function (prevState) {
      return {
        scrollDirection: prevState.scrollOffset >= scrollOffset ? 'backward' : 'forward',
        scrollOffset: scrollOffset,
        scrollUpdateWasRequested: true,
        scrollByValue: scrollByValue
      };
    }, function () {
      if (useAnimationFrame) {
        _this2._scrollByCorrection = window.requestAnimationFrame(_this2.scrollBy(_this2.state.scrollOffset, _this2.state.scrollByValue));
      } else {
        _this2.scrollBy(_this2.state.scrollOffset, _this2.state.scrollByValue)();
      }
    });
    this.forceUpdate();
  };

  _proto.scrollToItem = function scrollToItem(index, align, offset) {
    if (align === void 0) {
      align = 'auto';
    }

    if (offset === void 0) {
      offset = 0;
    }

    var scrollOffset = this.state.scrollOffset; //Ideally the below scrollTo works fine but firefox has 6px issue and stays 6px from bottom when corrected
    //so manually keeping scroll position bottom for now

    var element = this._outerRef;

    if (index === 0 && align === 'end') {
      this.scrollTo(element.scrollHeight - this.props.height);
      return;
    }

    var offsetOfItem = getOffsetForIndexAndAlignment(this.props, index, align, scrollOffset, this._instanceProps);

    if (!offsetOfItem) {
      var itemSize = getItemSize(this.props, index, this._instanceProps);

      if (!itemSize && this.props.scrollToFailed) {
        if (this.state.scrolledToInitIndex) {
          this.props.scrollToFailed(index);
        } else {
          console.warn('Failed to do initial scroll correction', this.props.initRangeToRender, index);
        }
      }
    }

    this.scrollTo(offsetOfItem + offset);
  };

  _proto.componentDidMount = function componentDidMount() {
    var initialScrollOffset = this.props.initialScrollOffset;

    if (typeof initialScrollOffset === 'number' && this._outerRef !== null) {
      var element = this._outerRef;
      element.scrollTop = initialScrollOffset;
    }

    this._commitHook();
  };

  _proto.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.localOlderPostsToRender[0] !== this.state.localOlderPostsToRender[0] || prevState.localOlderPostsToRender[1] !== this.state.localOlderPostsToRender[1]) {
      var element = this._outerRef;
      var previousScrollTop = element.scrollTop;
      var previousScrollHeight = element.scrollHeight;
      return {
        previousScrollTop: previousScrollTop,
        previousScrollHeight: previousScrollHeight
      };
    }

    return null;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.scrolledToInitIndex) {
      var _this$state = this.state,
          _scrollDirection = _this$state.scrollDirection,
          _scrollOffset = _this$state.scrollOffset,
          _scrollUpdateWasRequested = _this$state.scrollUpdateWasRequested,
          _scrollHeight = _this$state.scrollHeight;
      var prevScrollDirection = prevState.scrollDirection,
          prevScrollOffset = prevState.scrollOffset,
          prevScrollUpdateWasRequested = prevState.scrollUpdateWasRequested,
          previousScrollHeight = prevState.scrollHeight;

      if (_scrollDirection !== prevScrollDirection || _scrollOffset !== prevScrollOffset || _scrollUpdateWasRequested !== prevScrollUpdateWasRequested || _scrollHeight !== previousScrollHeight) {
        this._callPropsCallbacks();
      }

      if (!prevState.scrolledToInitIndex) {
        this._keepScrollPosition = false;
        this._keepScrollToBottom = false;
      }
    }

    this._commitHook();

    if (prevProps.itemData !== this.props.itemData) {
      this._dataChange();
    }

    if (prevProps.height !== this.props.height) {
      this._heightChange(prevProps.height, prevState.scrollOffset);
    }

    if (prevState.scrolledToInitIndex !== this.state.scrolledToInitIndex) {
      this._dataChange(); // though this is not data change we are checking for first load change

    }

    if (prevProps.width !== this.props.width) {
      this.innerRefWidth = this.props.innerRef.current.clientWidth;

      this._widthChange(prevProps.height, prevState.scrollOffset);
    }

    if (prevState.localOlderPostsToRender[0] !== this.state.localOlderPostsToRender[0] || prevState.localOlderPostsToRender[1] !== this.state.localOlderPostsToRender[1]) {
      var postlistScrollHeight = this._outerRef.scrollHeight;
      var scrollValue = snapshot.previousScrollTop + (postlistScrollHeight - snapshot.previousScrollHeight);
      this.scrollTo(scrollValue, scrollValue - snapshot.previousScrollTop, true);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._scrollByCorrection) {
      window.cancelAnimationFrame(this._scrollByCorrection);
    }
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        className = _this$props3.className,
        innerRef = _this$props3.innerRef,
        innerTagName = _this$props3.innerTagName,
        outerTagName = _this$props3.outerTagName,
        style = _this$props3.style,
        innerListStyle = _this$props3.innerListStyle;
    var onScroll = this._onScrollVertical;

    var items = this._renderItems();

    return React.createElement(outerTagName, {
      className: className,
      onScroll: onScroll,
      ref: this._outerRefSetter,
      style: _extends({
        WebkitOverflowScrolling: 'touch',
        overflowY: 'auto',
        overflowAnchor: 'none',
        willChange: 'transform',
        width: '100%'
      }, style)
    }, React.createElement(innerTagName, {
      children: items,
      ref: innerRef,
      style: innerListStyle
    }));
  };

  _proto._callPropsCallbacks = function _callPropsCallbacks() {
    var _this$props4 = this.props,
        itemCount = _this$props4.itemCount,
        height = _this$props4.height;
    var _this$state2 = this.state,
        scrollDirection = _this$state2.scrollDirection,
        scrollOffset = _this$state2.scrollOffset,
        scrollUpdateWasRequested = _this$state2.scrollUpdateWasRequested,
        scrollHeight = _this$state2.scrollHeight;

    if (typeof this.props.onItemsRendered === 'function') {
      if (itemCount > 0) {
        var _this$_getRangeToRend3 = this._getRangeToRender(),
            _overscanStartIndex = _this$_getRangeToRend3[0],
            _overscanStopIndex = _this$_getRangeToRend3[1],
            _visibleStartIndex2 = _this$_getRangeToRend3[2],
            _visibleStopIndex = _this$_getRangeToRend3[3];

        this._callOnItemsRendered(_overscanStartIndex, _overscanStopIndex, _visibleStartIndex2, _visibleStopIndex);

        if (scrollDirection === 'backward' && scrollOffset < 1000 && _overscanStopIndex !== itemCount - 1) {
          var sizeOfNextElement = getItemSize(this.props, _overscanStopIndex + 1, this._instanceProps).size;

          if (!sizeOfNextElement && this.state.scrolledToInitIndex) {
            this.setState(function (prevState) {
              if (prevState.localOlderPostsToRender[0] !== _overscanStopIndex + 1) {
                return {
                  localOlderPostsToRender: [_overscanStopIndex + 1, _overscanStopIndex + 50]
                };
              }

              return null;
            });
          }
        }
      }
    }

    if (typeof this.props.onScroll === 'function') {
      this._callOnScroll(scrollDirection, scrollOffset, scrollUpdateWasRequested, scrollHeight, height);
    }
  } // This method is called after mount and update.
  // List implementations can override this method to be notified.
  ;

  _proto._getRangeToRender = function _getRangeToRender(scrollTop, scrollHeight) {
    var _this$props5 = this.props,
        itemCount = _this$props5.itemCount,
        overscanCountForward = _this$props5.overscanCountForward,
        overscanCountBackward = _this$props5.overscanCountBackward;
    var _this$state3 = this.state,
        scrollDirection = _this$state3.scrollDirection,
        scrollOffset = _this$state3.scrollOffset;

    if (itemCount === 0) {
      return [0, 0, 0, 0];
    }

    var scrollOffsetValue = scrollTop >= 0 ? scrollTop : scrollOffset;
    var startIndex = getStartIndexForOffset(this.props, scrollOffsetValue, this._instanceProps);
    var stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffsetValue, this._instanceProps); // Overscan by one item in each direction so that tab/focus works.
    // If there isn't at least one extra item, tab loops back around.

    var overscanBackward = scrollDirection === 'backward' ? overscanCountBackward : Math.max(1, overscanCountForward);
    var overscanForward = scrollDirection === 'forward' ? overscanCountBackward : Math.max(1, overscanCountForward);
    var minValue = Math.max(0, stopIndex - overscanBackward);
    var maxValue = Math.max(0, Math.min(itemCount - 1, startIndex + overscanForward));

    while (!getItemSize(this.props, maxValue, this._instanceProps) && maxValue > 0 && this._instanceProps.totalMeasuredSize > this.props.height) {
      maxValue--;
    }

    if (!this.state.scrolledToInitIndex && this.props.initRangeToRender.length) {
      return this.props.initRangeToRender;
    }

    return [minValue, maxValue, startIndex, stopIndex];
  } // // Intentionally placed after all other instance properties have been initialized,
  // // So that DynamicSizeList can override the render behavior.
  // _instanceProps: any = initInstanceProps(this.props, this);
  ;

  return DynamicSizeList;
}(React.PureComponent); // NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.


DynamicSizeList.defaultProps = {
  innerTagName: 'div',
  itemData: undefined,
  outerTagName: 'div',
  overscanCountForward: 30,
  overscanCountBackward: 10
};

var validateProps = function validateProps(_ref) {
  var children = _ref.children,
      itemSize = _ref.itemSize;

  if (process.env.NODE_ENV !== 'production') {
    if (children == null) {
      throw Error('An invalid "children" prop has been specified. ' + 'Value should be a React component. ' + ("\"" + (children === null ? 'null' : typeof children) + "\" was specified."));
    }

    if (itemSize !== undefined) {
      throw Error('An unexpected "itemSize" prop has been provided.');
    }
  }
};

exports.DynamicSizeList = DynamicSizeList;
