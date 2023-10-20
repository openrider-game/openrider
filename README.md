<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h1 align="center">OpenRider</h1>
  <p align="center">
    A port of a port of a port of FreeRider 
    <br />
    <br />
    <a href="https://tomiy.me/openrider/">View Demo</a>
    ·
    <a href="https://github.com/tomiy/openrider/issues">Report Bug</a>
    ·
    <a href="https://github.com/tomiy/openrider/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Openrider is the last link in a pretty long chain of reboots of freerider, a bike riding game where players draw tracks and race on them.

It features what is essentially an entire rewrite of the game engine that aims to keep the same physics and functionality as the historic versions such as CanvasRider and its invite-only successor, BlackHatRider, while improving performance and user experience, and adding modern features for racers and creators alike.

The endpoints for database actions exist and can be accessed through a small API but UI has been left out of the scope of this project, and need to be implemented by the reader to enjoy the classic FreeRider experience.

This repository is __not endorsed nor approved__ by FreeRiderHD, the official successor to the FreeRider series of games. It is entirely written from scratch and does not borrow any assets. It is made out of love for the franchise and is not meant for commercial use. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

* NPM (optional)
* XAMPP (or any way to get an apache php environment)
* PostgreSQL

### Installation

0. Configure PostgreSQL with the default password 'postgresql'
1. Clone the repo
   ```sh
   git clone https://github.com/tomiy/openrider.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. In httpd.conf, change DocumentRoot & Directory so that it is possible to at least path to this folder (and optionally change port number if another process is running on :80)
4. In php.ini, enable the pdo_pgsql extension 
5. Run the script in .setup\db\tables.sql to create the base table structure
6. Move the file sample.htaccess to the top directory of the repo and rename it to .htaccess
7. Optionally, you may move the .setup\db\ folder to place it anywhere you see fit, but if you do be sure to change the constants in class\constant\RequestConstants.js so that they still point to the correct URL
8. Optionally, you may minify the js with vite, although this requires a bit of tinkering because vite cannot bundle php files out of the box. Some documentation on this step might be provided in the future once a satisfactory procedure is found
8. The game is now playable at localhost[optional :port]/[optional url path]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Unlike previous iterations of the game, the __rendering and processing of physics are entirely separated__ in the engine, which means you can render arbitrarily fast (more FPS!) while keeping the physics system intact (backwards compatibility with CR and BHR!) and have an overall better experience.

The editor as is is compatible to a degree with FreeRiderHD, you may import your tracks from there with little to no trouble, except for vehicles which won't be added in this repo. With that said, anyone can fork it and go through the hassle of doing it, the game structure supports it pretty well!

A new __layers__ feature has been added, you now have the option of drawing onto the main layer, like the previous games, or you can now draw onto the _foreground_ layer, which is rendered in front of the bike, does not interact with physics and is semi transparent.

__Item options__ are now available for the relevant tools and will appear when you select the tool. You can click the tool (or the hotkey) again to hide them. For example, you may now _filter what you want to erase_ with the eraser tool.

You can now __change the start position__ of the rider.

You can now __debug__ render and physics cells, item IDs, bike hitboxes, collision checks...

__Many more improvements will be made in the future!__

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- Hat ❔ (could be a good idea for scalability)
- Powerups
  - Zero gravity 🚧
  - Teleport ✅
  - Invincibility ❌
  - No steer ❌
  - Engine off ❌
  - Slippery wheels ❌
  - Restore/reset bike state (for the above powerups) ❌

See the [open issues](https://github.com/tomiy/openrider/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Tomiy - [@__tomiy__](https://twitter.com/__tomiy__)

Project Link: [https://github.com/tomiy/openrider](https://github.com/tomiy/openrider)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Polygon](https://github.com/Plygon) for the HUGE initial help and interpolation math
* [Joel Huff](https://github.com/joelwhuff) for fixing physics (thanks!)
* [Calculus](https://github.com/Calculamatrise) for bug fixes

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/tomiy/openrider.svg?style=for-the-badge
[contributors-url]: https://github.com/tomiy/openrider/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tomiy/openrider.svg?style=for-the-badge
[forks-url]: https://github.com/tomiy/openrider/network/members
[stars-shield]: https://img.shields.io/github/stars/tomiy/openrider.svg?style=for-the-badge
[stars-url]: https://github.com/tomiy/openrider/stargazers
[issues-shield]: https://img.shields.io/github/issues/tomiy/openrider.svg?style=for-the-badge
[issues-url]: https://github.com/tomiy/openrider/issues
[license-shield]: https://img.shields.io/github/license/tomiy/openrider.svg?style=for-the-badge
[license-url]: https://github.com/tomiy/openrider/blob/master/LICENSE.txt
