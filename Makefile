PLOVR_JAR=plovr-4b3caf2b7d84.jar

.PHONY: serve
serve: $(PLOVR_JAR)
	java -jar $(PLOVR_JAR) serve mvcobject.json

.PHONY: lint
lint: $(CLOSURE_LINTER)
	gjslint --strict $(shell find src tests -name \*.js)

$(PLOVR_JAR):
	curl http://plovr.googlecode.com/files/$(PLOVR_JAR) > $@
