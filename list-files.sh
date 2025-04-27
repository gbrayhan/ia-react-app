#!/usr/bin/env bash

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
  "txt"
  "pdf"
  "log"
)

is_in_blacklisted_dir() {
  local f="$1"
  for d in "${BLACKLIST_DIRS[@]}"; do
    [[ "$f" == "$d/"* || "$f" == */"$d/"* || "$f" == */"$d"* ]] && return 0
  done
  return 1
}

is_blacklisted_file() {
  local f="$(basename "$1")"
  for b in "${BLACKLIST_FILES[@]}"; do
    [[ "$f" == "$b" ]] && return 0
  done
  return 1
}

is_blacklisted_extension() {
  local ext="${1##*.}"
  for e in "${BLACKLIST_EXTENSIONS[@]}"; do
    [[ "$ext" == "$e" ]] && return 0
  done
  return 1
}

echo "["

first=1
while IFS= read -r file; do
  rel="${file#./}"
  if is_in_blacklisted_dir "$rel"; then continue; fi
  if is_blacklisted_file "$rel"; then continue; fi
  if is_blacklisted_extension "$rel"; then continue; fi

  if [ $first -eq 0 ]; then
    echo ","
  fi
  echo -n "  \"$rel\""
  first=0
done < <(find . -type f | sort)

echo
echo "]"
