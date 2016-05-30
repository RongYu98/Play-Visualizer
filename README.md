# Play Visualizer

__Team:__ Vivian Li, Isaac Gerstein, Rong Yu, Eric Stringham

| Members       | Position      |
| ------------- |:-------------:|
| Vivian        | Frontend/UX   |
| Isaac         | Backend       |
| Rong          | Middleware    |
| Eric          | Backend       |

__Description:__ Sports Play Visualizer (Soccer)

__Client:__ Vandana (vagarwala@stuy.edu)

__Work__:
- Delete: IG
  Delete All
  DeletePlayer
- Run:
  RunPlayer
Speed:
  Slider VL
  Using Slider 

__Change Log:__

5/30/16
- Add Players no longer needs to be constantly pressed -RY

5/28/16:
- Selected player is highlighted in yellow -IG
- Prevented paths from being drawn outside of field -IG

5/26/16:
- Select works every way indended, i != this.i -RY
- Added ability to delete individual players or all players -IG
- Changed paths array to an object with IDs as keys -IG

5/25/16:
- Select now works better, because a^2 + b^2 == c^2 != c -RY
- Fixed mobile version, note: don't add a listener when you can force it -RY
- From now on, mobile is behind normal, so it will be like a branch in a seperate file -RY
- Centered field and buttons -VL

5/24/16:
- Added in select and ability to route, a bit buggy if changed halfway RY
- Added team 2, they're blue -VL
- Made arrow color change based on team -IG
- Speed is now related to the size and not a number -VL

5/23/16:
- Fixed bugs with adding players -IG
- Players and paths resize along with field -VL

5/22/16:
- Animation works on iOS -RY
- Fixed resizing bug -VL

5/21/16:
- Field resizes based on window size -VL

5/20/16:
- Added functions for running animation, stopping, and resetting -IG
- Fixed arrow bugs -IG
- Changed size of field image -VL

5/18/16:
- Added array to store player paths -IG
- Draws an arrow when setting a player path -IG
- Clears screen in between drawing player dots -VL
- Made animation smoother by adding more inbetween frames -RY
- Window.request is only called once, speed no longer speeds up -RY
- Added a speed componenet, need to rework the movement to make it independent of number of points -RY

5/17/16:
- Players move along a path set by the user -IG -RY
- Changed from all-at-once to quasi-animation -RY

5/16/16:
- Changed to soccer field and fixed field dimensions -IG
- Created arrays to store x and y coordinates -RY
- Players are represented with red dots -IG

5/13/16:
- Set up cursor interaction with field -RY

5/12/16:
- Created basic js functions -RY
- Added picture of football field -VL

5/5/16:
- Set up basic html and js files -VL
