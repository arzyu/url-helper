function die() {
  echo "$@" >&2; exit 1
}

if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree *NOT* clean."
fi

current_branch="$(git symbolic-ref --short -q HEAD)"
current_branch=${current_branch:-master}

tmp_branch="deploy-www"

git checkout -B $tmp_branch master
git add -f www/app.html
git commit -m "scripts(deploy): generate gh-pages"

if [[ -n "$(git rev-parse --verify --quiet gh-pages)" ]]; then
  git branch -D gh-pages
fi

git subtree split --prefix=www -b gh-pages
git push -f origin gh-pages:gh-pages
git checkout $current_branch
git branch -D gh-pages $tmp_branch
