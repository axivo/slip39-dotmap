# SLIP39 KeyTag Converter

A tool for learning SLIP39 mnemonic conversion to dot patterns for KeyTag hardware. This application demonstrates the conversion process and KeyTag layout for **educational purposes** only.

![SLIP39 KeyTag Converter](../docs/images/converter.png)

## Security Notice

Under any circumstances, **do not enter actual cryptocurrency seed phrases into converter**, regardless of how secure your computer is. Mnemonics entered into any electronic device create security risks, including:

- Memory persistence in RAM and browser caches
- Potential exposure through swap files or system dumps  
- Vulnerability to malware, screen recording, or keyloggers
- Human error in data clearing procedures

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

## Disclaimer

This tool is provided as-is for educational and personal use. Users are responsible for proper security practices, accurate implementation, and safe storage of physical KeyTags. The authors assume no responsibility for lost funds due to misuse or implementation errors.
