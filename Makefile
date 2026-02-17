.PHONY: build clean sync-assets tailwind

docs/css/output.css: src/input.css
	npx @tailwindcss/cli -i src/input.css -o docs/css/output.css

sync-assets:
	mkdir -p docs/fragments docs/css docs/assets
	cp -r src/assets/* docs/assets/ 2>/dev/null || true
	cp -r src/fragments/* docs/fragments/ 2>/dev/null || true
	cp src/index.html docs/ 2>/dev/null || true
	cp src/manifest.webmanifest docs/ 2>/dev/null || true
	cp src/sw.js docs/ 2>/dev/null || true
	cp src/js/*.js docs/js/ 2>/dev/null || true

build: sync-assets docs/css/output.css

clean:
	rm -rf docs/*
	mkdir -p docs/fragments docs/css docs/assets docs/js
