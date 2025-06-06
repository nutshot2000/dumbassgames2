# 🎵 8-BIT MUSIC COLLECTION

This directory contains the retro 8-bit music tracks for the DUMBASSGAMES music player.

## Adding Your GXSCC Tracks

1. **Convert your MIDI files** using GXSCC to create amazing 8-bit chiptune versions
2. **Export as MP3 or WAV** for web compatibility  
3. **Add files to this directory** with descriptive names
4. **Update the playlist** in `script.js` to include your tracks

## Current Playlist Structure

```javascript
{
    title: "TRACK NAME",
    url: "music/filename.mp3",
    duration: "MM:SS"
}
```

## Example Files to Add

- `retro-dreams.mp3` - Dreamy synthwave vibes
- `cyber-highway.mp3` - High-energy driving music  
- `neon-nights.mp3` - Atmospheric night theme
- `pixel-paradise.mp3` - Upbeat arcade-style
- `arcade-fever.mp3` - Classic retro gaming

## File Requirements

- **Format**: MP3 or WAV recommended
- **Size**: Keep under 5MB per track for fast loading
- **Length**: 2-4 minutes ideal for background music
- **Quality**: 128-192 kbps is perfect for 8-bit style

## Adding New Tracks

1. Place your audio file in this directory
2. Update the `playlist` array in `script.js`:

```javascript
musicPlayer.addTrack("YOUR TRACK NAME", "music/your-file.mp3", "3:45");
```

Or edit the playlist directly in the RetroMusicPlayer constructor.

## GXSCC Tips

- Use classic video game MIDI files for best results
- Experiment with different channel configurations
- Export with consistent volume levels
- Consider creating loops for ambient tracks

## Audio File Naming Convention

Use descriptive, web-safe filenames:
- `space-adventure-theme.mp3`
- `boss-battle-mix.mp3` 
- `menu-background.mp3`
- `victory-fanfare.mp3`

---

**Ready to make DUMBASSGAMES even more immersive with your epic 8-bit soundtrack! 🎮🎵** 