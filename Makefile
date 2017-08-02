JEKYLL_SERVER := jekyll server --verbose --trace

.DEFAULT: server
.PHONY: serve server build clean install reinstall

serve: server
reinstall: clean install

server:
	@echo "bundle exec $(JEKYLL_SERVER)"
	@trap 'kill $$$$' INT; \
	bundle exec $(JEKYLL_SERVER) --open-url & \
	while fswatch --one-event --timestamp ./_config.yml; do \
		pkill -KILL -fl "$(JEKYLL_SERVER)"; \
		bundle exec $(JEKYLL_SERVER) & \
	done

build:
	bundle exec jekyll build

clean:
	git reset --hard
	git clean -d --force
	bundle exec jekyll clean
	rm -Rf .bundle Gemfile.lock

install:
	@if ! type -P brew > /dev/null; then /usr/bin/ruby -e "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"; else echo "homebrew ....... ok"; fi
	@if ! type -P fswatch > /dev/null; then brew install fswatch; else echo "fswatch ........ ok"; fi
	@if ! type -P rbenv > /dev/null; then brew install rbenv rbenv-vars; else echo "rbenv .......... ok (assuming rbenv-vars is ok too)"; fi
	@if [[ $$(ruby -e 'puts RUBY_VERSION') != $$(cat .ruby-version) ]]; then rbenv install $$(cat .ruby-version) && rbenv local $$(cat .ruby-version); else echo "ruby-$$(cat .ruby-version) ..... ok"; fi
	@if ! type -P bundle > /dev/null; then gem install bundler; else echo "bundler ........ ok"; fi
	@if [[ -z $$(ruby -e 'puts ENV["JEKYLL_GITHUB_TOKEN"]') ]]; then echo ""; read -p "Enter github personal access token: " JEKYLL_GITHUB_TOKEN; echo "JEKYLL_GITHUB_TOKEN?=$${JEKYLL_GITHUB_TOKEN}" > .rbenv-path; else echo "github token ... ok"; fi
	@echo
	bundle install --path .bundle
