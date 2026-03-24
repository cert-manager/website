---
title: ContribFest Session Agenda — KubeCon EU 2026
description: 'What to expect during the 75-minute ContribFest session'
---

**Event**: [ContribFest: Dive Into cert-manager and Start Contributing!](https://kccnceu2026.sched.com/event/2EF7L/contribfest-dive-into-cert-manager-and-start-contributing-richard-wall-mladen-rusev-palo-alto-networks)  
**Date**: Tuesday, March 24, 2026  
**Time**: 16\:15 - 17\:30 CET (75 minutes)  
**Presenters**: Richard Wall & Mladen Rusev (Palo Alto Networks)

---

## Session Goals

### For Maintainers
- **Grow the contributor base**: Welcome new contributors to the cert-manager community
- **Get help with backlog issues**: Make progress on good-first-issue backlog
- **Build community engagement**: Create positive first-contribution experiences
- **Identify potential new maintainers**: Find contributors who might become long-term participants

### For Attendees
- **Learn Kubernetes internals hands-on**: See how cert-manager works under the hood
- **Get a CNCF contribution on resume**: Real contribution to a graduated CNCF project
- **Network with maintainers**: Direct access to project experts
- **Gain confidence contributing to open source**: Supportive environment for first-timers

**⚠️ PRESENTER REMINDER**: State these goals clearly during the introduction!

---

## Pre-Session Checklist

### For Maintainers (Before Event)

- [ ] Test Slack #cert-manager-dev channel access (in case attendees need help)
- [ ] Ensure shortlist gist is publicly accessible
- [ ] Make GitHub Project public (or keep private and use gist only)
- [ ] Prepare printed/projected shortlist for in-person reference
- [ ] Have cert-manager laptop stickers/swag ready (if available)

### For Attendees (Recommended Setup)

We recommend attendees prepare before the session to maximize hands-on time:

- [ ] Bring laptop with:
  - Git installed and configured
  - GitHub account with SSH/HTTPS access configured
  - Go 1.21+ (for Go issues) or Node.js 20+ (for website issues)
  - Code editor (VS Code, vim, etc.)
- [ ] Join [Kubernetes Slack](https://slack.k8s.io/) and find `#cert-manager-dev`
- [ ] Review the [Contributor Guide](https://cert-manager.io/docs/contributing/)
- [ ] Browse the [good first issues shortlist](shortlist.md)

---

## Session Outline

### 16\:15 - 16\:25 | Welcome & Introduction (10 min)

**Presenters introduce themselves and the session:**

- Welcome to ContribFest and cert-manager!
- Who are we? (Richard & Mladen backgrounds)
- What is cert-manager?
  - Graduated CNCF project
  - X.509 certificate management for Kubernetes
  - Widely deployed, active community
- **STATE THE GOALS** (see above)
  - Why we're here as maintainers
  - What attendees will gain from this session

**Quick poll:**
- Who's used cert-manager in production?
- Who's contributed to open-source before?
- Who's here for their first contribution?

---

### 16\:25 - 16\:40 | Getting Started (15 min)

**Quick setup check and orientation:**

1. **Environment Check** (5 min)
   - Raise hands: who has Go installed? Node.js? Git configured?
   - Point to setup guide if needed (post link in Slack)
   - Helpers circulate to assist with setup issues

2. **Finding an Issue** (10 min)
   - Walk through the [shortlist](shortlist.md)
   - Explain categories:
     - **No Go Required**: Docs, Helm, YAML (good for beginners)
     - **Go — Well Scoped**: Self-contained Go fixes
     - **Stretch Goals**: Larger features for experienced contributors
   - How to claim an issue:
     - Comment on the GitHub issue: "I'd like to work on this for ContribFest"
     - Ask questions in comments or Slack
   - **Live demo**: Walk through one "No Go Required" issue from start to PR

---

### 16\:40 - 17\:20 | Hands-On Contribution Time (40 min)

**Attendees work on their chosen issues:**

- Maintainers circulate to help with:
  - Choosing an appropriate issue
  - Setting up development environment
  - Understanding the codebase
  - Testing changes
  - Creating pull requests

**Milestones to celebrate:**
- First repo clone
- First local build
- First test run
- First commit
- First PR opened

**Slack channel**:
- Post in `#cert-manager-dev` with questions
- Tag Richard (`@wallrj`) or Mladen (`@mladen-rusev-cyberark`) for help

**Common questions to address:**
- "I'm stuck on Go module errors" → Point to contributor guide's Go setup
- "How do I run tests?" → Show repo-specific test commands
- "Is this change correct?" → Quick code review on the spot
- "I don't know Go, what can I do?" → Steer to website/docs issues

---

### 17\:20 - 17\:30 | Wrap-Up & Next Steps (10 min)

**Celebrate contributions:**
- Quick round: Who opened their first PR?
- Who made their first cert-manager contribution?
- Who learned something new about Kubernetes?

**What happens next:**
- Maintainers will review all ContribFest PRs within the next week
- Continue working on your issue after the session — no rush!
- Join `#cert-manager-dev` for ongoing support
- Follow cert-manager on social media for updates

**Stay connected:**
- [Slack](https://cert-manager.io/docs/contributing/#slack): `#cert-manager` and `#cert-manager-dev`
- [BlueSky](https://bsky.app/profile/cert-manager.bsky.social): @cert-manager.bsky.social
- [Mastodon](https://infosec.exchange/@CertManager): @CertManager@infosec.exchange
- [Twitter/X](https://twitter.com/certmanager): @certmanager
- [Contributor meetings](https://cert-manager.io/docs/contributing/): Bi-weekly on Wednesdays

**Thank you for contributing!**

---

## Presenter Notes

### Richard's Responsibilities

- **Introduction** (5 min): Project overview, state the goals
- **Demo** (10 min): Walk through filing a PR for a docs issue
- **Hands-on support**: Focus on website/docs contributors
- **Wrap-up** (5 min): Celebrate wins, next steps

### Mladen's Responsibilities

- **Introduction** (5 min): Maintainer perspective, state the goals from contributor angle
- **Issue selection guidance** (5 min): Help match attendees to issues
- **Hands-on support**: Focus on Go code contributors
- **Wrap-up** (5 min): Review process, how to get PRs merged

### Helper Instructions (if we have additional helpers)

- Circulate during hands-on time
- Watch for:
  - People staring at screens without typing → offer help
  - Git/GitHub authentication issues
  - Build/test errors
  - "This seems too hard" → suggest easier issue
- Keep track of firsts (first PR, first contribution, etc.) for wrap-up celebration

### Backup Plan

If we have fewer attendees than expected:
- More 1\:1 pairing with maintainers
- Go deeper on specific issues
- Extended Q&A about cert-manager architecture

If we have more attendees than expected:
- Split into two tracks: docs/website and Go code
- Pair newcomers with experienced contributors
- Focus on getting PRs filed (reviews can happen async)

---

## Resources to Have Ready

- Shortlist: [Good First Issues](shortlist.md)
- Tracking issue: https://github.com/cert-manager/cert-manager/issues/8641
- Planning board: https://github.com/orgs/cert-manager/projects/10
- Contributor guide: https://cert-manager.io/docs/contributing/
- Slack invite: https://slack.k8s.io/

---

## Post-Session Follow-Up

Within 1 week:
- [ ] Review all ContribFest PRs
- [ ] Tag PRs with `contribfest` label
- [ ] Post thank-you message in Slack with stats (X PRs opened, Y contributors)
- [ ] Share photos/highlights on social media
- [ ] Update tracking issue with outcomes

Within 1 month:
- [ ] Blog post: "ContribFest Recap" with stats and contributor shout-outs
- [ ] Follow up with contributors whose PRs stalled
- [ ] Invite active ContribFest contributors to join community meetings
