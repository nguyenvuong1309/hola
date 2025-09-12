# TestFlight Automation Setup

This guide will help you configure the automated build and deployment pipeline to TestFlight.

## Prerequisites

1. **Apple Developer Account** with Admin or App Manager role
2. **App Store Connect API Key** 
3. **iOS Distribution Certificate** and **Provisioning Profile**
4. **Bundle Identifier** registered in App Store Connect

## Required GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

### App Store Connect API
- `APPSTORE_ISSUER_ID`: Your App Store Connect API issuer ID
- `APPSTORE_KEY_ID`: Your App Store Connect API key ID  
- `APPSTORE_PRIVATE_KEY`: Your App Store Connect API private key (entire .p8 file content)

### Code Signing
- `IOS_CERTIFICATES`: Base64 encoded .p12 certificate file
- `IOS_CERTIFICATES_PASSWORD`: Password for the .p12 certificate

## Setup Steps

### 1. Create App Store Connect API Key
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to Users and Access > Keys
3. Click the "+" button to create a new key
4. Give it a name and select "App Manager" role
5. Download the .p8 file and note the Key ID and Issuer ID

### 2. Export Code Signing Certificate
```bash
# Export from Keychain as .p12 file, then convert to base64
base64 -i YourCertificate.p12 | pbcopy
```

### 3. Update Configuration Files

#### Update Bundle Identifier
Edit `ios/ExportOptions.plist` and replace:
- `com.yourcompany.hola` with your actual bundle identifier
- `YourProvisioningProfileName` with your provisioning profile name

#### Update Workflow File
In `.github/workflows/ios-testflight.yml`, update the bundle-id in the provisioning profile step.

### 4. Xcode Project Configuration
Ensure your Xcode project has:
- Correct Bundle Identifier
- Valid Team ID
- Provisioning Profile configured for Release builds
- Code signing set to "iOS Distribution"

## Triggering Builds

The workflow will automatically run on:
- Push to `main` branch
- Pull requests to `main` branch
- Manual trigger via GitHub Actions UI

## Troubleshooting

### Common Issues:
1. **Certificate/Provisioning Profile mismatch**: Ensure the certificate matches the provisioning profile
2. **Bundle ID mismatch**: Verify bundle identifier consistency across all files
3. **Xcode version**: Update the Xcode version in the workflow if needed
4. **Pod install issues**: May need to update CocoaPods or clear cache

### Debugging:
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are properly configured
- Test code signing locally first

## Manual Testing
Before using CI/CD, test the build process locally:
```bash
# Install dependencies
npm install
cd ios && pod install

# Build archive
xcodebuild -workspace hola.xcworkspace \
  -scheme hola \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath ./build/hola.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/hola.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```