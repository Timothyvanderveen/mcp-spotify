# WIP

## Installation

### Requirements
- Node.js 18.0.0 or higher
- Yarn 1.0.0 or higher

### Steps
```bash
# Clone the repository
git clone https://github.com/Timothyvanderveen/mcp-spotify.git
cd mcp-cs

# Install dependencies
yarn install

# Build source files
yarn build

# Authorize Spotify
yarn auth
```


### Configure Claude Desktop

#### Create the Configuration File

**macOS:**

```bash
touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**

```cmd
type NUL > %APPDATA%\Claude\claude_desktop_config.json
```

#### Add MCP Server Configuration

Open `claude_desktop_config.json` in a text editor and add the following content:

```json
{
  "mcpServers": {
    "mcp-spotify": {
      "command": "node",
      "args": [
        "[path_to_build/index.js]"
      ]
    }
  }
}
```

Replace `[path_to_build/index.js]` with the actual path to your built `index.js` file.

### 3. Restart Claude Desktop

After saving the configuration file, restart Claude Desktop to apply the changes. This setup ensures that Claude Desktop launches your MCP server (`mcp-spotify`) using Node.js and the specified script.

### 4. Start Using MCP
   With the MCP server configured and running, you can now interact with the Spotify Web API through Claude Desktop. ~~This includes retrieving metadata about artists, albums, and tracks, managing playlists, and controlling playback.~~ #TODO
## License

This project is licensed under the MIT License.
