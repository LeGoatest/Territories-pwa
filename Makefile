.PHONY: build clean tailwind

docs/css/output.css: docs/input.css docs/index.html docs/js/*.js docs/fragments/*.html
	npx @tailwindcss/cli -i docs/input.css -o docs/css/output.css

build: docs/css/output.css

clean:
	# Since docs is now source, we only clean the output artifact
	rm -f docs/css/output.css
