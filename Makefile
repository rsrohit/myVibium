.PHONY: build clean clean-bin clean-cache clean-all help

# Build clicker binary
build:
	cd clicker && go build -o bin/clicker ./cmd/clicker

# Clean clicker binaries
clean-bin:
	rm -rf clicker/bin

# Clean cached Chrome for Testing
clean-cache:
	rm -rf ~/Library/Caches/vibium/chrome-for-testing
	rm -rf ~/.cache/vibium/chrome-for-testing

# Clean everything (binaries + cache)
clean-all: clean-bin clean-cache

# Alias for clean-bin
clean: clean-bin

# Show available targets
help:
	@echo "Available targets:"
	@echo "  make build       - Build clicker binary"
	@echo "  make clean       - Clean clicker binaries"
	@echo "  make clean-cache - Clean cached Chrome for Testing"
	@echo "  make clean-all   - Clean binaries and cache"
	@echo "  make help        - Show this help"
