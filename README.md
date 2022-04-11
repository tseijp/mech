# MECH⚙

<div align="center">

###### CAD like Model Viewer in [tseijp.github.io/mech](https://tseijp.github.io/mech/)
[![][status-img]][status]
[![][code-quality-img]][code-quality]
[![][license-img]][license]

  <a href="https://tseijp.github.io/mech/">
    <img src="https://i.imgur.com/zZOZQKZ.gif" width="600" alt="⚙" />
  </a>
</div>


## Getting Started

This website is built using [Docusaurus 2](https://docusaurus.io/),
a modern static website generator.

### Installation

```bash
git clone https://github.com/tseijp/home
cd home
yarn
```

### Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Build

```bash
yarn build
```

This command generates static content into the `build` directory
and can be served using any static contents hosting service.


### References

- This project is Created with CodeSandbox

__r3f gl render refs__

  - https://codesandbox.io/s/react-three-fiber-viewcube-py4db
  - https://codesandbox.io/s/react-three-fiber-viewport-example-yf8yt
  - https://codesandbox.io/s/react-three-fiber-multiple-scene-test-k7ei0

__multiple views refs__

  - https://threejs.org/examples/#webgl_multiple_views
  - https://gracious-keller-98ef35.netlify.app/docs/recipes/heads-up-display-rendering-multiple-scenes/
  - https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html

__Outline shader material refs__
  - https://codesandbox.io/s/edgesgeometry-iup24?file=/src/index.js:0-6
  - https://codepen.io/prisoner849/pen/KKqmyEV?editors=0010
  - https://discourse.threejs.org/t/making-invisible-edges-dashed/29824/2

__Upload 3D Model refs__
  - https://github.com/mrdoob/three.js/blob/master/editor/js/Loader.js#L65

__Third Angle Projection Symbol refs__
  - https://upload.wikimedia.org/wikipedia/commons/6/62/First_angle_projection_symbol.svg
  - https://upload.wikimedia.org/wikipedia/commons/6/64/Third_angle_projection_symbol.svg
  - https://codesandbox.io/s/svg-filter-v9-kwcpe?file=/src/index.js

__CRANKSHAFT 3D Model (CC license, Royalty Free License
)__
  - https://sketchfab.com/3d-models/crankshaft-a3d8b494358a403688e3ab280c17d67e
  - https://www.cgtrader.com/free-3d-models/industrial/part/crankshaft

[status]: https://github.com/tseijp/mech/actions
[code-quality]: https://www.codefactor.io/repository/github/tseijp/mech
[license]: https://github.com/tseijp/mech

[status-img]: https://img.shields.io/badge/build-passing-red?style=flat&colorA=000&colorB=000
[code-quality-img]: https://img.shields.io/codefactor/grade/github/tseijp/mech?style=flat&colorA=000&colorB=000
[license-img]: https://img.shields.io/badge/license-MIT-black?style=flat&colorA=000&colorB=000
