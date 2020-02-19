# OpenRider
## An (hopefully) exploitable codebase ported from BlackHatRider, a port of CanvasRider, a port of Freerider
### Why
As we approach the dusk of BlackHatRider i took it upon myself to do the work i should've done years ago and actually make a proper successor to it.

I'll do a deeper dive into the code later, but in a nutshell the game has been refactored into an ES6 module which means instead of being a jumbo mess to read it's now put into classes. ES6 also happens to be strictly typed by default so no weird booleans that become arrays n stuff.

It's also hard (see: probably not possible) to hook into from the console since modules aren't exposed to the window object, which means checkpoint hacks and such are less problematic.<sub>There may still be some stuff that will have to be exported to window

### How
One thing about es6 modules is that they have a super neat feature bundled in called CORS that prevents malicious gamers from putting js from their website into your website, but it also doesn't apply to the file: protocol, so you're gonna have to start a webserver to access localhost from your computer if you want to fiddle with the code. As i'm planning to sugar coat this with a PHP website, i'm thinking installing XAMPP is probably a good idea for anyone wanting to contribute.