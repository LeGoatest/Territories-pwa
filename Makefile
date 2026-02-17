.PHONY: build clean sync-assets tailwind

dist/css/output.css: src/input.css
	npx @tailwindcss/cli -i src/input.css -o dist/css/output.css

sync-assets:
	cp -r src/assets/* dist/assets/ 2>/dev/null || true
	cp -r src/fragments/* dist/fragments/ 2>/dev/null || true
	cp src/index.html dist/ 2>/dev/null || true
	cp src/manifest.json dist/ 2>/dev/null || true
	cp src/sw.js dist/ 2>/dev/null || true

build: sync-assets dist/css/output.css

clean:
	rm -rf dist/*
	mkdir -p dist/fragments dist/css dist/assets
