fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios test

```sh
[bundle exec] fastlane ios test
```

Run tests

### ios build_for_testing

```sh
[bundle exec] fastlane ios build_for_testing
```

Build for testing

### ios build

```sh
[bundle exec] fastlane ios build
```

Build and archive the app

### ios build_adhoc

```sh
[bundle exec] fastlane ios build_adhoc
```

Build for adhoc distribution

### ios build_dev

```sh
[bundle exec] fastlane ios build_dev
```

Build for development

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Deploy to TestFlight

### ios release

```sh
[bundle exec] fastlane ios release
```

Deploy to App Store

### ios screenshots

```sh
[bundle exec] fastlane ios screenshots
```

Take screenshots

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Sync certificates and provisioning profiles

### ios register_new_device

```sh
[bundle exec] fastlane ios register_new_device
```

Register new device

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
