#!/usr/bin/env ruby

# Script to help extract project information for Fastlane setup

require 'xcodeproj'

def get_project_info
  puts "🔍 Analyzing Xcode project..."
  puts "=" * 50

  # Find project file
  project_path = Dir.glob("*.xcodeproj").first

  if project_path.nil?
    puts "❌ No .xcodeproj file found in current directory"
    return
  end

  puts "📁 Project file: #{project_path}"

  # Open project
  project = Xcodeproj::Project.open(project_path)

  # Get targets
  puts "\n🎯 Targets:"
  project.targets.each do |target|
    puts "  • #{target.name}"

    # Get bundle identifier
    target.build_configurations.each do |config|
      bundle_id = config.build_settings['PRODUCT_BUNDLE_IDENTIFIER']
      if bundle_id
        puts "    Bundle ID (#{config.name}): #{bundle_id}"
      end
    end
  end

  # Get schemes
  puts "\n📋 Available Schemes:"
  scheme_dir = project_path.gsub('.xcodeproj', '.xcodeproj/xcshareddata/xcschemes')
  if Dir.exist?(scheme_dir)
    Dir.entries(scheme_dir).select { |f| f.end_with?('.xcscheme') }.each do |scheme|
      puts "  • #{scheme.gsub('.xcscheme', '')}"
    end
  end

  # Check for workspace
  workspace_path = Dir.glob("*.xcworkspace").first
  if workspace_path
    puts "\n🗂️  Workspace file: #{workspace_path}"
  end

  puts "\n" + "=" * 50
  puts "✅ Use this information to configure your .env file"
end

def get_team_info
  puts "\n🏢 Getting Team Information..."
  puts "=" * 50

  # Try to get signing identities
  output = `security find-identity -v -p codesigning 2>/dev/null`

  if output.empty?
    puts "⚠️  No code signing identities found in keychain"
    puts "   Make sure you have certificates installed"
  else
    puts "🔐 Code Signing Identities:"
    output.split("\n").each do |line|
      if line.include?("iPhone") || line.include?("iOS")
        # Extract team ID from parentheses
        if match = line.match(/\(([A-Z0-9]{10})\)/)
          team_id = match[1]
          puts "  • Team ID: #{team_id}"
          puts "    #{line.strip}"
        end
      end
    end
  end
end

# Run the analysis
if __FILE__ == $0
  puts "🚀 Fastlane Project Information Extractor"
  puts "This script helps you gather information needed for .env setup"
  puts

  get_project_info
  get_team_info

  puts "\n📝 Next steps:"
  puts "1. Copy ios/fastlane/.env.example to ios/fastlane/.env"
  puts "2. Fill in the values using information above"
  puts "3. Get your App-Specific Password from Apple ID settings"
  puts "4. Setup Match repository for code signing"
  puts
  puts "📖 See FASTLANE_ENV_GUIDE.md for detailed instructions"
end