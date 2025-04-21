#!/usr/bin/env bash
exec > react-project-content.txt 2>&1

BLACKLIST_DIRS=(
  "node_modules"
  "public"
  ".next"
  ".git"
  "coverage"
  "build"
  "dist"
  "cypress/videos"
)

BLACKLIST_FILES=(
  ".env"
  ".env.local"
  ".gitignore"
  "README.md"
  "LICENSE"
  "yarn.lock"
  "package-lock.json"
  "react-project-content.bash"
)

BLACKLIST_EXTENSIONS=(
  "md"
  "log"
  "map"
  "test.js"
  "test.ts"
  "snap"
)

is_in_blacklisted_dir() {
  local f="$1"
  for d in "${BLACKLIST_DIRS[@]}"; do
    [[ "$f" == "$d/"* || "$f" == "$d"*"/"* ]] && return 0
  done
  return 1
}

is_blacklisted_file() {
  local f="$1"
  for b in "${BLACKLIST_FILES[@]}"; do
    [[ "$f" == "$b" ]] && return 0
  done
  return 1
}

is_blacklisted_extension() {
  local f="$1"
  [[ "$f" != *.* ]] && return 1
  local ext="${f##*.}"
  ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
  for b in "${BLACKLIST_EXTENSIONS[@]}"; do
    [[ "$ext" == "$b" ]] && return 0
  done
  return 1
}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run inside a Git repository."
  exit 1
fi

git ls-files --cached --others --exclude-standard -z |
while IFS= read -r -d '' file; do
  if is_in_blacklisted_dir "$file" || is_blacklisted_file "$file" || is_blacklisted_extension "$file"; then
    continue
  fi

  echo "File: $file"
  echo "Content:"
  echo "---"
  cat "$file"
  echo "---"
  echo
done
