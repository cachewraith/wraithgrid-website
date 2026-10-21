#!/usr/bin/env bash
# Stand-in for claude / gemini / agy in scripts/screenshots.cjs: prints a scripted session
# for the pane's folder, then waits. api-server keeps a spinner going so it reads as running.
cli=$(basename "$0")
[ "$1" = "--version" ] && { echo "2.4.1 ($cli)"; exit 0; }
# `claude plugin list`: what the Mods screen asks each account for. The catalog is the eight
# most installed entries of the official marketplace, as claude listed them on 2026-10-13.
if [ "$1" = "plugin" ]; then
  mod() { printf '{"id":"%s@claude-plugins-official","version":"%s","scope":"user","enabled":%s}' "$1" "$2" "$3"; }
  case "$3" in
  --available)
    cat <<'JSON'
{"installed": [], "available": [{"pluginId": "frontend-design@claude-plugins-official", "name": "frontend-design", "description": "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 1290640, "source": {}}, {"pluginId": "superpowers@claude-plugins-official", "name": "superpowers", "description": "Superpowers teaches Claude brainstorming, subagent driven development with built in code review, systematic debugging, and red/green TDD. Additionally, it teaches Claude how to author and test new skills.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 1153057, "source": {"url": "https://github.com/obra/superpowers.git"}}, {"pluginId": "code-review@claude-plugins-official", "name": "code-review", "description": "Automated code review for pull requests using multiple specialized agents with confidence-based scoring to filter false positives", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 492072, "source": {}}, {"pluginId": "context7@claude-plugins-official", "name": "context7", "description": "Upstash Context7 MCP server for up-to-date documentation lookup. Connects to Context7’s hosted remote MCP server (https://mcp.context7.com/mcp) — no local Node.js or npx required — to pull version-specific documentation and code examples directly from source repositories into your LLM context. Works anonymously out of the box; set CONTEXT7_API_KEY for higher rate limits.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 458090, "source": {}}, {"pluginId": "skill-creator@claude-plugins-official", "name": "skill-creator", "description": "Create new skills, improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, or benchmark skill performance with variance analysis.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 440508, "source": {}}, {"pluginId": "code-simplifier@claude-plugins-official", "name": "code-simplifier", "description": "Agent that simplifies and refines code for clarity, consistency, and maintainability while preserving functionality. Focuses on recently modified code.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 382698, "source": {}}, {"pluginId": "playwright@claude-plugins-official", "name": "playwright", "description": "Browser automation and end-to-end testing MCP server by Microsoft. Enables Claude to interact with web pages, take screenshots, fill forms, click elements, and perform automated browser testing workflows.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 367020, "source": {}}, {"pluginId": "github@claude-plugins-official", "name": "github", "description": "Official GitHub MCP server for repository management. Create issues, manage pull requests, review code, search repositories, and interact with GitHub’s full API directly from Claude Code.", "marketplaceName": "claude-plugins-official", "version": null, "installCount": 354371, "source": {}}]}
JSON
    ;;
  *)
    case "$(basename "$CLAUDE_CONFIG_DIR")" in
    work) echo "[$(mod superpowers 5.0.7 true),$(mod code-review 1.0.0 true),$(mod playwright 1.0.0 false)]" ;;
    client-acme) echo "[$(mod github 1.0.0 true)]" ;;
    *) echo "[]" ;;
    esac ;;
  esac
  exit 0
fi
E=$'\e'; R="$E[0m"; B="$E[1m"; D="$E[2m"; G="$E[32m"; RD="$E[31m"; Y="$E[33m"; O="$E[38;5;209m"; C="$E[36m"; BL="$E[38;5;75m"; M="$E[38;5;141m"
dot="${G}●${R}"
tool() { printf '%s %s%s%s(%s)\n' "$dot" "$B" "$1" "$R" "$2"; }
res()  { printf '  %s⎿%s  %s\n\n' "$D" "$R" "$1"; }
user() { printf '%s>%s %s\n\n' "$D" "$R" "$1"; }
case "$(basename "$PWD")" in
api-server)
  user "Add rate limiting to the /login endpoint"
  tool Read "src/routes/auth.ts"; res "Read 142 lines"
  tool Update "src/routes/auth.ts"; res "Updated with ${G}18 additions${R} and ${RD}2 removals${R}"
  printf '     %s+ const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 })%s\n' "$G" "$R"
  printf '     %s+ router.post(%s/login%s, loginLimiter, login)%s\n' "$G" "'" "'" "$R"
  printf '     %s- router.post(%s/login%s, login)%s\n\n' "$RD" "'" "'" "$R"
  tool Bash "pnpm test auth"; res "${G}✓${R} 23 passed"
  frames=('✻' '✶' '✳' '✢' '·' '✢' '✳' '✶'); i=0; s=17
  while true; do
    printf '\r\e[2K%s%s Writing tests…%s %s(%ss · esc to interrupt)%s' "$O" "${frames[i%8]}" "$R" "$D" "$s" "$R"
    i=$((i+1)); [ $((i%3)) = 0 ] && s=$((s+1)); sleep 0.3
  done ;;
web-app)
  printf '%s ███ GEMINI%s\n\n' "$BL" "$R"
  user "Why does the settings page flash on load?"
  printf ' %s✓%s  %sSearchText%s \x27useTheme\x27 in src  %s→ 6 matches%s\n' "$G" "$R" "$B" "$R" "$D" "$R"
  printf ' %s✓%s  %sReadFile%s src/app/providers.tsx\n' "$G" "$R" "$B" "$R"
  printf ' %s✓%s  %sEdit%s src/app/layout.tsx  %s+9%s\n\n' "$G" "$R" "$B" "$R" "$G" "$R"
  printf '%s✦%s The theme was read in %suseEffect%s, so the first paint used the\n  default. It is now set by an inline script before React hydrates.\n\n' "$M" "$R" "$BL" "$R"
  printf '%s>%s %sType your message or @path/to/file%s\n\n' "$BL" "$R" "$D" "$R"
  printf '%s~/code/web-app (main*) · gemini-2.5-pro%s\n' "$D" "$R"
  while read -r _; do :; done ;;
infra)
  user "Bump the staging cluster to the new node pool"
  tool Read "terraform/staging/main.tf"; res "Read 211 lines"
  tool Update "terraform/staging/main.tf"; res "Updated with ${G}4 additions${R} and ${RD}4 removals${R}"
  printf '%s●%s %sBash command%s\n\n' "$Y" "$R" "$B" "$R"
  printf '   terraform plan -out=staging.plan\n   %sPlan the staging changes%s\n\n' "$D" "$R"
  printf ' Do you want to proceed?\n %s❯ 1. Yes%s\n   2. Yes, and don\x27t ask again for terraform plan\n   3. No, and tell Claude what to do differently %s(esc)%s\n' "$C" "$R" "$D" "$R"
  while read -r _; do :; done ;;
mobile)
  user "Write tests for the offline sync queue"
  tool Read "lib/sync/queue.dart"; res "Read 96 lines"
  tool Write "test/sync/queue_test.dart"; res "Wrote 74 lines"
  tool Bash "flutter test test/sync"; res "${G}✓${R} 11 passed"
  printf '%s●%s Added 11 tests covering retry, ordering and conflict handling.\n\n' "$O" "$R"
  printf '%s────────────────────────────────────────────%s\n%s>%s \n' "$D" "$R" "$D" "$R"
  while read -r _; do :; done ;;
*)
  user "Summarize the open issues"
  while read -r _; do :; done ;;
esac
