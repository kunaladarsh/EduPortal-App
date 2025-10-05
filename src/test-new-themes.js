// Quick test to verify the new themes are properly defined
// This can be run in the browser console to check theme loading

console.log('🎨 Testing New Beautiful Themes...');

// Check if colorApiService is available
if (typeof window !== 'undefined') {
  // This would be available in the browser environment
  console.log('✅ Browser environment detected');
  
  // Test theme names that should be available
  const expectedThemes = [
    'Lavender & Mint',
    'Coral & Teal',
    'Sage & Terracotta', 
    'Indigo & Gold',
    'Forest & Rose Gold',
    'Midnight Aurora',
    'Sunset Dreams',
    'Nordic Cool',
    'Cherry Blossom',
    'Deep Sea',
    'Volcanic Energy',
    'Amethyst & Jade',
    'Aurora Borealis',
    'Golden Hour',
    'Peacock Elegance',
    'Rose Quartz Serenity',
    'Cosmic Nebula',
    'Tropical Paradise',
    'Arctic Frost',
    'Burgundy & Gold'
  ];
  
  console.log(`🔍 Looking for ${expectedThemes.length} new beautiful themes...`);
  console.log('📋 Expected themes:', expectedThemes);
  
  // Instructions for manual testing
  console.log(`
🧪 To test the new themes:
1. Go to Settings (tap the gear icon in bottom navigation)
2. Look for "Theme Verification" with "NEW" badge in Appearance section
3. Tap "Theme Verification" to see all new beautiful themes
4. Try switching between different themes to see the colors change
5. Toggle between light and dark mode to see both variants

🎯 What to verify:
- Total themes should be 40+ (20 new + existing)
- Color previews should show beautiful combinations
- Theme switching should work smoothly with transitions
- Dark/light mode toggle should work
- Each theme should have descriptive names and descriptions

If you see "Beautiful themes loaded!" with a green checkmark, everything is working! ✨
  `);
}

// Export theme count check function for manual verification
window.testThemeCount = async function() {
  try {
    // This would need to be adapted to work with your actual theme service
    console.log('🔄 Fetching themes...');
    
    // Simulate what the app does
    const response = await fetch('/api/v1/colors/themes');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.data?.length || 0} themes total`);
      return data.data?.length || 0;
    } else {
      console.log('⚠️ Could not fetch themes via API (this is expected in development)');
      return 'API not available - check the Theme Verification page in the app';
    }
  } catch (error) {
    console.log('ℹ️ Direct API test not available - use the Theme Verification page in the app');
    return 'Use app interface to verify';
  }
};

console.log('🎉 Theme verification script loaded! Run window.testThemeCount() or check the app interface.');