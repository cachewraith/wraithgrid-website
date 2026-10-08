#!/usr/bin/env bash
# Stand-in for claude / gemini / agy in scripts/screenshots.cjs: prints a scripted session
# for the pane's folder, then waits. api-server keeps a spinner going so it reads as running.
cli=$(basename "$0")
[ "$1" = "--version" ] && { echo "2.4.1 ($cli)"; exit 0; }
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
