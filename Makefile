.PHONY: build clean

docs/assets/css/output.css: docs/assets/css/input.css docs/index.html docs/sw.js
	npx tailwindcss -i docs/assets/css/input.css -o docs/assets/css/output.css

build: docs/assets/css/output.css

clean:
	rm -f docs/assets/css/output.css
