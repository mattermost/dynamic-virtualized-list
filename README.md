# react-window

> React components for efficiently rendering dynamic sized lists

[![NPM registry](https://img.shields.io/npm/v/react-window.svg?style=for-the-badge)](https://yarnpkg.com/en/package/react-window) [![Travis](https://img.shields.io/badge/ci-travis-green.svg?style=for-the-badge)](https://travis-ci.org/bvaughn/react-window) [![NPM license](https://img.shields.io/badge/license-mit-red.svg?style=for-the-badge)](LICENSE)

## Install

```bash
npm install github:mattermost/dynamic-virtualized-list --save

TODO: pusblish to npm
```

## Usage

Learn more at [react-window.now.sh](https://react-window.now.sh/).

## Frequently asked questions

#### How is `dynamic-virtualized-list` different from `react-window`?
`react-window` has different API's for fixed lists, and grids. Though this was built from a fork of `react-window` aplha version for dynamic lists this takes an completely different approach in building dynamic lists. 

This library is a stripped version of `react-window` even for the base code to elimate unneeded API's that mattermost does not use at the moment. The changes needed for enabling some of the freatures made significant changes to base code so it wasn't possible to keep updated with upstream anymore. 

The main difference from aplha dynamic list in `react-window` to this fork is the adoption of `relative` elements instead of `absolutely` positioned elements for dynamic lists. Some of the key changes are listed at https://github.com/mattermost/react-window/pull/9

This also has code needed for scroll correction needed for dynamic lists which can change over time and support adding elements in both directions.
