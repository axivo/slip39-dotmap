# SLIP39 KeyTag Converter

A secure, offline-first tool for converting SLIP39 mnemonic words into dot patterns for physical KeyTag hardware implementation. This tool enables the creation of physical, air-gapped cryptocurrency wallet backups using the OneKey KeyTag system.

![SLIP39 KeyTag Converter](../docs/images/converter.png)

## Security Notice

This tool is designed for offline use only when handling real cryptocurrency mnemonics. Network connectivity poses security risks for sensitive cryptographic material.

## Quick Start

### Prerequisites

This application requires `Node.js` and `npm`, install them with Homebrew or other similar tools:

```bash
brew install node
node --version
npm --version
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/axivo/slip39-dotmap.git .
   ```

2. **Navigate to converter directory:**
   ```bash
   cd slip39-dotmap/converter
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open browser:**
   Navigate to `http://localhost:3000`

3. **For secure use:**
   - Disconnect from internet after loading the page
   - Verify the network warning appears when online
   - Only enter real mnemonics when offline

## Security Best Practices

### Security Steps

1. **Load the application online first**, to cache resources
2. **Disconnect from internet**, before entering any real mnemonics
3. **Only proceed when offline**, the network warning will disappear when disconnected

### Data Protection

- **Never enter real mnemonics while online**
- **Clear browser data** after use (history, cache, local storage)
- **Use a dedicated offline computer** for maximum security
- **Test with sample data** first to verify functionality

### Physical Security

- **Store printed KeyTags securely** - treat them like cash or gold
- **Use multiple copies** stored in different secure locations
- **Test recovery process** with small amounts first
- **Protect from physical damage** (fire, water, corrosion)

## Important Warnings

- **SLIP39 mnemonics control cryptocurrency funds** - exposure can result in permanent financial loss
- **Mark dots accurately** - incorrect patterns mean lost funds
- **Test recovery process** with small amounts before trusting large funds
- **Never share real mnemonic data** when seeking help

## Disclaimer

This tool is provided as-is for educational and personal use. Users are responsible for proper security practices, accurate implementation, and safe storage of physical KeyTags. The authors assume no responsibility for lost funds due to misuse or implementation errors.
