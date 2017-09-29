# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).


## v1.5.4 - 2017-09-29
### Changed
- Option `zIndex` defaults to the highests value allowed (2147483647) to prevent other elements to be displayed over LoadingOverlay

### Fixed
- Object keys always expressed as string literals instead of identifiers (fixes some weird Microsoft Edge behaviour)
- Minor code fixes and improvements
- Added `main` field to package.json according to jsDelivr recommendations



## v1.5.3 - 2017-01-27
### Fixed
- CSS positioning problem with Extra *Progress* when used with Font Awesome



## v1.5.2 - 2016-12-09
### Changed
- Option `zIndex` defaults to 9999



## v1.5.1 - 2016-11-11
### Added
- package.json fix



## v1.5.0 - 2016-11-11
### Added
- Bower and npm support
- Changelog



## v1.4.1 - 2016-08-05
### Changed
- LoadingOverlay is always attached to the body, even in *element overlay* mode
- `resizeInterval` option defaults to 50 milliseconds 

### Fixed
- A bug with positioning in *element overlay* mode
- Possible inconsistency with Javascript `parseInt()` function



## v1.4.0 - 2016-06-29
### Added
- `imagePosition` option
- Released on jsDelivr CDN

### Changed
- SemVer compliant
- loading.gif image is now embedded in the code as Data URI



## v1.3 - 2016-05-25
### Added
- `z-index` option



## v1.2 - 2016-04-22
### Added
- Fade In and Fade Out
- Extra *Progress*



## v1.1 - 2015-12-31
### Added
- Font Awesome support
- Custom element support



## v1.0 - 2015-02-15
*First public release*
