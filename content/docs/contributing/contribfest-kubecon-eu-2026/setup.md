---
title: Contributor Environment Setup Guide
description: 'Get your development environment ready for contributing to cert-manager'
---

**For**: cert-manager ContribFest at KubeCon EU 2026
**Goal**: Get your environment ready to contribute to cert-manager

This guide will help you set up your development environment before (or during) the ContribFest session. The more you can prepare in advance, the more time you'll have for hands-on contributing!

---

## Quick Start Checklist

- [ ] GitHub account created
- [ ] Git installed and configured
- [ ] Choose your contribution track:
  - **Documentation/Website track**: Node.js 20+
  - **Go code track**: Go 1.26+ (1.21+ minimum)
- [ ] Fork and clone your chosen repository
- [ ] Join Kubernetes Slack (`#cert-manager-dev`)
- [ ] Browse [good first issues](https://github.com/search?q=org%3Acert-manager+label%3A%22good+first+issue%22+state%3Aopen&type=issues)

---

## Local Development Setup

### Platform Notes

- **macOS/Linux**: Follow the instructions below
- **Windows**: We strongly recommend using **WSL** (Windows Subsystem for Linux):
  - [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install), then follow the Linux instructions
  - Or use a Linux VM (VirtualBox, VMware, etc.)
  - If WSL/VM installation is not possible, see [Alternative: GitHub Codespaces](#alternative-github-codespaces-windows-escape-hatch) at the end of this guide
  - Native Windows Git/Go setup can be complex; WSL provides a smooth Linux environment

### 1. Git and GitHub Setup

#### Install Git

**macOS**:
```bash
brew install git
```

**Ubuntu/Debian/WSL**:
```bash
sudo apt-get update
sudo apt-get install git
```

#### Configure Git

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Enable DCO signoff (required for cert-manager contributions)
git config --global format.signoff true

# Verify
git config --list | grep user
```

#### Fork and Clone

**Using gh CLI** (recommended):
```bash
# Install gh CLI first
# macOS:
brew install gh

# Ubuntu/Debian/WSL:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
gh auth login

# Fork and clone in one step
gh repo fork cert-manager/cert-manager --clone --default-branch-only
# Or for website:
gh repo fork cert-manager/website --clone --default-branch-only
```

**Manual fork**:
1. Go to the repository on GitHub
2. Click "Fork" button
3. Clone your fork:
   ```bash
   git clone git@github.com:<your-username>/cert-manager.git
   # Or: git clone git@github.com:<your-username>/website.git
   ```

**Create working branch**:
```bash
cd cert-manager  # or cd website
git checkout -b contribfest-yourname
```

**⚠️ IMPORTANT: Fetch tags** (cert-manager repo only):
```bash
# GitHub forks don't include tags by default
# This is required for make commands to work!
git fetch --tags https://github.com/cert-manager/cert-manager.git
```

### 2. Code Editor

Any text editor works, but we recommend:

**VS Code** (beginner-friendly):
- Download: https://code.visualstudio.com/
- Recommended extensions: Go, Markdown All in One, GitLens

**Others**: vim, GoLand, Sublime Text, Emacs

### 3. Track-Specific Setup

Choose based on which issues you want to work on.

#### Track A: Documentation / Website

**Required**: Node.js 20.19.0 or later

**Install Node.js**:

```bash
# macOS
brew install node@20

# Ubuntu/Debian/WSL
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify**:
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

**Build website**:
```bash
cd website

# Install dependencies
npm ci

# Start dev server
./scripts/server

# Access at:
# http://localhost:8888 (with redirects working)
# http://localhost:3000 (direct Next.js)
```

**Making changes**:
1. Edit files in `content/`
2. Changes auto-reload in browser
3. Run checks:
   ```bash
   npm run check:spelling
   npm run check:links
   ```

#### Track B: Go Code

**Required**: Go 1.21 or later (Go 1.26.1 recommended)

**Install Go**:

```bash
# macOS (installs latest version)
brew install go

# Ubuntu/Debian/WSL (installs Go 1.26.1)
wget https://go.dev/dl/go1.26.1.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.26.1.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

**Verify**:
```bash
go version  # Should show go1.26.x or go1.21.x+
```

**Install build tools**:

```bash
# macOS
xcode-select --install

# Ubuntu/Debian/WSL
sudo apt-get install build-essential
```

**Build cert-manager**:
```bash
cd cert-manager

# ⚠️ If you haven't fetched tags yet, do it now:
git fetch --tags https://github.com/cert-manager/cert-manager.git

# Install vendored Go tooling (includes specific Go version)
make vendor-go

# Download dependencies
go mod download

# Run linters and checks
make verify

# Run unit tests (quick, no cluster needed)
make unit-test
```

**View all available commands**:
```bash
make
# Or: make help
```

**Common make targets**:
- `make verify` — Run linters and checks
- `make unit-test` — Run unit tests only (fast)
- `make test` — Run all tests (unit + integration + e2e, slow!)
- `make vendor-go` — Install vendored Go and tools

---

## Working in Your Environment

### Making Your First Change

1. **Find an issue**:
   - Browse [good first issues](https://github.com/search?q=org%3Acert-manager+label%3A%22good+first+issue%22+state%3Aopen&type=issues) across cert-manager projects
   - See our [curated shortlist](shortlist.md) for ContribFest recommendations

2. **Claim the issue**:
   - Comment on GitHub: "I'd like to work on this for ContribFest"

3. **Make your changes**:
   - For docs: edit files in `content/`
   - For code: edit files in `pkg/` or `internal/`

4. **Test your changes**:
   ```bash
   # Website
   ./scripts/verify

   # cert-manager Go code
   make unit-test
   make verify
   ```

5. **Commit**:
   ```bash
   git add <changed-files>
   git commit -m "Brief description of your change"
   # DCO signoff is automatic if you ran: git config --global format.signoff true
   ```

6. **Push to your fork**:
   ```bash
   git push origin contribfest-yourname
   ```

7. **Create Pull Request**:
   ```bash
   # Using gh CLI (easiest)
   gh pr create --web

   # Or go to your fork on GitHub and click "Compare & pull request"
   ```

### Getting Help

**During ContribFest**:
- Raise your hand — maintainers will help!
- Ask in Slack `#cert-manager-dev`

**Before ContribFest**:
- Join [Kubernetes Slack](https://slack.k8s.io/)
- Ask in `#cert-manager-dev` channel

---

## Alternative: GitHub Codespaces (Windows Escape Hatch)

**Only use this if**:
- You're on Windows **and** cannot install WSL or a VM
- You have a personal GitHub account (not corporate)

**⚠️ Warning**: Codespaces may be disabled by corporate GitHub accounts, and the free tier is limited (60 hours/month). We recommend local setup whenever possible.

### Quick Setup

1. **Fork the repository**:
   - Go to https://github.com/cert-manager/cert-manager (for Go issues) or https://github.com/cert-manager/website (for docs issues)
   - Click "Fork" button

2. **Create Codespace**:
   - In your forked repo, click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on master"
   - Select machine type (2-core is sufficient)

3. **Wait for setup** (takes 1-2 minutes)

4. **Create your branch**:
   ```bash
   git checkout -b contribfest-yourname
   ```

5. **⚠️ IMPORTANT: Fetch tags** (cert-manager repo only):
   ```bash
   git fetch --tags https://github.com/cert-manager/cert-manager.git
   ```

6. **Start contributing!** See "Working in Your Environment" section above.

### 🚨 Clean Up After ContribFest

**Codespaces do NOT auto-delete!** To avoid charges:

- Delete via browser: https://github.com/codespaces
- Or via CLI: `gh codespace delete -c <codespace-name>`

---

## Troubleshooting

### Local Setup Issues

**"Error: Invalid Semantic Version" when running make**:
This is the most common issue! GitHub forks don't include tags by default, but the build process needs them.

**Solution**:
```bash
git fetch --tags https://github.com/cert-manager/cert-manager.git
```

Then try `make verify` again.

**"Permission denied" when running scripts**:
```bash
chmod +x ./scripts/server
```

**npm permission errors**:
Don't use `sudo`! Fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Go: "imports ... is not in GOROOT"**:
```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

**make: command not found**:
```bash
# macOS
xcode-select --install

# Ubuntu/WSL
sudo apt-get install build-essential
```

**Corporate proxy/VPN issues**:
- Some corporate networks block GitHub or npm registries
- Try disconnecting from VPN if possible
- Or ask IT for proxy configuration

### Codespaces Issues

**Codespace creation fails or is disabled**:
- Your organization may have disabled Codespaces
- Corporate accounts often don't have free tier access
- **Solution**: Use local setup with WSL or a VM

**Codespace is slow**:
- Try upgrading machine type in settings
- Or switch to local setup

---

## What to Bring to ContribFest

- **Laptop**:
  - Fully charged battery + charger
  - WiFi configured
  - WSL or Linux VM already set up if you're on Windows
- **GitHub account**:
  - Personal account recommended
  - Credentials ready (logged in or have PAT handy)
- **Development environment set up** (see above)
- **Slack** open to `#cert-manager-dev`
- **Positive attitude** — all skill levels welcome!

---

## Resources

- **Good First Issues**: https://github.com/search?q=org%3Acert-manager+label%3A%22good+first+issue%22+state%3Aopen&type=issues
- **Curated ContribFest Shortlist**: [Good First Issues](shortlist.md)
- **Contributor Guide**: https://cert-manager.io/docs/contributing/
- **Slack**: https://slack.k8s.io/ → `#cert-manager-dev`
- **WSL Install**: https://learn.microsoft.com/en-us/windows/wsl/install
- **GitHub CLI**: https://cli.github.com/

---

**See you at ContribFest! 🎉**
