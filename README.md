# Voyages

This repository holds the source for my voyage website.
It is currently hosted on Firebase, you can have a look here: https://voyages-pppc.web.app/.

The backend I use is [Back4App](https://www.back4app.com/) based on the Parse platform.
Images are hosted on Imgur.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Deploy to firebase
```
firebase deploy
```

## Project structure

As for Vue projects, source files can be found in the `src` folder. Each subfolder has the following usage:
- `views`: contains the views (or page types) of the project.
- `components`: contains the custom Vue components reused in the views.
- `mixins`: contains reusable code portion. In this case they hold code for API connections.

The project has three main views:
- `Home.vue` holds the world map. Each marker leads to a Region.
- `Region.vue` is the Region page. It has a carousel (`ImageSlider.vue`) presenting images from the region, a short description and tabs presenting (in `Carte.vue`) the different Point of Interests of the Region.
- `PoI.vue` is the Point of Interests page. It also has a carousel, a description, but also a docker containing information for the Point of Interest (`InfoDocker.vue`) and comments written by me (`Comment.vue`). Each comment gives a rating to the Point of Interest (`Rating.vue`).

Each page has on top a navigation bar (`NavigationBar.vue`). Most texts can be written in Markdown (`EditableMarkdown.vue`).
