# Shared helpers for episodes/*/replay.sh (source this file, do not run it).
#
# Each replay works in a temporary folder: a bare repo stands in for GitHub,
# and a clone of it is the student's calculator-app. Nothing in the
# calculator-app you pass in is changed.
set -euo pipefail

src="$(cd "${1:?請指定 calculator-app 的本機路徑}" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null   # ignore personal git settings (signing, aliases)
export GIT_EDITOR=true               # accept default messages (git revert, git merge)

# print a command like a terminal prompt, then run it
run() { echo; echo "\$ $*"; "$@"; }

# make_remote <commit>: the "GitHub" repo, with main at <commit>
make_remote() {
  git clone -q --bare "$src" "$work/remote.git"
  git -C "$work/remote.git" for-each-ref --format='%(refname)' refs/heads refs/tags |
    while read -r ref; do git -C "$work/remote.git" update-ref -d "$ref"; done
  git -C "$work/remote.git" update-ref refs/heads/main "$1"
}
# remote_ref <name> <commit>: create or move a branch on "GitHub" (e.g. a merge done on the web)
remote_ref() { git -C "$work/remote.git" update-ref "refs/heads/$1" "$2"; }

# clone_local: the student's clone, entered as the current directory
clone_local() {
  git clone -q "$work/remote.git" "$work/calculator-app"
  cd "$work/calculator-app"
  git config commit.gpgsign false
  git config tag.gpgsign false
}

# take <commit> <file>...: copy files exactly as they are in <commit> of calculator-app
take() { local c=$1; shift; for f in "$@"; do git -C "$src" show "$c:$f" > "$f"; done; }

# commit_as <name> <email> <unix-time> <message>: commit with a fixed author and time,
# so the hash is the same every run (and equals calculator-app's when the content matches)
commit_as() {
  echo; echo "\$ git commit -m \"$4\""
  GIT_AUTHOR_NAME="$1" GIT_AUTHOR_EMAIL="$2" GIT_AUTHOR_DATE="$3 +0800" \
  GIT_COMMITTER_NAME="$1" GIT_COMMITTER_EMAIL="$2" GIT_COMMITTER_DATE="$3 +0800" \
    git commit -m "$4"
}
# commit_like <commit>: commit_as with the author, time and message of a calculator-app commit
commit_like() {
  commit_as "$(git -C "$src" log -1 --format=%an "$1")" "$(git -C "$src" log -1 --format=%ae "$1")" \
            "$(git -C "$src" log -1 --format=%at "$1")" "$(git -C "$src" log -1 --format=%s "$1")"
}

# check <commit-ish> <expected-full-hash> <text>: confirm a hash matches calculator-app
check() {
  if [ "$(git rev-parse "$1")" = "$2" ]; then echo "✓ $3"; else echo "✗ $3（實際是 $(git rev-parse --short "$1")）"; return 1; fi
}
